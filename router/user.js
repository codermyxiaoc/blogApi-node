const express = require('express')
const expressjoi = require('@escook/express-joi')
const router = express.Router()
//路由处理函数
const { createuser_func, namelogin_func , phonelogin_func, getCode_func, forgetPowcode_func, forgetPow_func, logincode_func } = require('../router_hendler/user')
const { inquirerep_func , inqcomment_func} = require('../inquirerep/index')
//规则
const { createuser_schema , namelogin_schema, phonelogin_schema, code_schema, forgetpow_schema } = require('../schema/user')
const { inpcomment_schema } = require('../schema/article')
//路由
router.post('/createuser', expressjoi(createuser_schema), createuser_func)
router.post('/namelogin', expressjoi(namelogin_schema), namelogin_func)
router.post('/phonelogin', expressjoi(phonelogin_schema), phonelogin_func)
router.get('/inpreq', inquirerep_func)
router.post('/inpcom', expressjoi(inpcomment_schema), inqcomment_func)
router.post('/getcode', expressjoi(code_schema),getCode_func)
router.post('/forgetpowcode', expressjoi(code_schema), forgetPowcode_func)
router.post('/forgetpow', expressjoi(forgetpow_schema),forgetPow_func)
router.post('/logincode', expressjoi(code_schema), logincode_func)
module.exports = router