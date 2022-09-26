const db = require('../mysql/index')
const bcryptjs = require('bcryptjs')
const { dateFormat } = require('../dateFormat/index')
const jwt = require("jsonwebtoken")
const config = require('../token/config')
const sendcode = require('../code/sendcode')
const { creatcUser_template, forget_template, phoneLogin_template } = require('../code/template')
const client = require('../redis/idnex')
const { promisify } = require('util')
const getAsync = promisify(client.get).bind(client)

exports.createuser_func = (req,res) => {
    const sqlfind = 'select * from ev_users where username=? or cell_phone=?'
    const userinfo = req.body
    db.query(sqlfind, [userinfo.username, userinfo.cell_phone],async (err,results) => {
        if(err) { return res.cc(err) }
        if(results.length > 0) { return res.cc('已有此名称或手机号') }
        userinfo.password = bcryptjs.hashSync(userinfo.password, 10)
        userinfo.createtime = dateFormat(new Date())
        let codekey = `${req.body.cell_phone}currentCodeKey${userinfo.code}`
        let phonekey = `currentPhoneeKey${userinfo.cell_phone}`
        let code = await getAsync(codekey)
        let phone = await getAsync(phonekey)
        if (code == null || phone == null) {
           return res.cc('验证码已过期')
        }
       if (code == userinfo.code && phone == userinfo.cell_phone) {
            const sqladd = 'insert into ev_users set ?'
            delete userinfo.code
            db.query(sqladd, userinfo, (err, results) => {
                if (err) { return res.cc(err) }
                client.del(codekey)
                client.del(phonekey)
                if (results.affectedRows !== 1) { return res.cc('注册失败,请稍后再试') }
                res.cc('注册成功', 0)
            })
        } else {
            res.cc('验证码错误')
        }
    })
}

exports.namelogin_func = (req,res) => {
    const sqlfind = 'select * from ev_users where username=? and status=0'
    db.query(sqlfind,req.body.username,(err,results) => {
        if(err) { return res.cc(err) }
        if(results.length !== 1) { return res.cc('无用户') }
        if (!bcryptjs.compareSync(req.body.password, results[0].password)) { return res.cc('密码错误') }
        const user = {...results[0], password: '', user_pic: ''}
        const tokenStr = jwt.sign(user,config.jwtSecretKey,{expiresIn: config.expiresIn})
        res.send({
            status: 0,
            message: '登入成功',
            token: 'Bearer ' + tokenStr,
        })
    })
}

exports.phonelogin_func = (req,res) => {
    const sqlfind = 'select * from ev_users where cell_phone=? and status=0'
    db.query(sqlfind,req.body.cell_phone,async (err,results) => {
        if(err) {return res.cc(err) }
        if (results.length !== 1) { return res.cc('无用户') }
        let logincodekey = `${req.body.cell_phone}logincode${req.body.code}`
        let loginphonekey = `logincode${req.body.cell_phone}`
        let code = await getAsync(logincodekey)
        let phone = await getAsync(loginphonekey)
        if(code == null || phone == null) return res.cc('验证码错误')
        client.del(logincodekey)
        client.del(loginphonekey)
        const user = { ...results[0], password: '', user_pic: '' }
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        res.send({
            status: 0,
            message: '登入成功',
            token: 'Bearer ' + tokenStr
        })
    })
}

exports.getCode_func = async (req,res) => {
    let verCode = String(1000 + parseInt(Math.random() * 1000000)).substr(0, 4);
    const result = await sendcode(req.body.cell_phone, verCode, creatcUser_template)  
    if (result.Code === 'OK') {
        let codekey = `${req.body.cell_phone}currentCodeKey${verCode}`
        let phonekey = `currentPhoneeKey${req.body.cell_phone}`
        let flag1 =client.set(codekey,verCode)
        let flag2 = client.set(phonekey,req.body.cell_phone)
        if (flag1 && flag2) {
            client.expire(codekey, 120)
            client.expire(phonekey, 120)
            res.send({
                status: 0,
                code: 'OK'
            })
        }
    }
}
exports.forgetPowcode_func = (req,res) => {
    let sqlfind = 'select * from ev_users where cell_phone = ?'
    db.query(sqlfind, req.body.cell_phone,async (err,result) => {
        if(result.length == 0) return res.cc('此用户还未注册，请先注册')
        let verCode = String(1000 + parseInt(Math.random() * 1000000)).substr(0, 4);
        let coderesult = await sendcode(req.body.cell_phone, verCode, forget_template) 
        if (coderesult.Code == 'OK') {
            let forgetcodekey = `${req.body.cell_phone}forgetcode${verCode}`
            let forgetphonekey = `forgetcode${req.body.cell_phone}`
            let flag1 = client.set(forgetcodekey,verCode)
            let flag2 = client.set(forgetphonekey, req.body.cell_phone)
            if(flag1 && flag2) {
                client.expire(forgetcodekey,120)
                client.expire(forgetphonekey, 120)
                res.send({
                    status: 0,
                    code: 'OK'
                })
            }

        }
    })
}
exports.forgetPow_func = async (req,res) => {
    let info = req.body
    let forgetcodekey = `${req.body.cell_phone}forgetcode${info.code}`
    let forgetphonekey = `forgetcode${info.cell_phone}`
    let code = await getAsync(forgetcodekey)
    let phone = await getAsync(forgetphonekey)
    if(code == null || phone == null) {
        return res.cc('验证码错误')
    }
    let password = bcryptjs.hashSync(info.Pwdtow, 10)
    const sqlfind = 'update ev_users set password = ? where cell_phone = ? '
    db.query(sqlfind,[password,info.cell_phone],async (err,result) => {
        if(err) return res.cc(err)
        if (result.affectedRows !== 1) return res.cc('修改失败')
        client.del(forgetcodekey)
        client.del(forgetphonekey)
        res.send({
            status: 0,
            message: '修改成功'
        }) 
    })
    
}
exports.logincode_func = (req,res) => {
    let sqlfind = 'select * from ev_users where cell_phone = ?'
    db.query(sqlfind, req.body.cell_phone, async (err, result) => {
        if (result.length == 0) return res.cc('此用户还未注册，请先注册')
        let verCode = String(1000 + parseInt(Math.random() * 1000000)).substr(0, 4);
        let coderesult = await sendcode(req.body.cell_phone, verCode, phoneLogin_template)
        if (coderesult.Code == 'OK') {
            let logincodekey = `${req.body.cell_phone}logincode${verCode}`
            let loginphonekey = `logincode${req.body.cell_phone}`
            let flag1 = client.set(logincodekey, verCode)
            let flag2 = client.set(loginphonekey, req.body.cell_phone)
            if(flag1 && flag2) {
                client.expire(logincodekey, 120)
                client.expire(loginphonekey, 120)
                res.send({
                    status: 0,
                    message: 'OK'
                })
            }
        }
    })
}