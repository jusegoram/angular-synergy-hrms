var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    employeeId: { type: String, required: true },
    institution: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
});

module.exports = mongoose.model('EmployeeEducation', schema);