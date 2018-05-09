var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employeeId: { type: String, required: true },
    positionid: { type: String, required: true },
    position: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false },
});
// add training group (ref:num), and trainer

schema.statics.latestPosition =   function (employeeid, callback) {
    this
    .find({employeeId: employeeid})
    .sort({"startDate": -1})
    .limit(1)
    .exec(callback)
}
module.exports = mongoose.model('EmployeePosition', schema);