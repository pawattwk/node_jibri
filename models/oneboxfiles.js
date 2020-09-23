const mongoose = require('mongoose')

var Schema = new mongoose.Schema({
    filename : { type:String, default: '' },
    file_id : { type:String, default: '' },
    user_id : { type:String, default: '' },
    size : { type:String, default: '' },
    meetingid : { type:String, default: '' },
    created_at : { type:String, default: Date.now() },
    updated_at : { type:String, default: Date.now() },
}, { collection: 'Oneboxfile' })

module.exports = mongoose.model('Oneboxfile', Schema)