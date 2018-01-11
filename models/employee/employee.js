var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employeeId: { type: String, required: true, unique: true },
    firstName: {type: String, required: true},
    middleName:{ type: String, required: true },
    lastName: {type: String, required: true},
    birthDate: {type: Date, required: true},
    socialSecurity: { type: String, required: true },
    client: {type: String, required: true},
    campaign: { type: String, required: true },
    supervisorid: { type: String , required: false},
    status: { type: String, required: true },// active, resignation, dissmisal, termination, undefined, aplicant, trainee
    hireDate:{ type: Date, required: true },
    terminationDate:{ type: Date, required: false }
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Employee', schema);