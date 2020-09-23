const mongoose = require('mongoose')

var Schema = new mongoose.Schema({
    // id : { type:String,unique: true,min: 1 },
    user_id : { type:String, default: '' ,unique: true },
    name : { type:String, default: ''},
    uid : { type:String, default: '',unique: true },
    last_session : { type:Date, default: null },
    key : { type:String, default: ''},
    setting : { type:Object, default: null },
    created_at : { type:Date, default: Date.now() },
    updated_at : { type:Date, default: Date.now() },
}, { collection: 'Rooms' })

module.exports = mongoose.model('Rooms', Schema)