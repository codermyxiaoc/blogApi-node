const express = require('express')
const expressjoi = require('@escook/express-joi')

const router = express.Router()
//路由处理函数
const { createuser_func, namelogin_func , phonelogin_func} = require('../router_hendler/user')
const { inquirerep_func , inqcomment_func} = require('../inquirerep/index')
//规则
const { createuser_schema , namelogin_schema, phonelogin_schema } = require('../schema/user')
const { inpcomment_schema } = require('../schema/article')
//路由
router.post('/createuser', expressjoi(createuser_schema), createuser_func)
router.post('/namelogin', expressjoi(namelogin_schema), namelogin_func)
router.post('/phonelogin', expressjoi(phonelogin_schema), phonelogin_func)
router.get('/inpreq', inquirerep_func)
router.post('/inpcom', expressjoi(inpcomment_schema), inqcomment_func)
module.exports = router