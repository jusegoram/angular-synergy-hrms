var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let mongooseAutopopulate = require("mongoose-autopopulate")

var schema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employeeId: {type: String, required: true},
    reason: {type: String, required: false},
    comment: {type: String, required: true },
    commentDate: {type: Date, required: true},
    submittedBy: {type: Object},
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee-Main', required: false },
});

schema.plugin(mongooseAutopopulate);
module.exports = mongoose.model('Employee-Comment', schema);
