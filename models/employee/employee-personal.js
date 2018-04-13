var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    employeeId: { type: String, required: true },
    address: { type: String, required: true },
    addressDate: { type: Date, required: true },
    celNumber: { type: String, required: true },
    telNumber: { type: String, required: true },
    emailAddress: { type: String, required: true },
    emailDate: {type: Date, required: true }
});
module.exports = mongoose.model('EmployeePersonal', schema);