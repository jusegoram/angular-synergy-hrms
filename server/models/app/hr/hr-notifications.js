var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
    type: { type: Number },
    employeeId: {type: String},
    employee: { type: mongoose.Types.ObjectId},
    reason: {type: String},
    requestDate: {type: Date},
    createdDate: { type: Date, default: Date.now },
    state: {type: Number, default: 0},
    managerSignature: { type: mongoose.Types.BinData},
    employeeSignature: { type: mongoose.Types.BinData},
    creationFingerprint: { type: mongoose.Types.ObjectId},
    verificationFingerprint: { type: mongoose.Types.ObjectId},
});

module.exports = mongoose.model('hr-notification', schema);
