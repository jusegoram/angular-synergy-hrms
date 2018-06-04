let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let SocialTable = new Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  table: { type: [Object], required: true }
});
module.exports = mongoose.model('Administration-SocialTable', SocialTable);


let HolidayTable = new Schema ({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  date: {type: Date, required: true},
  rate: {type: Number, required: false}
});
module.exports = mongoose.model('Administration-HolidayTable', HolidayTable);


let VacationTable = new Schema ({
  employeeId: { type: String, required: true },
  dateFrom: {type: Date, required: true},
  dateTo: {type: Date, required: true},
  rate: {type: Number, required: false},
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false }
});
module.exports = mongoose.model('Administration-VacationTable', VacationTable);


let ExceptionsTable = new Schema ({
  employeeId: { type: String, required: true },
  dateFrom: {type: Date, required: true},
  dateTo: {type: Date, required: true},
  reason: {type: String, required: false},
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false }
});
module.exports = mongoose.model('Administration-ExceptionsTable', ExceptionsTable);

let BonusTable = new Schema ({
  employeeId: { type: String, required: true },
  reason: { type: String, required: true},
  date: {type: Date, required: true},
  amount: {type: Number, required: false},
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false }
});
module.exports = mongoose.model('Administration-BonusTable', BonusTable);

let DeductionsTable = new Schema ({
  employeeId: { type: String, required: true },
  reason: { type: String, required: true},
  date: {type: Date, required: true},
  amount: {type: Number, required: false},
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false }
});
module.exports = mongoose.model('Administration-DeductionsTable', DeductionsTable);
