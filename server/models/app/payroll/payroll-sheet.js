let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PayrollBiweekly = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  employeeId: { type: String, required: true },
  date: { type: String, required: true },
  hours: { type: Number, required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },

});

module.exports = mongoose.model('PayrollBiweekly', PayrollBiweekly);

let PayrollSemimonthly = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  employeeId: { type: String, required: true },
  date: { type: String, required: true },
  hours: { type: Number, required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },

});

module.exports = mongoose.model('Payroll-Semimonthly', PayrollSemimonthly);


