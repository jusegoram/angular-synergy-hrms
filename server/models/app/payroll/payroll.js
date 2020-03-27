let mongoose = require("mongoose");
let Schema = mongoose.Schema;

//TODO: PAYED LEAVES
let hhmmssSchema = new Schema({
  value: {type: String, required: true},
  valueInMinutes: {type: Number, required: true},
  hh: {type: Number, required: true},
  mm: {type: Number, required: true},
  ss: {type: Number, required: true}
})

let shiftSchema = new Schema({
  uniqueId: { type: String },
  employeeId: { type: String, required: true },
  employeeName: {type: String},
  billable: {type: Boolean},
  client: {type: String},
  campaign: {type: String },
  hasShift: {type: Boolean, default: false},
  shiftDay: { type: Number }, //new
  onShift: { type: Boolean }, //new
  shiftStartTime: {type: Number}, //new
  shiftEndTime: { type: Number }, //new
  shiftScheduledHours: {type: Number}, //new
  shiftScheduledBreakAndLunch: {type: Number},
  dialerId: { type: String, required: false },
  date: { type: Date, required: true },
  hasHours: {type: Boolean, default: false},
  matrix: {type: String, default: null},
  hourlyRate: {type: Number},
  positionName: {type: String},
  holiday: {type: Boolean, default: false},
  holidayRate: {type: Number},
  systemHours: { type: hhmmssSchema, required: false },
  breakHours: { type: hhmmssSchema, required: false }, //new
  lunchHours:{ type: hhmmssSchema, required: false }, //new
  trainingHours:{ type: hhmmssSchema, required: false }, //new
  tosHours: { type: hhmmssSchema, required: false }, //new
  timeIn:  { type: hhmmssSchema, required: false },
  attendance: {type: String, default: 'ABSENT'}, //present, absent, on-leave, on-vacation, unknown
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main' },
  fileId: { type: mongoose.Schema.Types.ObjectId},
  createdDate: { type: Date, default: Date.now},
});

let BonusSchema = new Schema({
  type: {type: String},
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "employee-main" },
  taxable: {type:Boolean},
  employeeName: {type: String},
  employeeId: { type: String },
  reason: { type: String },
  date: { type: Date },
  submittedDate: { type: Date },
  amount: { type: Number },
  creationFingerprint: {type: mongoose.Schema.Types.ObjectId, ref: "Administration-User"},
  verificationFingerprint: {type: mongoose.Schema.Types.ObjectId, ref: "Administration-User"},
  verified: {type: Boolean, default: false},
  payroll: { type: mongoose.Schema.Types.ObjectId, ref: "payroll" },
  payed:{type: Boolean, default: false},
  assigned: {type: Boolean, default: false},
    createdAt: {type: Date, required: false, default: Date.now},
    createdBy: {type: Object, required: false},
});
BonusSchema.index({ date: -1, employeeId: -1 });

let DeductionSchema = new Schema({
  type: {type: String},
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "employee-main" },
  employeeName: {type: String},
  employeeId: { type: String },
  reason: { type: String },
  date: { type: Date },
  submittedDate: { type: Date },
  amount: { type: Number },
  creationFingerprint: {type: mongoose.Schema.Types.ObjectId, ref: "Administration-User"},
  verified: {type: Boolean, default: false},
  payroll: { type: mongoose.Schema.Types.ObjectId, ref: "payroll" },
  assigned: {type: Boolean, default: false},
  payed:{type: Boolean, default: false},
    createdAt: {type: Date, required: false, default: Date.now},
    createdBy: {type: Object, required: false},
});
DeductionSchema.index({date: -1, employeeId: -1 });

let OtherPaySchema = new Schema({
  type: {type: String},
  notice: {type: Boolean, default: false}, //Not taxable
  severance: {type: Boolean, default: false}, //Not Taxable
  compassionate: {type: Boolean, default: false},
  leaveWithoutPay: {type: Boolean, default: false},
  vacations: {type: Boolean, default: false},
  maternity: {type: Boolean, default: false},//Not Taxable
  csl: {type: Boolean, default: false},//Not Taxable
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "employee-main" },
  employeeName: {type: String},
  employeeId: { type: String },
  reason: { type: String },
  date: { type: Date },
  from: {type: Date},
  to: {type: Date},
  isPartiallyPayed: {type: Boolean, default: false},
  partialPayment: {type: Number},
  outstandingAmount: {type: Number},
  totalDays: {type: Number},
  diagnosis: {type: String},
  doctorName: {type: String},
  institution: {type: String},
  submittedDate: { type: Date },
  amount: { type: Number },
  creationFingerprint: {type: mongoose.Schema.Types.ObjectId, ref: "Administration-User"},
  verified: {type: Boolean, default: false},
  assigned: {type: Boolean, default: false},
  payroll: { type: mongoose.Schema.Types.ObjectId, ref: "payroll" },
  payed:{type: Boolean, default: false},
    createdAt: {type: Date, required: false, default: Date.now},
    createdBy: {type: Object, required: false},
});
OtherPaySchema.index({date: -1, employeeId: -1 });

let PayrollHours = new Schema({
  hh: { type: Number },
  mm: { type: Number },
  ss: { type: Number },
  value: { type: Number },
  hourlyRate: { type: mongoose.Schema.Types.Decimal128 }
});

let PayrollPayment = new Schema({
  hours: { type: Number },
  rate: { type: mongoose.Schema.Types.Decimal128 },
  totalPayed: { type: mongoose.Schema.Types.Decimal128 },
});

let PayrollSchema = new Schema({
  fromDate: { type: Date }, //included on save
  toDate: { type: Date }, //included on save
  payroll_Id: {type: mongoose.Schema.Types.ObjectId }, //included on save
  createdAt: {type: Date, required: false, default: Date.now},//included on save
  createdBy: {type: Object, required: false},//included on save
  isFinalized: {type: Boolean, default: false}, //included on finalize
  updatedAt: {type: Date, required: false }, //included on finalize
  updatedBy: {type: Object, required: false}, //included on finalize
  payment_Id:{type: mongoose.Schema.Types.ObjectId },//included on payed
  paymentDate: {type: Date}, //included on payed
  isPayed: {type: Boolean, default: false}, //included on payed
  payedBy: {type: Object, required: false},
  employee: { type: mongoose.Schema.Types.ObjectId},
  employeeId: { type: Number},
  firstName: { type: String  },
  middleName: { type: String },
  lastName: { type: String },
  employeeName: { type: String },
  socialSecurity:{ type: String },
  status:{ type: String },
  onFinalPayment: { type: Boolean },
  payslipSent: { type: Boolean, default: false},
  employeeCompany: {
    client: { type: String },
    campaign: { type: String },
    hireDate: { type: Date },
    supervisor: { type: String },
    manager: { type: String },
    trainer: { type: String },
    trainingGroupRef: { type: String },
    trainingGroupNum: { type: Number },
    terminationDate: { type: Date },
    reapplicant: { type: Boolean },
    reapplicantTimes: { type: Number},
    bilingual: { type: Boolean },
    createdAt: { type: Date }
  },
  employeePayroll: {
    TIN: { type: String },
    payrollType: { type: String },
    bankName: { type: String },
    bankAccount: { type: String },
    billable: { type: Boolean },
    paymentType: { type: String },
    createdAt: { type: Date }
  },
  payrollType: { type: String },
  employeePosition: {
    client: { type: String },
    department: { type: String },
    position: {
      positionId: { type: String },
      name: { type: String },
      baseWage: { type: Number },
    },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  employeeShiftRegular: { type: [shiftSchema] },
  employeeShiftHolidayX1: { type: [shiftSchema] },
  employeeShiftHolidayX2: { type: [shiftSchema] },
  employeeTaxableBonus: { type: [BonusSchema] },//Implement | almost done
  employeeNonTaxableBonus: { type: [BonusSchema] },//Implement | almost done
  employeeDeductions: { type: [DeductionSchema] },
  employeeOtherpays: { type: [OtherPaySchema] }, //needs an update after save
  employeeFinalPayment: {type: [OtherPaySchema]}, //Implement | almost done
  employeeMaternities: { type: [OtherPaySchema] },
  employeeCompassionate: { type: [OtherPaySchema] },
  employeeCSL: { type: [OtherPaySchema] },
  employeeBonus: { type: [BonusSchema] },
  positionName: { type: String },
  positionId: { type: String },
  positionBaseWage: { type: Number },
  positionHourlyRate: { type: mongoose.Schema.Types.Decimal128 },
  totalScheduledMinutes: { type: Number },
  totalSystemHoursRegular: { type: PayrollHours },
  totalTrainingHoursRegular: { type: PayrollHours },
  totalTosHoursRegular: { type: PayrollHours },
  totalSystemHoursHolidayX1: { type: PayrollHours },
  totalTrainingHoursHolidayX1: { type: PayrollHours },
  totalTosHoursHolidayX1: { type: PayrollHours },
  totalSystemHoursHolidayX2: { type: PayrollHours },
  totalTrainingHoursHolidayX2: { type: PayrollHours },
  totalTosHoursHolidayX2: { type: PayrollHours },
  totalTaxableBonus: { type: mongoose.Schema.Types.Decimal128 },//Implement | almost done | added in taxable gross
  totalNonTaxableBonus: { type: mongoose.Schema.Types.Decimal128 },//Implement | almost done | not added into gross
  totalDeductions: { type: mongoose.Schema.Types.Decimal128 },
  totalOtherPays: { type: mongoose.Schema.Types.Decimal128 }, //needs an update after save
  totalFinalPayments: { type: mongoose.Schema.Types.Decimal128 }, //implement | almost done
  totalMaternities: { type: mongoose.Schema.Types.Decimal128 },
  totalCompassionate: { type: mongoose.Schema.Types.Decimal128 },
  totalCSL: { type: mongoose.Schema.Types.Decimal128 },
  totalOvertime: { type: Number },
  totalOvertimePay: { type: PayrollPayment },
  totalSystemRegularPay: { type: PayrollPayment },
  totalTrainingRegularPay: { type: PayrollPayment },
  totalTosRegularPay: { type: PayrollPayment },
  totalSystemHolidayX1Pay: { type: PayrollPayment },
  totalTrainingHolidayX1Pay: { type: PayrollPayment },
  totalTosHolidayX1Pay: { type: PayrollPayment },
  totalSystemHolidayX2Pay: { type: PayrollPayment },
  totalTrainingHolidayX2Pay: { type: PayrollPayment },
  totalTosHolidayX2Pay: { type: PayrollPayment },
  grossBeforeCSLPayment: { type: mongoose.Schema.Types.Decimal128 }, //needs an update after save 8
  grossPayment: { type: mongoose.Schema.Types.Decimal128 }, //needs an update after save 8
  ssEmployeeContribution: { type: mongoose.Schema.Types.Decimal128 }, //needs an update after save 8
  ssEmployerContribution: { type: mongoose.Schema.Types.Decimal128 }, //needs an update after save 8
  incomeTax: { type: mongoose.Schema.Types.Decimal128 }, //needs an update after save 8
  netPayment: { type: mongoose.Schema.Types.Decimal128 }, //needs an update after save 8
});



PayrollSchema.index({ fromDate: -1, toDate: -1});
PayrollSchema.index({ payroll_Id: -1});
PayrollSchema.index({ payment_Id: -1});

let PayrollSequenceSchema = new Schema({
  _id: {type: String},
  sequence_value: {type: Number, default: 0},
})


const payrollSequence = mongoose.model("payroll-sequence", PayrollSequenceSchema);
const payroll = mongoose.model("payroll", PayrollSchema);
const bonus = mongoose.model("payroll-bonus", BonusSchema);
const deduction = mongoose.model("payroll-deduction", DeductionSchema);
const otherPay = mongoose.model("payroll-otherPay", OtherPaySchema);

module.exports = {
  bonus,
  deduction,
  otherPay,
  payroll,
  payrollSequence
};
