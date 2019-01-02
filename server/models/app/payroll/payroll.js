let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let mongooseAutopopulate = require("mongoose-autopopulate")

// let PayrollCurrent = new Schema({
//   _id: mongoose.Schema.Types.ObjectId,
//   employeeId: { type: String, required: true },
//   employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
//   payrollType: {type: String, required: true},
//   totalPayed: { type: Number, Required: false },
//   totalHours:{type: Number, Required: true},
//   totalOvertime:{type: Number, Required: true},
//   rate:{type: Number, Required: true},
//   overtimeRate:{type: Number, Required: true},
//   totalBonus:{type: Number, Required: true},
//   bonusReason:{type: Number, Required: true},
//   totalDeductions:{type: String, required: true},
//   deductionsReason:{type: String, required: true},
//   date: { type: Date, required: true }
// });

// module.exports = mongoose.model('Payroll-Current', PayrollCurrent);


let PayrollDetail = new Schema({
  date:{type: Date},
  Hours: {type: Number},
  holidayRate:{type: Number},
  employeePosition: {type: Object},
  employeePayroll:{type: Object},
  employeeVacation:{type: Object},
  Overtime:{type: [mongoose.Schema.Types,ObjectId], ref: 'Employee-Overtime', autopopulate: true},
  otherPayment:{type: [mongoose.Schema.Types,ObjectId], ref: 'payroll-OtherPayTable', autopopulate: true},
  Deduction:{type: [mongoose.Schema.Types,ObjectId], ref: 'payroll-DeductionsTable', autopopulate: true},
});
PayrollDetail.plugin(mongooseAutoPopulate);

let PayrollStorage = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  employeeId: { type: String, required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  payrollType: {type: String, required: true},
  grossSalary: { type: Number, Required: true},
  totalBonus: { type: Number, Required: true},
  totalDeduction: { type: Number, Required: true},
  totalSocialSecurity: {type: Number, required: true},
  netSalary: { type: Number, Required: true},
  detail: {type: PayrollDetail, required: true},
  date: { type: String, required: true }
});

const payrollStorage = mongoose.model('Payroll', PayrollStorage);

module.exports = {
  bonus, deduction, overtime, payrollStorage
}
