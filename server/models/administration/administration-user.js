var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');
let mongooseAutopopulate = require("mongoose-autopopulate")

var rightsSchema = new Schema({
  edit: { type: Boolean},
  create: { type: Boolean},
  delete: { type: Boolean},
  export: { type: Boolean},
  upload: { type: Boolean},
});

var logSchema = new Schema({
  log: {type: String},
  date: {type: Date}
})

var schema = new Schema({
    firstName: {type: String, required: true},
    middleName:{type: String, required: false },
    lastName: {type: String, required: true},
    password: {type: String, required: true, select: false },
    username: {type: String, required: true, unique: true},
    email: {type: String, required: false},
    role: {type: Number, required: true},
    pages: {type: [Number], required: true},
    rights: {type: rightsSchema, required: false},
    creationDate : {type: Date, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main', required: false, unique: true},
    log: { type: [logSchema] , required: false },
    lastLogin:{type: Date, required:false },

});

schema.plugin(mongooseAutopopulate);
schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Administration-User', schema);
