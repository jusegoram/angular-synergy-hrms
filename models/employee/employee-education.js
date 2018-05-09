var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employeeId: { type: String, required: true },
    institution: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false },
});

module.exports = mongoose.model('EmployeeEducation', schema);