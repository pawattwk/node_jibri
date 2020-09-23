const mongoose = require('mongoose')

var Schema = new mongoose.Schema({
    // id : { type:String,unique: true,min: 1 },
    username : { type:String,default: ''},
    email : { type:String,unique: true, default: '', required: true, },
    name : { type:String,default: '', required: true },
    lastname : { type:String,default: '', required: true },
    phonenumber : { type:String, unique: true, default: '', minlength: 10, maxlength: 10, required: true,},
    company : { type:String,default: '', required: true },
    oneid : { type:String, default: null, },
    room_id : { type:String, default: '', required: true, },
    role : { type:String, default: '', required: true, },
    avatar_profile: { type:String, default: null,},
    verifyemail : { type:Boolean, default: false },
    created_at : { type:Date, default: Date.now() },
    updated_at : { type:Date, default: Date.now() },
}, { collection: 'Users' })

module.exports = mongoose.model('Users', Schema)