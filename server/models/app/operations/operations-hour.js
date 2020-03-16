let mongoose = require('mongoose');
let mongooseUniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let hhmmssSchema = new Schema({
  value: {type: String, required: true},
  valueInMinutes: {type: Number, required: true},
  hh: {type: Number, required: true},
  mm: {type: Number, required: true},
  ss: {type: Number, required: true}
})

let schema = new Schema({
  payroll: {type: mongoose.Schema.Types.ObjectId, ref: 'payroll'},
  payed: { type: Boolean, default: false},
  uniqueId: { type: String, unique: true},
  employeeId: { type: String, required: true },
  employeeName: {type: String},
  billable: {type: Boolean},
  client: {type: String},
  campaign: {type: String },
  hasShift: {type: Boolean, default: false},
  shiftDay: { type: Number }, //new
  onShift: { type: Boolean }, //new
  shiftStartTime: {type: Number}, //new
  shiftEndTime: { type: Number }, //new
  shiftScheduledHours: {type: Number}, //new
  shiftScheduledBreakAndLunch: {type: Number},
  dialerId: { type: String, required: false },
  date: { type: Date, required: true },
  hasHours: {type: Boolean, default: false},
  matrix: {type: String, default: null},
  hourlyRate: {type: Number},
  positionName: {type: String},
  holiday: {type: Boolean, default: false},
  holidayRate: {type: Number},
  systemHours: { type: hhmmssSchema, required: false },
  breakHours: { type: hhmmssSchema, required: false }, //new
  lunchHours:{ type: hhmmssSchema, required: false }, //new
  trainingHours:{ type: hhmmssSchema, required: false }, //new
  tosHours: { type: hhmmssSchema, required: false }, //new
  timeIn:  { type: hhmmssSchema, required: false },
  attendance: {type: String, default: 'ABSENT'}, //present, absent, on-leave, on-vacation, unknown
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main' },
  fileId: { type: mongoose.Schema.Types.ObjectId},
  createdDate: { type: Date, default: Date.now},
  updatedDate: {type: Date},
  hourId: {type: mongoose.Schema.Types.ObjectId}
});

schema.plugin(mongooseUniqueValidator);
schema.index({employeeId: -1, client: 1 ,campaign: 1, date: -1});
module.exports = mongoose.model('operations-hour', schema);
