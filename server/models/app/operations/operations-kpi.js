let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let hhmmssSchema = new Schema({
  value: {type: String, required: true},
  hh: {type: Number, required: true},
  mm: {type: Number, required: true},
  ss: {type: Number, required: true}
})

let schema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  employeeId: { type: String, required: true },
  employeeName: {type: String, required: true},
  client: {type: String, required: true},
  campaign: {type: String, required: true },
  teamId: {type: String, required: true},
  kpiName: { type: String, required: true },
  date: { type: Date, required: true },
  score: { type: Number, required: false },
  scoreInTime: {type: hhmmssSchema, required: false},
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main' },
  supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main' },
});

schema.index({campaign: 1, date: -1});
module.exports = mongoose.model('operations-kpi', schema);
