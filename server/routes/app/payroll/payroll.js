let jwt = require('jsonwebtoken');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let PayrollHour = require("../../../models/app/employee/employee-hour");

router.get('/payrollInfo', function (req, res) {
  let fromDate = req.body.fromDate;
  let toDate = req.body.toDate;
  let token = jwt.decode(req.query.token);
  let dateNow = new Date();
  if(token.exp < dateNow.getTime()){
    res.status(400).send("Sorry your Authentication is expired");
  }else{
    PayrollHour.find({
      date:{
        $gte: fromDate,
        $lte: toDate,
      }
    })
    .populate({path: 'employee', select: '-personal -comments -attrition -education -family -shift', model:'employee-main'})
    .exec((err, result) => {
      if (err) console.log(err);
      else res.status(200).json(result);
    });
 }
});

function calculateBaseWage(employeeWage){

}

function calculateTotalBonus(employeeBonus){

}

function calculateTotalDeduction(employeeDeductions) {

}

function calculateTotalOvertime(employeeOvertime) {

}

function getSocialSecurityCharge() {

}

function getVacationSalary(employeeVacation) {

}
/**
 *
 *Gross salary:
 */
function calculateGrossSalary() {

}
module.exports = router;
