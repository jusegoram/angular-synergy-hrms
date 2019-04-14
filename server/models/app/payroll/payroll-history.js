let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PayrollHistorySchema = new Schema({
  socialSecurity: {type: [SocialSecurityGroupsSchema]},
  holidays: {type: HolidaySchema},
  payrollType: {type: String},
  dateFrom: {type: Date},
  dateTo:{type: Date},
  payroll:{type: [mongoose.Schema.Types.ObjectId], ref: 'payroll'}
}
);

module.exports = mongoose.model('payroll-history', PayrollHistorySchema);
