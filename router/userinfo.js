const express = require('express')
const path = require('path')
const expressjoi = require('@escook/express-joi')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'../headpro'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
})

const upload = multer({ storage: storage })

const router = express.Router()
//路由处理函数
const { userinfo_func , userupdate_func,headpor_func, updatepwd_func, offuser_func} = require('../router_hendler/userinfo')
//规则
const { updateuser_schema ,updatepwd_schema, offuser_schema} = require('../schema/user')

router.get('/userinfo', userinfo_func)
router.post('/updateuser', expressjoi(updateuser_schema),userupdate_func)
router.post('/headpor', upload.single('avatar'), headpor_func)
router.post('/updatepwd', expressjoi(updatepwd_schema),updatepwd_func)
router.post('/offuser',expressjoi(offuser_schema),offuser_func)
module.exports = router