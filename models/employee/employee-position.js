var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    employeeId: { type: String, required: true },
    positionid: { type: String, required: true },
    position: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false }
});

module.exports = mongoose.model('EmployeePosition', schema);