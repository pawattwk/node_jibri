const mongoose = require('mongoose')

var Schema = new mongoose.Schema({
    oneid : { type:String, default: '' },
    account_id : { type:String, default: '' },
    account_name : { type:String, default: '' },
    branch_no : { type:String, default: '' },
    email : { type:String, default: '' },
    taxid : { type:String, default: '' },
    mainfolder : { type:String, default: '' },
    recordfolder : { type:String, default: '' },
    storage : { type:String, default: '' },
    used_storage : { type:String, default: '' },
    remain_storage : { type:String, default: '' },
    created_at : { type:Date, default: Date.now() },
    updated_at : { type:Date, default: Date.now() },
}, { collection: 'Onebox' })

module.exports = mongoose.model('Onebox', Schema)