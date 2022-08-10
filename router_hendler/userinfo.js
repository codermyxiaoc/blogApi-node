const db = require('../mysql/index')
const fs = require('fs')
const path = require('path')
const bcryptjs = require('bcryptjs')

exports.userinfo_func = (req,res) => {
    const sqlfind = 'select user_id,nickname,user_pic,cell_phone,sex,email,per_sig from ev_users where user_id=?'  
    db.query(sqlfind,req.auth.user_id,(err,results) => {
        if(err) { return res.cc(err) }
        if(results.length !== 1) { return res.cc('查不到此用户信息') }
        res.send({
            status: 0,
            message: results[0]
        })
    })
}
exports.userupdate_func = (req,res) => {
    const sqlup = 'update ev_users set ? where user_id=?'
    db.query(sqlup, [req.body,req.auth.user_id],(err,results) => {
        if(err) {return res.cc(err) }
        if (results.affectedRows !== 1) {return res.cc('更改失败') }
        res.send({
            status: 0,
            message: '修改成功'
        })
    })
}
exports.headpor_func = (req,res) => {
     const sqlfind = 'select user_pic from ev_users where user_id=?'  
    db.query(sqlfind,req.auth.user_id,(err,results) => {
        if(err) { return res.cc(err) }
        if (results.length !== 1) { return res.cc('修改失败') }
        const olduser_pic = results[0].user_pic
        if(path.basename(olduser_pic).substr(0, 6) === 'avatar') {
           fs.unlinkSync(path.join(__dirname, "../headpro/" + path.basename(olduser_pic)))
        }
        const sqlup = 'update ev_users set ? where user_id=?'
        const user_pic = 'http://127.0.0.1/' + req.file.filename
        db.query(sqlup, [{ user_pic: user_pic }, req.auth.user_id], (err, results) => {

            if (err) { return res.cc(err) }
            if (results.affectedRows !== 1) { return res.cc('修改失败') }
            res.send({
                status: 0,
                message: '修改成功'
            })
        }) 
    })  
     
}
exports.updatepwd_func = (req,res) => {
    const sqlfind = 'select * from ev_users where user_id=?'
    db.query(sqlfind,req.auth.user_id,(err,results) => {
        if(err) {return res.cc(err) }
        if(results.length !== 1) { return res.cc('暂查无此用户，稍后再试') }
        if(!bcryptjs.compareSync(req.body.oldPwd,results[0].password)) { return res.cc('密码错误') }
        const newPwd = bcryptjs.hashSync(req.body.newPwd)
        const sqlup = 'update ev_users set password=? where user_id=?'
        db.query(sqlup,[newPwd,req.auth.user_id],(err,results) => {
            if(err) { return res.cc(err) }
            if(results.affectedRows !== 1) { return res.cc('修改失败')}
            res.send({
                status: 0,
                message: '修改成功'
            })
        })
        
    })
    
}
exports.offuser_func = (req,res) => {
    const sqlfind = 'select * from ev_users where user_id=?'
    db.query(sqlfind,req.auth.user_id,(err,results) => {
        if(err) { return res.cc(err) }
        if (results.length !== 1) { return res.cc('暂查无此用户，稍后再试') }
        if(!bcryptjs.compareSync(req.body.password,results[0].password)) { return res.cc('密码错误')}
        const sqlup = 'update ev_users set status=1 where user_id=?'
        db.query(sqlup,req.auth.user_id,(err,results) => {
            if (err) { return res.cc(err) }
            if (results.affectedRows !== 1) { return res.cc('注销失败') }
            res.send({
                status: 0,
                message: '注销成功'
            })
        })
    })
}