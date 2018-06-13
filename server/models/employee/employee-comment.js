var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employeeid: {type: String, required: true},
    comment: {type: String, required: true },
    commentDate: {type: Date, required: true},
    submittedBy: {type: mongoose.Schem.Types.ObjectId, ref: 'User', required: true},
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false },
});

module.exports = mongoose.model('Employee-Comment', schema);
