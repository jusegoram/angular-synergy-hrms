var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employeeId: { type: String, required: true },
    TIN: {type: String, required: true },
    positionId: { type: String, required: true },
    payrollType: {type: String, required: true },
    baseWage: {type: String, required: false },
    bankName: {type: String, required: false },
    bankAccount: {type: String, required: false },
    billable: {type: Boolean, required: false},
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false },
});



module.exports = mongoose.model('Employee-Payroll', schema);
