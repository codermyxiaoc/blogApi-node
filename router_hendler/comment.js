const db = require('../mysql/index')
const { dateFormat } = require('../dateFormat/index')
exports.addcom_func = (req, res) => {
    const sqladd = 'insert into comment_reply set ?'
    const date = dateFormat(new Date())
    const rep = {
        user_id: req.auth.user_id,
        content: req.body.content,
        comment_id: req.body.comment_id,
        createtime: date
    }
    db.query(sqladd, rep, (err, results) => {
        if (err) { return res.cc(err) }
        if (results.affectedRows !== 1) { return res.cc('添加评论失败') }
        res.send({
            status: 0,
            message: '添加成功'
        })
    })
}

exports.deletecom_func = (req, res) => {
    const sqldel = 'delete from comment_reply where user_id=? and replyuser_id=?'
    db.query(sqldel, [req.auth.user_id, req.body.replyuser_id], (err, results) => {
        if (err) { return res.cc(err) }
        if (results.affectedRows !== 1) { return res.cc('删除失败') }
        res.send({
            status: 0,
            message: '删除成功'
        })
    })

}