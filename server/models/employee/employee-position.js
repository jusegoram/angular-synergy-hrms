let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let mongooseAutopopulate = require("mongoose-autopopulate")
let positionSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employeeId: { type: String, required: true },
    client: { type: String, required: true },
    department: { type: String, required: false },
    position: {  type: mongoose.Schema.Types.ObjectId, ref: 'Administration-Position', required: false, autopopulate: true},
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main', required: false },
});
// add training group (ref:num), and trainer

positionSchema.plugin(mongooseAutopopulate);
positionSchema.statics.latestPosition =   function (employeeid, callback) {
    this
    .find({employeeId: employeeid})
    .sort({"startDate": -1})
    .limit(1)
    .exec(callback)
}

module.exports = mongoose.model('Employee-Position', positionSchema);
