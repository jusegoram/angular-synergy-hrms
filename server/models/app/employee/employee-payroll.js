var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let EmployeePayrollschema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employeeId: { type: String, required: true },
    TIN: {type: String, required: true },
    positionId: { type: String, required: true },
    payrollType: {type: String, required: true },
    baseWage: {type: String, required: false },
    bankName: {type: String, required: false },
    bankAccount: {type: String, required: false },
    billable: {type: Boolean, required: false},
    lastVacation:{type: Object, required: false},
    lastPayment: {type: Date, required: false},
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main', required: false },
});

const EmployeePayroll = mongoose.model('Employee-Payroll', EmployeePayrollschema);

let EmployeeOvertimeSchema = new Schema({
  employee:{},
  employeeId: {},
  date: {},
  reason: {},
  overtimeHours: {},
  overtimeRate: {},
});
const EmployeeOvertime = mongoose.model('Employee-Overtime', EmployeeOvertimeSchema);



module.exports = {EmployeePayroll, EmployeeOvertime};
