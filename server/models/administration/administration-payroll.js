let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let SocialTableSchema = new Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  table: { type: [Object], required: true }
});
const SocialTable = mongoose.model('payroll-SocialTable', SocialTableSchema);


let HolidayTableSchema = new Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  year: {type: Number, required: true},
  name: { type: String, required: true },
  date: {type: Date, required: true},
  rate: {type: Number, required: true}
});
const HolidayTable = mongoose.model('payroll-HolidayTable', HolidayTableSchema);


let ExceptionsTableSchema = new Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  employeeId: { type: String, required: true },
  dateFrom: {type: Date, required: true},
  dateTo: {type: Date, required: true},
  reason: {type: String, required: false},
});
const ExceptionsTable = mongoose.model('payroll-ExceptionsTable', ExceptionsTableSchema);

let OtherPayTableSchema = new Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  reason: { type: String, required: true},
  amount: {type: Number, required: false},
});
const OtherPayTable = mongoose.model('payroll-OtherPayTable', OtherPayTableSchema);

let DeductionsTableSchema = new Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  reason: { type: String, required: true},
  amount: {type: Number, required: false},
});
const DeductionsTable = mongoose.model('payroll-DeductionsTable', DeductionsTableSchema);

let IncomeTaxTableSchema = new Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  fromAmount: {type: Number, required: false},
  toAmount: {type: Number, required: false},
  taxAmount: {type: Number, required: false},
});
const IncomeTaxTable = mongoose.model('payroll-IncomeTaxTable', IncomeTaxTableSchema);

module.exports = {
  SocialTable, HolidayTable, ExceptionsTable, OtherPayTable, DeductionsTable, IncomeTaxTable
}

