var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    firstName: {type: String, required: true},
    middleName:{type: String, required: false },
    lastName: {type: String, required: true},
    password: {type: String, required: true, select: false },
    username: {type: String, required: true, unique: true},
    role: {type: Number, required: true},
    creationDate : {type: Date, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main', required: false, unique: true},
    log: { type: [Object] , required: false }
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Administration-User', schema);
