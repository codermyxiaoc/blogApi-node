const express = require('express')
const expressjoi = require('@escook/express-joi')

const router = express.Router()
//路由处理函数
const {addart_func, deleteart_func, myart_func} = require('../router_hendler/article')
//规则
const {addart_schema,deleteart_schema} = require('../schema/article')

router.post('/addart', expressjoi(addart_schema), addart_func)
router.post('/detart', expressjoi(deleteart_schema),deleteart_func)
router.get('/myart', myart_func)

module.exports = router