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
  billable: {type: Boolean},
  client: {type: String, required: true},
  campaign: {type: String, required: true},
  dialerId: { type: String, required: false },
  date: { type: Date, required: true },
  systemHours: { type: hhmmssSchema, required: false },
  tosHours: { type: hhmmssSchema, required: false },
  timeIn:  { type: hhmmssSchema, required: false },
  attendance: {type: String, default: 'present'}, //present, absent, on-leave, on-vacation, unknown
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main' },
  fileId: { type: mongoose.Schema.Types.ObjectId},
});

schema.index({client: 1 ,campaign: 1, date: -1});
module.exports = mongoose.model('operations-hour', schema);
