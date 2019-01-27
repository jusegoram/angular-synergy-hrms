var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');
let mongooseAutopopulate = require("mongoose-autopopulate")

var roleSchema = new Schema({
  role: { type: Number },
  edit: { type: Boolean},
  add: { type: Boolean},
  delete: { type: Boolean},
  view: { type: Boolean},
  upload: { type: Boolean},
});

var schema = new Schema({
    firstName: {type: String, required: true},
    middleName:{type: String, required: false },
    lastName: {type: String, required: true},
    password: {type: String, required: true, select: false },
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true},
    role: {type: Number, required: true},
    creationDate : {type: Date, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main', required: false, unique: true},
    log: { type: [Object] , required: false },
    lasLogin:{type: Date, required:false },

});

schema.plugin(mongooseAutopopulate);
schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Administration-User', schema);
