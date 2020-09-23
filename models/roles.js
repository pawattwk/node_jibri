const mongoose = require('mongoose')

var Schema = new mongoose.Schema({
    // id : { type:String,unique: true,min: 1 },
    name : { type:String, default: 'user' },
    created_at : { type:Date, default: Date.now() },
    updated_at : { type:Date, default: Date.now() },
}, { collection: 'Roles' })

module.exports = mongoose.model('Roles', Schema)