var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employeeId: { type: String, required: true, unique: true},
    maritalStatus:{ type: String, required: false },
    address: { type: String, required: false },
    town: { type: String, required: false },
    district: { type: String, required: false },
    addressDate: { type: Date, required: false },
    celNumber: { type: String, required: false },
    telNumber: { type: String, required: false },
    birthDate: {type: Date, required: false},
    birthPlace: { type: String, required: false },
    birthPlaceDis: { type: String, required: false },
    birthPlaceTow: { type: String, required: false },
    emailAddress: { type: String, required: false },
    emailDate: {type: Date, required: false },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false },
});
module.exports = mongoose.model('EmployeePersonal', schema);