let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let EmployeeVacation = new Schema({
  employee: {type: mongoose.Schema.Types.ObjectId},
  employeeId: {type: Number},
  from: {type: Date},
  to: {type: Date},
  amount: {type: Number},
  isPayed: {type: Boolean},
  createdDate: {type: Date, default: Date.now}
});
EmployeeVacation.index({employeeId: -1, isPayed: -1});
const employeeVacation = mongoose.model('Employee-Vacation', EmployeeVacation);


module.exports = {
  employeeVacation
}
