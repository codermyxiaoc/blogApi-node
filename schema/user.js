const joi = require('joi')

const username =  joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
const cell_phone = joi.number().min(11).required()
const nickname = joi.string()
const sex = joi.string()
exports.createuser_schema = {
    body: {
        username,
        password,
        cell_phone,
        nickname,
        sex
    }
}
exports.namelogin_schema = {
    body: {
        username,
        password
    }
}
exports.phonelogin_schema = {
    body: {
        cell_phone,
        password
    }
}
const email = joi.string().email()
const per_sig = joi.string()
exports.updateuser_schema = {
    body: {
        nickname,
        email,
        sex,
        per_sig,
    }
}
exports.updatepwd_schema = {
    body: {
        oldPwd: password,
        newPwd: joi.not(joi.ref('oldPwd')).concat(password)
    }
}
exports.offuser_schema = {
    body: {
        password
    }
}