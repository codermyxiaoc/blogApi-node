const db = require('../mysql/index')
const { dateFormat } = require('../dateFormat/index')
exports.addart_func = (req,res) => {
    const sqladd = 'insert into comment set ?'
    const date = dateFormat(new Date())
    db.query(sqladd,{user_id: req.auth.user_id,content: req.body.content,createtime: date}, (err,results) => {
        if (err) { return res.cc(err) }
        if (results.affectedRows !== 1) { return res.cc('添加文章失败') }
        res.send({
            status: 0,
            message: '添加成功'
        })
    })
}

exports.deleteart_func = (req,res) => {
    const sqldel = 'delete from comment where user_id=? and comment_id=?'
    db.query(sqldel,[req.auth.user_id,req.body.comment_id],(err,results) => {
        if (err) { return res.cc(err) }
        if (results.affectedRows !== 1) { return res.cc('删除失败') }
        res.send({
            status: 0,
            message: '删除成功'
        })
    })

}