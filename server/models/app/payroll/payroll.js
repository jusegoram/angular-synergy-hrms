let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//TODO: PAYED LEAVES


let BonusSchema = new Schema({
  employee: {type: mongoose.Schema.Types.ObjectId, ref: 'Employee'},
  employeeId: {type: String},
  reason: {type: String},
  date: {type: Date},
  amount: {type: Number}
});
BonusSchema.index({date: -1});

let DeductionSchema = new Schema({
  employee: {type: mongoose.Schema.Types.ObjectId, ref: 'Employee'},
  employeeId: {type: String},
  reason: {type: String},
  date: {type: Date},
  amount: {type: Number}
});
DeductionSchema.index({date: -1});

let OtherPaySchema = new Schema({
  employee: {type: mongoose.Schema.Types.ObjectId, ref: 'Employee'},
  employeeId: {type: String},
  reason: {type: String},
  date: {type: Date},
  amount: {type: Number}
});
OtherPaySchema.index({date: -1});

let OvertimeSchema = new Schema({
  employee: {type: mongoose.Schema.Types.ObjectId, ref: 'Employee'},
  employeeId: {type: String},
  overtimeHours: {type: Number},
  payedOvertimeHours: {type: Number},
  rate:{type: Number},
  amount: {type: Number}
});
OvertimeSchema.index({date: -1});

let PayrollStorage = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  employeeId: { type: String, required: true },
  firstName: { type: String},
  middleName: {type: String},
  lastName: {type: String},
  socialSecurity: {type: String},
  status: {type: String},
  payrollType: {type: String, required: true},
  hours: {type: Object},
  totalHours: {type: Object},
  hourlyRate:{type: Number},
  employeePosition: {type: Object},
  employeePayroll:{type: Object},
  employeeCompany:{type: Object},
  employeeVacation:{type: Object}, //TODO: create object structure
  overtime:{type: [OvertimeSchema]},
  otherPayment:{type: [OtherPaySchema]},
  bonus: {type: [BonusSchema]},
  deduction:{type: [DeductionSchema]},
  grossSalary: { type: Number, Required: true},
  totalBonus: { type: Number, Required: true},
  totalDeduction: { type: Number, Required: true},
  totalSocialSecurity: {type: Number, required: true},
  netSalary: { type: Number, Required: true},
  dateFrom: { type: String, required: true },
  dateTo: { type: String, required: true },
});

PayrollStorage.index({dateFrom: -1});

const payrollStorage = mongoose.model('payroll', PayrollStorage);
const bonus = mongoose.model('payroll-bonus', BonusSchema);
const deduction = mongoose.model('payroll-deduction', DeductionSchema);
const overtime = mongoose.model('payroll-overtime', OvertimeSchema);
const otherPay = mongoose.model('payroll-otherPay', OtherPaySchema);

module.exports = {
  bonus, deduction, overtime, otherPay, payrollStorage
}
