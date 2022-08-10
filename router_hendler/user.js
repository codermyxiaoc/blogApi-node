const db = require('../mysql/index')
const bcryptjs = require('bcryptjs')
const { dateFormat } = require('../dateFormat/index')
const jwt = require("jsonwebtoken")
const config = require('../token/config')

exports.createuser_func = (req,res) => {
    const sqlfind = 'select * from ev_users where username=? or cell_phone=?'
    const userinfo = req.body
    db.query(sqlfind, [userinfo.username, userinfo.cell_phone],(err,results) => {
        if(err) { return res.cc(err) }
        if(results.length > 0) { return res.cc('已有此名称或手机号') }
        userinfo.password = bcryptjs.hashSync(userinfo.password, 10)
        userinfo.createtime = dateFormat(new Date())
        const sqladd = 'insert into ev_users set ?'
        db.query(sqladd,userinfo,(err,results) => {
            if(err) { return res.cc(err) }
            if (results.affectedRows !== 1) { return res.cc('注册失败,请稍后再试')}
            res.cc('注册成功',0)
        })
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