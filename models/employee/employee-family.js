var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    employeeid: {type: String, required: true },
    reference: { type: String, required: true },
    relationship: { type: String, required: true },
    celNumber: { type: String, required: true },
    telNumber: { type: String, required: false },
    emailAdress: { type: String, required: false },
});

module.exports = mongoose.model('EmployeeFamily', schema);