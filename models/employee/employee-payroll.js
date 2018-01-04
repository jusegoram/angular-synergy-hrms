var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    employeeid: { type: String, required: true },
    positionid: { type: String, required: true },
    position: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
});

module.exports = mongoose.model('EmployeePayroll', schema);