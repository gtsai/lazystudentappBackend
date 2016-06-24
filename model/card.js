var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    title: String,
    body: String,
    tags: [String],
    images: [String],
    author: Object, //{_id: '759125015', name:grace'}
    createdAt: {type:Date, default: Date.now}
});

module.exports = mongoose.model('cards', schema);