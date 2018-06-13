let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  employeeId: { type: String, required: true },
  dialerId: { type: String, required: true },
  date: { type: String, required: true },
  hours: { type: Number, required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },

});

module.exports = mongoose.model('Payroll-Hour', schema);
