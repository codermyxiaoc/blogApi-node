const joi = require('joi')

const content = joi.string().min(1).required()
const comment_id = joi.number().required()
exports.addcom_schema = {
    body: {
        content,
        comment_id
    }
}
const replyuser_id = joi.number().required()
exports.deletecom_schema = {
    body: {
        replyuser_id
    }
}
