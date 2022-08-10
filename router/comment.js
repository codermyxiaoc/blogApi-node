const express = require('express')
const expressjoi = require('@escook/express-joi')

const router = express.Router()
//路由处理函数
const { addcom_func, deletecom_func } = require('../router_hendler/comment')
//规则
const { addcom_schema,deletecom_schema } = require('../schema/comment')

router.post('/addcom', expressjoi(addcom_schema), addcom_func)
router.post('/detcom', expressjoi(deletecom_schema), deletecom_func)

module.exports = router