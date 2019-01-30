let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  employeeId: { type: String, required: true },
  KPI: { type: String, required: true },
  date: { type: Date, required: true },
  score: { type: Number, required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main' },
});

module.exports = mongoose.model('Employee-KPI', schema);
