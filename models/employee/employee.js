var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var positions = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    positionid: { type: String, require: true},
    startDate: { type: Date , require: true},
    endDate:{ type: Date, require: false},
});

var schema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employeeId: { type: String, required: true, unique: true },
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    birthDate: {type: Date, required: true},
    socialSecurity: { type: String, required: true },
    campaign: { type: String, required: true },
    supervisorid: { type: String , required: false},
    positionid: { type: [String], required: true }, //should be history ex. training from 0/0/0 to 0/0/0
    status: { type: String, required: true }// active, resignation, dissmisal, termination, undefined
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Employee', schema);