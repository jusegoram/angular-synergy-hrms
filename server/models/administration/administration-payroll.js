let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let SocialTableSchema = new Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  table: { type: [Object], required: true }
});
const SocialTable = mongoose.model('Administration-payroll-SocialTable', SocialTableSchema);


let HolidayTableSchema = new Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  date: {type: Date, required: true},
  rate: {type: Number, required: false}
});
const HolidayTable = mongoose.model('Administration-payroll-HolidayTable', HolidayTableSchema);


let VacationTableSchema = new Schema ({
  employeeId: { type: String, required: true },
  dateFrom: {type: Date, required: true},
  dateTo: {type: Date, required: true},
  rate: {type: Number, required: false},
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false }
});
const VacationTable = mongoose.model('Administration-payroll-VacationTable', VacationTableSchema);


let ExceptionsTableSchema = new Schema ({
  employeeId: { type: String, required: true },
  dateFrom: {type: Date, required: true},
  dateTo: {type: Date, required: true},
  reason: {type: String, required: false},
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false }
});
const ExceptionsTable = mongoose.model('Administration-payroll-ExceptionsTable', ExceptionsTableSchema);

let BonusTableSchema = new Schema ({
  employeeId: { type: String, required: true },
  reason: { type: String, required: true},
  date: {type: Date, required: true},
  amount: {type: Number, required: false},
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false }
});
const BonusTable = mongoose.model('Administration-payroll-BonusTable', BonusTableSchema);

let DeductionsTableSchema = new Schema ({
  employeeId: { type: String, required: true },
  reason: { type: String, required: true},
  date: {type: Date, required: true},
  amount: {type: Number, required: false},
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false }
});
const DeductionsTable = mongoose.model('Administration-payroll-DeductionsTable', DeductionsTableSchema);


module.exports = {
  SocialTable, HolidayTable, VacationTable, ExceptionsTable, BonusTable, DeductionsTable
}

