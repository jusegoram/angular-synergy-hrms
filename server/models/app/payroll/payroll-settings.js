let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let daysSchema = new Schema({
  date: {type: Date},
  name: {type: String},
  rate: {type: Number},
});

let SocialSecurityContributionsSchema = new Schema({
  fromMonthly: {type: Number},
  toMonthly: {type: Number},
  insurableEarning: {type: Number},
  employerContributionPercentage: {type: Number},
  employeeContributionPercentage: {type: Number},
});

let HolidaySchema = new Schema({
  year: {type: Number},
  holidays: {type: [daysSchema]},
});

let PayrollSettingsSchema = new Schema({
    socialSecurityContributions: {type: [Object]},
    holidays: {type: HolidaySchema},
    payrollType: {type: String},
    dateFrom: {type: Date},
    dateTo:{type: Date},
  }
);
PayrollSettingsSchema.index({dateFrom: -1});



const payrollSettings = mongoose.model('payroll-settings', PayrollSettingsSchema);
const socialTables = mongoose.model('payroll-socialTables', SocialSecurityContributionsSchema);

module.exports = {
  payrollSettings, socialTables
}
