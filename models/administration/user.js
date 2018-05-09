var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    password: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    role: {type: Number, required: true}
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', schema);