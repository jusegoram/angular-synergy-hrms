var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let mongooseAutopopulate = require("mongoose-autopopulate")

var schema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employeeId: {type: String, required: true},
    reason1: {type: String, required: true },
    reason2: {type: String, required: false },
    comment: {type: String, required: true },
    commentDate: {type: Date, required: true},
    submittedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'Administration-User', required: true, autopopulate: true},
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main', required: false },
});

schema.plugin(mongooseAutopopulate);
module.exports = mongoose.model('Employee-Attrition', schema);
