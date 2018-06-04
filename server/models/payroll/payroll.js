let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PayrollCurrent = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  employeeId: { type: String, required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  payrollType: {type: String, required: true},
  totalPayed: { type: Number, Required: false },
  totalHours:{type: Number, Required: true},
  totalOvertime:{type: Number, Required: true},
  rate:{type: Number, Required: true},
  overtimeRate:{type: Number, Required: true},
  totalBonus:{type: Number, Required: true},
  bonusReason:{type: Number, Required: true},
  totalDeductions:{type: String, required: true},
  deductionsReason:{type: String, required: true},
  date: { type: Date, required: true }
});

module.exports = mongoose.model('Payroll-Current', PayrollCurrent);



let PayrollDetail = new Schema({
  date:{},
  totalHours:{},
  totalOvertime:{},
  rate:{},
  overtimeRate:{},
  totalBonus:{},
  bonusReason:{},
  totalDeductions:{},
  deductionsReason:{},

});

let PayrollStorage = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  employeeId: { type: String, required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  payrollType: {type: String, required: true},
  totalPayed: { type: Number, Required: true },
  detail: {type: PayrollDetail, required: true},
  date: { type: String, required: true }
});

module.exports = mongoose.model('Payroll-Storage', PayrollStorage);
