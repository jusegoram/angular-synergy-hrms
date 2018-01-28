var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    employeeId: { type: String, required: true },
    positionid: { type: String, required: true },
    baseWage: {type: String, required: true}
});

module.exports = mongoose.model('EmployeePayroll', schema);