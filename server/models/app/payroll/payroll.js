let mongoose = require("mongoose");
let Schema = mongoose.Schema;

//TODO: PAYED LEAVES

let BonusSchema = new Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  employeeId: { type: String },
  reason: { type: String },
  date: { type: Date },
  amount: { type: Number }
});
BonusSchema.index({ date: -1 });

let DeductionSchema = new Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  employeeId: { type: String },
  reason: { type: String },
  date: { type: Date },
  amount: { type: Number }
});
DeductionSchema.index({ date: -1 });

let OtherPaySchema = new Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  employeeId: { type: String },
  reason: { type: String },
  date: { type: Date },
  amount: { type: Number }
});
OtherPaySchema.index({ date: -1 });

let OvertimeSchema = new Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  employeeId: { type: String },
  overtimeHours: { type: Number },
  payedOvertimeHours: { type: Number },
  rate: { type: Number },
  amount: { type: Number }
});
OvertimeSchema.index({ date: -1 });

let PayrollStorage = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  employeeId: { type: String, required: true },
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  socialSecurity: { type: String },
  status: { type: String },
  payrollType: { type: String, required: true },
  hours: { type: Object },
  totalHours: { type: Object },
  hourlyRate: { type: Number },
  employeePosition: { type: Object },
  employeePayroll: { type: Object },
  employeeCompany: { type: Object },
  employeeVacation: { type: Object }, //TODO: create object structure
  overtime: { type: [OvertimeSchema] },
  otherPayment: { type: [OtherPaySchema] },
  bonus: { type: [BonusSchema] },
  deduction: { type: [DeductionSchema] },
  grossSalary: { type: Number, Required: true },
  totalBonus: { type: Number, Required: true },
  totalDeduction: { type: Number, Required: true },
  totalSocialSecurity: { type: Number, required: true },
  netSalary: { type: Number, Required: true },
  dateFrom: { type: String, required: true },
  dateTo: { type: String, required: true }
});
let employeeSchema = new Schema( {
  _id: mongoose.Schema.Types.ObjectId,
  regularHours: { type: Number },
  wage: { type: Number },
  hours: { type: [Object]},
  overtime: { type: Number },
  holiday: { type: [Object] },
  bonus: { type: Array },
  otherpay: { type: Array },
  csl: { type: Array },
  maternity: { type: Array },
  vacations: { type: Array },
  deductions: { type: Array },
  grossWage: { type: Number },
  totalSystemHours: {
    hh: { type: Number },
    mm: { type: Number },
    ss: { type: Number },
    value: { type: Number },
    valueString: { type: String }
  },
  totalHolidayHours: {
    hours: { type: Number },
    rate: { type: Number },
    totalPayed: { type: Number }
  },
  totalOvertimeHours: {
    hh: { type: Number },
    mm: { type: Number },
    ss: { type: Number },
    value: { type: Number },
    valueString: { type: String }
  },
  totalRegularHoursPay: {
    hours: { type: Number },
    rate: { type: Number },
    totalPayed: { type: Number }
  },
  totalHolidayHoursPayX2: {
    hours: { type: Number },
    rate: { type: Number },
    totalPayed: { type: Number }
  },
  totalHolidayHoursPayX1: {
    hours: { type: Number },
    rate: { type: Number },
    totalPayed: { type: Number }
  },
  totalOvertimeHoursPay: {
    hours: { type: Number },
    rate: { type: Number },
    totalPayed: { type: Number }
  },
  totalBonusPay: { type: Number },
  totalOtherpay: { type: Number },
  totalDeductions: { type: Number },
  socialSecurityEmployee: { type: Number },
  socialSecurityEmployer: { type: Number },
  incomeTax: { type: Number },
  netWage: { type: Number },
  employee: { type: String },
  employeeId: { type: Number },
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  socialSecurity: { type: Date },
  status: { type: String },
  payrollType: { type: String },
  hourlyRate: { type: Number },
  employeeName: { type: String },
  employeeCompany: {
    employee: { type: String },
    reapplicantTimes: { type: Object },
    reapplicant: { type: Object },
    terminationDate: { type: Object },
    hireDate: { type: Date },
    trainingGroupNum: { type: Object },
    trainingGroupRef: { type: String },
    trainer: { type: String },
    supervisor: { type: String },
    campaign: { type: String },
    client: { type: String },
    employeeId: { type: Date },
    _id: { type: String},
    manager: { type: String }
  },
  employeePosition: {
    _id: { type: String },
    positionId: { type: String },
    name: { type: String },
    baseWage: {type: Number }
  },
  employeePayroll: {
    employee: { type: String },
    billable: { type: Boolean },
    bankAccount: { type: String },
    bankName: { type: String },
    baseWage: { type: Date },
    payrollType: { type: String },
    positionId: { type: String },
    TIN: { type: Date },
    employeeId: { type: Date},
    _id: { type: String }
  },
  employeeShift: { type: Object },
  fromDate: { type: Date },
  toDate: { type: Date },
  overtimeRate: { type: Number }
});

let testSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  employees: {type: [employeeSchema]},
  socialTable: { type: [Object]},
  incometaxTable: { type: [Object]},
  deductionsTable: { type: [Object]},
  otherpayTable: { type: [Object]},
  exceptionsTable: { type: [Object]},
  holidayTable: { type: [Object] },
  fromDate: { type: Date },
  toDate: { type: Date },
});



PayrollStorage.index({ dateFrom: -1 });

const payrollStorage = mongoose.model("payroll", testSchema);
const bonus = mongoose.model("payroll-bonus", BonusSchema);
const deduction = mongoose.model("payroll-deduction", DeductionSchema);
const overtime = mongoose.model("payroll-overtime", OvertimeSchema);
const otherPay = mongoose.model("payroll-otherPay", OtherPaySchema);

module.exports = {
  bonus,
  deduction,
  overtime,
  otherPay,
  payrollStorage
};
