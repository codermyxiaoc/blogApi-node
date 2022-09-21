const db = require('../mysql/index')
const bcryptjs = require('bcryptjs')
const { dateFormat } = require('../dateFormat/index')
const jwt = require("jsonwebtoken")
const config = require('../token/config')
const sendLoginCroeCode = require('../code/index')
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
        let codekey = `currentCodeKey${userinfo.code}`
        let phonekey = `currentPhoneeKey${userinfo.cell_phone}`
        let code = await getAsync(codekey)
        let phone = await getAsync(phonekey)
        if (code == null && phone == null) {
           return res.cc('验证码已过期')
        }
       if (code == userinfo.code && phone == userinfo.cell_phone) {
            const sqladd = 'insert into ev_users set ?'
            delete userinfo.code
            db.query(sqladd, userinfo, (err, results) => {
                if (err) { return res.cc(err) }
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
    db.query(sqlfind,req.body.cell_phone,(err,results) => {
        if(err) {return res.cc(err) }
        if (results.length !== 1) { return res.cc('无用户') }
        if(!bcryptjs.compareSync(req.body.password,results[0].password)) { return res.cc('密码错误')}
        const user = { ...results[0], password: '', user_pic: '' }
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        res.send({
            status: 0,
            message: 'Bearer ' + tokenStr
        })
    })
}

exports.getCode_func = async (req,res) => {
    let verCode = String(1000 + parseInt(Math.random() * 1000000)).substr(0, 4);
    const result = await sendLoginCroeCode(req.body.cell_phone, verCode)  
    if (result.Code === 'OK') {
        let codekey = `currentCodeKey${verCode}`
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