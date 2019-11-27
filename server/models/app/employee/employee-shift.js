let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let mongooseAutopopulate = require("mongoose-autopopulate");

let daySchema = new Schema({
  day: { type: Number },
  onShift: { type: Boolean },
  startTime: { type: Number },
  endTime: { type: Number },
  scheduledHours: { type: Number }
});

let shiftSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String },
  totalHours: { type: Number },
  daysonShift: { type: Number },
  shift: { type: [daySchema] }
});
const shift = mongoose.model("Administration-Shift", shiftSchema);

let approvedShiftUpdatesSchema = new Schema({
  employeeId: { type: Number },
  reason: { type: String },
  timeIn: { type: String },
  timeOut: { type: String },
  effectiveDate: { type: Date },
  createdDate: { type: Date, default: Date.now }
});

approvedShiftUpdatesSchema.index({ employeeId: -1, effectiveDate: -1 });
const approvedShiftUpdates = mongoose.model("employee-shift-update", approvedShiftUpdatesSchema);


// add training group (ref:num), and trainer

// positionSchema.statics.latestPosition =   function (employeeid, callback) {
//     this
//     .find({employeeId: employeeid})
//     .sort({"startDate": -1})
//     .limit(1)
//     .exec(callback)
// }
module.exports = {
  shift,
  approvedShiftUpdates
};
