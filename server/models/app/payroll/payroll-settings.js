let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let daysSchema = new Schema({
  date: {type: Date},
  name: {type: String},
  rate: {type: Number},
});

let SocialSecurityGroupsSchema = new Schema({
  fromMonthly: {type: Number},
  toMonthly: {type: Number},
  employeeContribution: {type: Number},
  employerContribution: {type: Number},
  totalWeekly: {type: Number},
})

let HolidaySchema = new Schema({
  year: {type: Number},
  holidays: {type: [daysSchema]},
});

let PayrollSettingsSchema = new Schema({
    socialSecurity: {type: [SocialSecurityGroupsSchema]},
    holidays: {type: HolidaySchema},
    payrollType: {type: String},
    dateFrom: {type: Date},
    dateTo:{type: Date},
  }
);

module.exports = mongoose.model('payroll-settings', PayrollSettingsSchema);
