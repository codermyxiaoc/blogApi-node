const db  = require('../mysql/index')
exports.inquirerep_func = (req,res) => {
    const sqlfind1 = 'select * from comment order by createtime asc'
    const sqlfind2 = 'select nickname,sex,user_pic from ev_users where user_id=?'
    const sqlfind3 = 'select * from comment_reply where  comment_id=? order by createtime desc'
    var datarep = []
    db.query(sqlfind1, (err, results) => {
        datarep.push(...results)
        for(let i = 0 ; i < datarep.length; i++){
            db.query(sqlfind2, datarep[i].user_id, (err, results) => {
                datarep[i].nickname = results[0].nickname
                datarep[i].user_pic = results[0].user_pic
                db.query(sqlfind3, datarep[i].comment_id,(err,results) => {
                    datarep[i].rep = []
                    datarep[i].rep.push(...results) 
                    if (i === datarep.length-1) {
                        res.send({
                            status: 0,
                            message: datarep
                        }) 
                    }
                })
                
            })

        }
           
    })

}
exports.inqcomment_func = (req,res) => {
    const sqlfind1 = 'select * from comment_reply where comment_id=?'
    const sqlfind2 = 'select nickname,user_pic from ev_users where user_id=?'
    var datacom = []
    db.query(sqlfind1,req.body.comment_id,(err,results) => {
        datacom.push(...results)
        for (let i = 0; i < datacom.length; i++) {
            db.query(sqlfind2, datacom[i].user_id, (err, results) => {
                datacom[i].nickname = results[0].nickname
                datacom[i].user_pic = results[0].user_pic
                if (i === datacom.length - 1) {
                    res.send({
                        status: 0,
                        message: datacom
                    })
                }
            })
        }
        
    })
}