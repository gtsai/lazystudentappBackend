var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    author: Object, //{_id: '759125015', name:grace'}
    createdAt: {type:Date, default: Date.now},
    message: String
});

module.exports = mongoose.model('messages', messageSchema);