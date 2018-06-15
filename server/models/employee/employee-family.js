var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employeeId: {type: String, required: true },
    referenceName: { type: String, required: true },
    relationship: { type: String, required: true },
    celNumber: { type: String, required: true },
    telNumber: { type: String, required: false },
    emailAddress: { type: String, required: false },
    address: { type: String, required: false },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee-Main', required: false },
});

module.exports = mongoose.model('Employee-Family', schema);
