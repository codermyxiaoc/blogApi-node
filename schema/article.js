const joi = require('joi')

const content = joi.string().min(1).required()
exports.addart_schema = {
    body: {
        content
    }
}
const comment_id = joi.number().required()
exports.deleteart_schema = {
    body:{
        comment_id
    }
}
exports.inpcomment_schema = {
    body: {
        comment_id
    }
}
