let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let EmployeeVacation = new Schema({
  employee: {},
  employeeId: {},
  from: {},
  to: {},
  isPayed: {},
  reason: {},
});

const employeeVacation = mongoose.model('Employee-Vacation', EmployeeVacation);

employeeVacation.statics.latestVacation =   function (employeeid, callback) {
  this
  .find({employeeId: employeeid})
  .sort({"from": -1})
  .limit(1)
  .exec(callback)
}

module.exports = {
  employeeVacation
}
