let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let mongoosePaginate = require('mongoose-paginate-v2');

let SocialTableSchema = new Schema ({
  fromDate: {type: Date},
  toDate: {type: Date},
  fromEarnings: {type: Number},
  toEarnings: {type: Number},
  weeklyInsurableEarnings: {type: Number},
  employeeContribution: {type: Number},
  employerContribution: {type: Number},
  totalContribution: {type: Number},
});
SocialTableSchema.index({fromEarnings: 1, toEarnings: 1});
SocialTableSchema.plugin(mongoosePaginate);
const SocialTable = mongoose.model('payroll-SocialTable', SocialTableSchema);


let HolidayTableSchema = new Schema ({
  year: {type: Number, required: true},
  name: { type: String, required: true },
  date: {type: Date, required: true},
  rate: {type: Number, required: true}
});
HolidayTableSchema.index({date: 1, rate: 1});
HolidayTableSchema.plugin(mongoosePaginate);
const HolidayTable = mongoose.model('payroll-HolidayTable', HolidayTableSchema);


let ExceptionsTableSchema = new Schema ({
  employeeId: { type: String, required: true },
  dateFrom: {type: Date, required: true},
  dateTo: {type: Date, required: true},
  reason: {type: String, required: false},
});
const ExceptionsTable = mongoose.model('payroll-ExceptionsTable', ExceptionsTableSchema);

let OtherPayTableSchema = new Schema ({
  reason: { type: String, required: true},
  amount: {type: Number, required: false},
});
const OtherPayTable = mongoose.model('payroll-OtherPayTable', OtherPayTableSchema);

let DeductionsTableSchema = new Schema ({
  reason: { type: String, required: true},
  amount: {type: Number, required: false},
});
const DeductionsTable = mongoose.model('payroll-DeductionsTable', DeductionsTableSchema);

let IncomeTaxTableSchema = new Schema ({
  fromAmount: {type: Number, required: false},
  toAmount: {type: Number, required: false},
  taxAmount: {type: Number, required: false},
});
IncomeTaxTableSchema.index({fromAmount: 1, toAmount: 1});
IncomeTaxTableSchema.plugin(mongoosePaginate);
const IncomeTaxTable = mongoose.model('payroll-IncomeTaxTable', IncomeTaxTableSchema);

module.exports = {
  SocialTable, HolidayTable, ExceptionsTable, OtherPayTable, DeductionsTable, IncomeTaxTable
}

