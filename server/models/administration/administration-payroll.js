let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let SocialTableSchema = new Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  table: { type: [Object], required: true }
});
const SocialTable = mongoose.model('payroll-SocialTable', SocialTableSchema);


let HolidayTableSchema = new Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  date: {type: Date, required: true},
  rate: {type: Number, required: false}
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


module.exports = {
  SocialTable, HolidayTable, ExceptionsTable, OtherPayTable, DeductionsTable
}

