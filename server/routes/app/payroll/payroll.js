let jwt = require("jsonwebtoken");
let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

let Employee = require("../../../models/app/employee/employee-main");
let Hours = require("../../../models/app/operations/operations-hour");
let PayrollSchemas = require("../../../models/app/payroll/payroll");
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

router.get("/getPayroll", (req, res) => {
  let type = req.query.payrollType + "";
  let from = decodeURIComponent(req.query.from);
  let to = decodeURIComponent(req.query.to);

  getActiveAndPayrolltypeEmployees(type, from, to).then(
    resolve => {
      res.status(200).json(resolve);
    },
    reject => {
      res.status(500).json(reject);
    }
  );
});

router.post("/getOtherPayrollInfo", (req, res)=> {
  let employeeIds;
  let from = req.body.from;
  let to = req.body.to;
  Promise.all([getHours(employeeIds, from, to), getOvertime(employeeIds, from, to), getBonus(employeeIds, from, to), getDeductions(employeeIds, from, to)]).then(result => {
    res.status(200).json(result);
  }).catch(err => {
    console.log(err);
  })
});

router.post("/setDeduction", (req, res) => {
  let deductions = req.body;
  Deduction.insertMany(deductions, err => {
    if (err) res.status(500).json(err);
    else res.status(200).json({ message: "saved correctly" });
  });
});

router.post("/setBonus", (req, res) => {
  let bonus = req.body;
  Bonus.insertMany(bonus, err => {
    if (err) res.status(500).json(err);
    else res.status(200).json({ message: "saved correctly" });
  });
});

var joinEmployeesAndBonus = (employees, from, to) => {};
var getActiveAndPayrolltypeEmployees = (payrollType, from, to) => {
  let type = payrollType.toUpperCase();
  return new Promise((resolve, reject) => {
    let employees = [];
    let cursor = Employee.find(
      {
        status: "active",
        "payroll.payrollType": type
      },
      "_id employeeId firstName middleName lastName socialSecurity status company payroll position shift"
    ).populate({path: 'Employee-Shift', options: { sort: { 'startDate': -1 }, limit: 1} }).sort({_id:-1}).cursor();
    cursor.on("data", item => {
      employees.push(item);
    });
    cursor.on("error", err => {
      console.log(err);
      if (err) reject(err);
    });
    cursor.on("end", () => {
      let mappedEmployees = employees.map(async employee => {
        let hours;
        let resEmployee= JSON.parse(JSON.stringify(employee));
        delete resEmployee._id;
        delete resEmployee.payroll;
        delete resEmployee.company;
        delete resEmployee.payroll;
        delete resEmployee.position;
        delete resEmployee.shift;
        resEmployee.employeeName = `${employee.firstName} ${
          employee.middleName
        } ${employee.lastName}`;
        resEmployee.employeeName + employee.middleName
          ? employee.middleName + " " + employee.lastName
          : employee.lastName;
        resEmployee.employeePosition = employee.position[
          employee.position.length - 1
        ]
          ? employee.position[employee.position.length - 1].position
          : null;
        resEmployee.employeeShift = employee.shift[0] ? employee.shift[0].shift: null;
        resEmployee.employee = employee._id;
        resEmployee.employeePayroll = employee.payroll;
        resEmployee.payrollType = employee.payroll.payrollType;
        resEmployee.employeeCompany = employee.company;
        resEmployee.hourlyRate = calculateHourlyRate(
          resEmployee.employeePosition
            ? resEmployee.employeePosition.baseWage
            : null
        );
        return resEmployee;
      });
      Promise.all(mappedEmployees).then(completed => {
        resolve(completed);
      });
    });
  });
};


var getTotal = arr => {
  if (arr.length > 0) {
    let mapped = arr.map(i => i.amount);
    let totaled = mapped.reduce((p, c) => p + c);
    return totaled;
  } else return 0;
};

var getTotalHours = arr => {
  if (arr.length > 0) {
    let totaled = {};
    totaled.hh = arr.reduce((p, c) => p + c.hh, 0);
    totaled.mm = arr.reduce((p, c) => p + c.mm, 0);
    totaled.ss = arr.reduce((p, c) => p + c.ss, 0);

    let time = totaled.hh * 3600 + totaled.mm * 60 + totaled.ss;
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;
    var ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    let correctedTotal = {
      hh: hrs,
      mm: mins,
      ss: secs,
      value: time / 3600,
      valueString: ret
    };
    return correctedTotal;
  } else {
    let finished = {
      hh: 0,
      mm: 0,
      ss: 0,
      value: 0,
      valueString: "00:00:00"
    };
    return finished;
  }

};

var getDeductions = (employee, fromDate, toDate) => {
  // let mappedEmployees = employees.map(employee => employee.employee);
  return new Promise((resolve, reject) => {
    Deduction.find({
      date: {
        $gte: fromDate,
        $lte: toDate
      }
    }).sort({employee: -1})
      .lean()
      .exec((err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
  });
};

var getBonus = (employees, fromDate, toDate) => {
  // let mappedEmployees = employees.map(employee => employee.employee);
  return new Promise((resolve, reject) => {
    Bonus.find({
      date: {
        $gte: fromDate,
        $lte: toDate
      }
    }).sort({employee: -1})
      .lean()
      .exec((err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
  });
};

var getHours = (employees, fromDate, toDate) => {
  // let mappedEmployees = employees.map(employee => employee.employee);
  return new Promise((resolve, reject) => {
    if(fromDate === undefined || toDate === undefined){
      reject('hours error');
    }
    Hours.find({
      date: {
        $gte: fromDate,
        $lte: toDate
      }
    }).sort({employee: -1})
      .lean()
      .exec((err, res) => {
        if (err) reject(err);
        else {
          resolve(res);
          };
      });
  });
};

var getOvertime = (employees, fromDate, toDate) => {
  return new Promise((resolve, reject) => {
    Overtime.find({
      date: {
        $gte: fromDate,
        $lte: toDate
      }
    })
       .sort({employee: -1})
      .lean()
      .exec((err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
  });
};

var getPayrollSettings = new Promise((resolve, reject) => {});

var setPayrollHistory = new Promise((resolve, reject) => {});

function calculateHourlyRate(employeeWage) {
  if (employeeWage !== null) {
    let wage = employeeWage;
    hourlyRate = 0;
    hourlyRate = (wage * 12) / 26 / 90;
    return hourlyRate;
  } else {
    return 0;
  }
}





function getVacationSalary(employeeVacation) {}

module.exports = router;
