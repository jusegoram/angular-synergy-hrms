var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employeeId: { type: String, required: true, unique: true},
    client: { type: String, required: false}, //reports index
    campaign: { type: String, required: false }, //reports index
    supervisor: { type: String , required: false}, //reports index
    trainer: { type: String, required: false},
    trainingGroupRef: { type: String, required: false }, //reports index
    trainingGroupNum: { type: Number, required: false },
    hireDate:{ type: Date, required: false }, //reports index
    terminationDate:{ type: Date, required: false },
    reapplicant: { type: Boolean, required: false},
    reapplicantTimes: {type: Number, required: false},
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main', required: false },

});
// add training group (ref:num), and trainer
module.exports = mongoose.model('Employee-Company', schema);
