let jwt = require('jsonwebtoken');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let Employee = require('../../../models/app/employee/employee-main');
let Hours = require('../../../models/app/operations/operations-hour');
let PayrollSchemas = require('../../../models/app/payroll/payroll');
let Deduction = PayrollSchemas.deduction;
let Bonus = PayrollSchemas.bonus;
let Overtime = PayrollSchemas.overtime;
let Payroll = PayrollSchemas.payrollStorage;

// let PayrollHour = require("../../../models/app/employee/employee-hour");

// router.get('/payrollInfo', function (req, res) {
//   let fromDate = req.body.fromDate;
//   let toDate = req.body.toDate;
//   let token = jwt.decode(req.query.token);
//   let dateNow = new Date();
//   if(token.exp < dateNow.getTime()){
//     res.status(400).send("Sorry your Authentication is expired");
//   }else{
//     PayrollHour.find({
//       date:{
//         $gte: fromDate,
//         $lte: toDate,
//       }
//     })
//     .populate({path: 'employee', select: '-personal -comments -attrition -education -family -shift', model:'employee-main'})
//     .exec((err, result) => {
//       if (err) console.log(err);
//       else res.status(200).json(result);
//     });
//  }
// });

router.get('/getPayroll', (req, res) => {
  let type = req.body.payrollType;
  let promise = getActiveAndPayrolltypeEmployees(type);
  promise.then(result => {
    res.status(200).json(result);
  }).catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

var getActiveAndPayrolltypeEmployees = (payrollType) => {
  let type = payrollType.toUpperCase();
  return new Promise((resolve, reject) => {
    let employees = [];
    let cursor = Employee.find({
      'status': 'active',
      'payroll.payrollType': type
    }, '_id employeeId firstName middleName lastName socialSecurity status company payroll position').cursor();
    cursor.on('data', item => {
      employees.push(item)
    });
    cursor.on('error', err => {
      if (err) reject(err);
    });
    cursor.on('end', () => {
      let mappedEmployees = employees.map(employee => {
        let resEmployee = JSON.parse(JSON.stringify(employee));
        delete resEmployee._id;
        delete resEmployee.payroll;
        delete resEmployee.company;
        delete resEmployee.payroll;
        resEmployee.position = employee.position[employee.position.length - 1].position;
        resEmployee.employee = employee._id;
        resEmployee.employeePayroll = employee.payroll;
        resEmployee.employeeCompany = employee.company;
        resEmployee.hourlyRate = 0;
        return resEmployee;
      });
      resolve(mappedEmployees);
    });
  });
}

var getDeductions = (employees, fromDate, toDate) => {
 // let mappedEmployees = employees.map(employee => employee.employee);
  return new Promise((resolve, reject) => {
    Deduction.find({
      _id: {
        $in: employees
      },
      date: {
        $gte: fromDate,
        $lte: toDate
      }
    }, (err, res) => {
      if (err) reject(err);
      else {
        res.forEach(deduction => {
          let found = employees.find(employee => {
            return employee._id === deduction.employee;
          });
          found.deduction = [];
          if (found) found.deduction.push(deduction);
        });
        resolve(employees);
      }
    });
  });
}

var getBonus = (employees, fromDate, toDate) => {
 // let mappedEmployees = employees.map(employee => employee.employee);
  return new Promise((resolve, reject) => {
    Bonus.find({
      _id: employees,
      date: {
        $gte: fromDate,
        $lte: toDate
      }
    }, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

var getHours = (employees, fromDate, toDate) => {
 // let mappedEmployees = employees.map(employee => employee.employee);
  return new Promise((resolve, reject) => {
    Hours.find({
      _id: {
        $in: employees
      },
      date: {
        $gte: fromDate,
        $lte: toDate
      }
    }, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

var getOvertime = (employees, fromDate, toDate) => {
  let mappedEmployees = employees.map(employee => employee._id);
  return new Promise((resolve, reject) => {
    Overtime.find({
      _id: {
        $in: employees
      },
      date: {
        $gte: fromDate,
        $lte: toDate
      }
    }, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

var getPayrollSettings = new Promise((resolve, reject) => {

});

var setPayrollHistory = new Promise((resolve, reject) => {

});

function calculateBaseWage(employeeWage) {

}

function calculateTotalBonus(employeeBonus) {

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
