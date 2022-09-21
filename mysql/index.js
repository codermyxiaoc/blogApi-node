const mysql = require('mysql')

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    //测试数据库
    password: 'root', 
    //服务器数据库
/*     password: 'czl812728', */
    database: 'my_blog',
})

module.exports = db