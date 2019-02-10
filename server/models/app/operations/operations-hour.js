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
  campaign: {type: String, required: true},
  dialerId: { type: String, required: true },
  date: { type: Date, required: true },
  systemHours: { type: hhmmssSchema, required: true },
  tosHours: { type: hhmmssSchema, required: true },
  timeIn:  { type: hhmmssSchema, required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main' },
});

schema.index({client: 1 ,campaign: 1, date: -1});
module.exports = mongoose.model('operations-hour', schema);
