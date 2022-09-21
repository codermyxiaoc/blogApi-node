const express = require('express')
const config = require('./token/config')
//插件导入
const cors = require('cors')
const joi = require('joi')
const { expressjwt: jwt } = require('express-jwt')

//路由导入
const user_router = require('./router/user')
const userinfo_router = require('./router/userinfo')
const article_router = require('./router/article')
const replyuser_router = require('./router/comment')

const app = express()
//插件挂载
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})


app.use(express.static('./headpro'))
app.use(jwt({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({ path: [/^\/api/] }))

//路由挂载
app.use('/api',user_router)
app.use('/my',userinfo_router)
app.use('/art',article_router)
app.use('/art', replyuser_router)

app.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError) {
        return res.cc(err)
    }
    if (err.name === 'UnauthorizedError') {
        return res.cc('身份认证失败')
    }
    res.cc(err)
})



//测试地址
app.listen(80,()=> {
    console.log('http://127.0.0.1');
})
//服务器地址
/* app.listen(8080, () => {
    console.log('http://127.0.0.1');
}) */