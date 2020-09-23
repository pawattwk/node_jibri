const mongoose = require('mongoose')

var Schema = new mongoose.Schema({
    // id : { type:String,unique: true,min: 1 },
    user_id : { type:String, default: ''  },
    meeting_id : { type:String, default: ''},
    name : { type:String, default: ''},
    username: { type:String, default: ''},
    uid : { type:String, default: ''},
    date : { type:String, default: '', },
    end_date : { type:String, default: '', },
    start_time : { type:String, default: '', },
    end_time : { type:String, default: '' },
    setting : { type:Object, default: null },
    member:{  type:Array, default: null },
    attendee : { type:String, default: '1' },
    file_id : { type:String, default: '' },
    created_at : { type:Date, default: Date.now() },
    updated_at : { type:Date, default: Date.now() },
}, { collection: 'Histoy_rooms' })

module.exports = mongoose.model('Histoy_rooms', Schema)