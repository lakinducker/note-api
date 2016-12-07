var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var NoteSchema   = new Schema({
    title: String,
    noteContent: String,
    date: String,
    author: String
});

module.exports = mongoose.model('Note', NoteSchema);