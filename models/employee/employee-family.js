var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    employeeid: {type: String, required: true },
    reference: { type: String, required: true },
    relationship: { type: String },
    celNumber: { type: string },
    telNumber: { type: string },
    emailAdress: { type: String }
});

module.exports = mongoose.model('EmployeeFamily', schema);