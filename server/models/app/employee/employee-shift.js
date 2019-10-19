let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let mongooseAutopopulate = require("mongoose-autopopulate")

let daySchema = new Schema({
  day: { type: Number },
  onShift: { type: Boolean },
  startTime: {type: Number},
  endTime: { type: Number }
});

let shiftSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {type: String},
  totalHours: {type: Number },
  daysonShift: {type: Number },
  shift: { type: [daySchema] }
});
const shift = mongoose.model('Administration-Shift', shiftSchema);

let EmployeeShiftSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employeeId: { type: String, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main', required: false },
    createdDate: { type: Date, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
    shift: { type: mongoose.Schema.Types.ObjectId, ref: 'Administration-Shift', required: true , autopopulate: true},
    updatedAt: {type: Date, required: false },
    createdAt: {type: Date, required: false, default: Date.now},
    createdBy: {type: Object, required: false},
    updatedBy: {type: Object, required: false},
});

EmployeeShiftSchema.plugin(mongooseAutopopulate);
const employeeShift = mongoose.model('Employee-Shift', EmployeeShiftSchema);

// add training group (ref:num), and trainer

// positionSchema.statics.latestPosition =   function (employeeid, callback) {
//     this
//     .find({employeeId: employeeid})
//     .sort({"startDate": -1})
//     .limit(1)
//     .exec(callback)
// }
module.exports = {
  shift, employeeShift
}
