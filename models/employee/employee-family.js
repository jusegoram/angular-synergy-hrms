var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    employeeId: {type: String, required: true },
    referenceName: { type: String, required: true },
    relationship: { type: String, required: true },
    celNumber: { type: String, required: true },
    telNumber: { type: String, required: false },
    emailAdress: { type: String, required: false },
    adress: { type: String, required: false },
});

module.exports = mongoose.model('EmployeeFamily', schema);