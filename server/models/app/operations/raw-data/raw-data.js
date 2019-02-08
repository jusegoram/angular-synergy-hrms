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
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main' },
  employeeId: { type: String, required: true},
  client: {type: String, required: true},
  campaign: {type: String, required: true},
  dialerId: { type: String, required: true},
  date: {type: Date, required: true},
  incommingCallCount: {type: Number, required: false},
  totalWithJobs: {type: Number, required: false},
  totalOOAJobs: {type: Number, required: false},
  otherCalls: {type: Number, required: false},
  lostJobs: {type: Number, required: false},
  notCheckGeneral: {type: Number, required: false},
  notCheckGeneral: {type: Number, required: false},
  totalDurationAllCalls: {type: hhmmssSchema, require: false},
  totalDurationWithJobs: {type: hhmmssSchema, require: false},
  avgDurationSolicitors: {type: hhmmssSchema, require: false},
  avgDurationLost: {type: hhmmssSchema, require: false},
  conversionRate: {type: Number, require: false},
  train: {type: hhmmssSchema, require: false},
  ticket: {type: hhmmssSchema, require: false},
  spacll: {type: hhmmssSchema, require: false},
  nxdial: {type: hhmmssSchema, require: false},
  moveup: {type: hhmmssSchema, require: false},
  meet: {type: hhmmssSchema, require: false},
  lunch: {type: hhmmssSchema, require: false},
  login: {type: hhmmssSchema, require: false},
  lagged: {type: hhmmssSchema, require: false},
  holds: {type: hhmmssSchema, require: false},
  fsr: {type: hhmmssSchema, require: false},
  email: {type: hhmmssSchema, require: false},
  doortg: {type: hhmmssSchema, require: false},
  cllbk: {type: hhmmssSchema, require: false},
  chats: {type: hhmmssSchema, require: false},
  break: {type: hhmmssSchema, require: false},
  acw: {type: hhmmssSchema, require: false},
  none: {type: hhmmssSchema, require: false},
  statusName: {type: String, required: false},
  lengthInSec: {type:hhmmssSchema, required:false},
});

schema.index({campaign: 1, date: -1});
module.exports = mongoose.model('operations-raw-data', schema);
