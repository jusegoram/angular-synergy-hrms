let mongoose = require("mongoose");
let Schema = mongoose.Schema;

//TODO: PAYED LEAVES

let BonusSchema = new Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "employee-main" },
  employeeId: { type: String },
  reason: { type: String },
  date: { type: Date },
  submittedDate: { type: Date },
  amount: { type: Number },
  creationFingerprint: {type: mongoose.Schema.Types.ObjectId, ref: "Administration-User"},
  verified: {type: Boolean, default: false},
  payed:{type: Boolean, default: false},
    createdAt: {type: Date, required: false, default: Date.now},
    createdBy: {type: Object, required: false},
});
BonusSchema.index({ date: -1 });

let DeductionSchema = new Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "employee-main" },
  employeeId: { type: String },
  reason: { type: String },
  date: { type: Date },
  submittedDate: { type: Date },
  amount: { type: Number },
  creationFingerprint: {type: mongoose.Schema.Types.ObjectId, ref: "Administration-User"},
  verified: {type: Boolean, default: false},
  payed:{type: Boolean, default: false},
    createdAt: {type: Date, required: false, default: Date.now},
    createdBy: {type: Object, required: false},
});
DeductionSchema.index({ date: -1 });

let OtherPaySchema = new Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "employee-main" },
  employeeId: { type: String },
  reason: { type: String },
  date: { type: Date },
  submittedDate: { type: Date },
  amount: { type: Number },
  creationFingerprint: {type: mongoose.Schema.Types.ObjectId, ref: "Administration-User"},
  verified: {type: Boolean, default: false},
  payed:{type: Boolean, default: false},
    createdAt: {type: Date, required: false, default: Date.now},
    createdBy: {type: Object, required: false},
});
OtherPaySchema.index({ date: -1 });



let employeeSchema = new Schema( {
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
  socialSecurity: { type: String },
  status: { type: String },
  emailAddress: {type: String},
  payrollType: { type: String },
  hourlyRate: { type: Number },
  employeeName: { type: String },
  employeeCompany: {
    employee: { type: String },
    reapplicantTimes: { type: Object },
    reapplicant: { type: Object },
    terminationDate: { type: Date },
    hireDate: { type: Date },
    trainingGroupNum: { type: Object },
    trainingGroupRef: { type: String },
    trainer: { type: String },
    supervisor: { type: String },
    campaign: { type: String },
    client: { type: String },
    employeeId: { type: String },
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
    baseWage: { type: String },
    payrollType: { type: String },
    positionId: { type: String },
    TIN: { type: String },
    employeeId: { type: String},
    _id: { type: String }
  },
  employeeShift: { type: Object },
  fromDate: { type: Date },
  toDate: { type: Date },
  overtimeRate: { type: Number }
});

let PayrollSchema = new Schema({
  employees: {type: [employeeSchema]},
  payrollType: {type: String},
  isPayed: {type: Boolean, default: false},
  payedDate: {type: Date},
  payId:{type: String},
  socialTable: { type: [Object]},
  incometaxTable: { type: [Object]},
  deductionsTable: { type: [Object]},
  otherpayTable: { type: [Object]},
  exceptionsTable: { type: [Object]},
  holidayTable: { type: [Object] },
  fromDate: { type: Date },
  toDate: { type: Date },
  updatedAt: {type: Date, required: false },
    createdAt: {type: Date, required: false, default: Date.now},
    createdBy: {type: Object, required: false},
    updatedBy: {type: Object, required: false},
});



PayrollSchema.index({ fromDate: -1 });

let PayedPayrollWeekSchema = new Schema({
  payroll : { type: mongoose.Schema.Types.ObjectId, ref: "payroll" },
  fromDate: { type: Date},
  toDate: { type: Date },
  updatedAt: {type: Date, required: false },
    createdAt: {type: Date, required: false, default: Date.now},
    createdBy: {type: Object, required: false},
    updatedBy: {type: Object, required: false},
});

let PayedEmployeesSchema = new Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main' },
    payrolls: { type: [PayedPayrollWeekSchema] },
    employeeId: {type: String },
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    client: {type: String },
    campaign: { type: String },
    billable: { type: Boolean },
    bankAccount: { type: String },
    bankName: { type: String },
    payrollType: { type: String },
    TIN: { type: String },
    socialSecurity: { type: String },
    totalIncomeTax: { type: Number },
    totalCompanyContributions: { type: Number },
    totalEmployeeContributions: { type: Number },
    totalNetWage: { type: Number },
    updatedAt: {type: Date, required: false },
    createdAt: {type: Date, required: false, default: Date.now},
    createdBy: {type: Object, required: false},
    updatedBy: {type: Object, required: false},
  }
);
let PayedPayrollSchema = new Schema({
  payedEmployees: { type: [PayedEmployeesSchema]},
  payedPayrolls: { type: [PayedPayrollWeekSchema]},
});

const payedPayroll = mongoose.model('payed-payroll', PayedPayrollSchema);
const payroll = mongoose.model("payroll", PayrollSchema);
const bonus = mongoose.model("payroll-bonus", BonusSchema);
const deduction = mongoose.model("payroll-deduction", DeductionSchema);
const otherPay = mongoose.model("payroll-otherPay", OtherPaySchema);

module.exports = {
  bonus,
  deduction,
  otherPay,
  payroll,
  payedPayroll,
};
