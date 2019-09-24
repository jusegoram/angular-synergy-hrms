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
let Otherpay = PayrollSchemas.otherPay;
let Payroll = PayrollSchemas.payrollStorage;
let adminPayroll = require("../../../models/administration/administration-payroll");


router.post("/", (req, res) => {
  Payroll.find(
    {
      $or: [
        {
          $and: [
            {
              fromDate: {
                $lte: req.body._fromDate
              },
              toDate: {
                $gte: req.body._fromDate
              }
            },
            {
              fromDate: {
                $lte: req.body._toDate
              },
              toDate: {
                $gte: req.body._toDate
              }
            }
          ]
        },
        {
          fromDate: {
            $gte: req.body._fromDate,
            $lte: req.body._toDate
          },
          toDate: {
            $lte: req.body._fromDate,
            $lte: req.body._toDate
          }
        }
      ]
    },
    (err, doc) => {
      if (err)
        res
          .status(500)
          .json({ message: " error while creating payroll", err: err });
      else {
        console.log(doc);
        if (doc.length > 0) {
          res.status(500).json({
            error: "The payroll you are trying to create already exists."
          });
        } else {
          let payroll = {
            _id: new mongoose.Types.ObjectId(),
            employees: req.body._employees,
            socialTable: req.body_socialTable,
            incometaxTable: req.body._incometaxTable,
            deductionsTable: req.body._deductionsTable,
            otherpayTable: req.body._otherpayTable,
            exceptionsTable: req.body._exceptionsTable,
            holidayTable: req.body._holidayTable,
            fromDate: req.body._fromDate,
            toDate: req.body._toDate
          };
          Payroll.create(payroll, (err, doc) => {
            if (err)
              res
                .status(500)
                .json({ message: " error while creating payroll", err: err });
            else res.status(200).json(doc);
          });
        }
      }
    }
  );
});

router.get('/employees', (req, res) => {
  Payroll.find({

  })
  Payroll.aggregate()
});

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

router.post("/getOtherPayrollInfo", (req, res) => {
  let employeeIds;
  let from = req.body.from;
  let to = req.body.to;
  Promise.all([
    getHours(employeeIds, from, to),
    getOvertime(employeeIds, from, to),
    getBonus(employeeIds, from, to),
    getDeductions(employeeIds, from, to),
    getOtherpay(employeeIds, from, to)
  ])
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
    });
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

router.get("/settings", (req, res) => {
  let fromDate = decodeURIComponent(req.query.from);
  let toDate = decodeURIComponent(req.query.to);
  getPayrollSettings(fromDate, toDate).then(
    result => {
      res.status(200).json(result);
    },
    rejected => {
      res.status(400).json(rejected);
    }
  );
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
    )
      .populate({
        path: "Employee-Shift",
        options: { sort: { startDate: -1 }, limit: 1 }
      })
      .sort({ _id: -1 })
      .cursor();
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
        let resEmployee = JSON.parse(JSON.stringify(employee));
        delete resEmployee._id;
        delete resEmployee.payroll;
        delete resEmployee.company;
        delete resEmployee.payroll;
        delete resEmployee.position;
        delete resEmployee.shift;
        resEmployee.employeeName = `${employee.firstName} ${employee.middleName} ${employee.lastName}`;
        resEmployee.employeeName + employee.middleName
          ? employee.middleName + " " + employee.lastName
          : employee.lastName;
        resEmployee.employeePosition = employee.position[
          employee.position.length - 1
        ]
          ? employee.position[employee.position.length - 1].position
          : null;
        resEmployee.employeeShift = employee.shift[0]
          ? employee.shift[0].shift
          : null;
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

var getDeductions = (employee, fromDate, toDate) => {
  // let mappedEmployees = employees.map(employee => employee.employee);
  return new Promise((resolve, reject) => {
    Deduction.find({
      date: {
        $gte: fromDate,
        $lte: toDate
      }
    })
      .sort({ employee: -1 })
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
    })
      .sort({ employee: -1 })
      .lean()
      .exec((err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
  });
};

var getOtherpay = (employees, fromDate, toDate) => {
  // let mappedEmployees = employees.map(employee => employee.employee);
  return new Promise((resolve, reject) => {
    Otherpay.find({
      date: {
        $gte: fromDate,
        $lte: toDate
      }
    })
      .sort({ employee: -1 })
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
    if (fromDate === undefined || toDate === undefined) {
      reject("hours error");
    }
    Hours.find({
      date: {
        $gte: fromDate,
        $lte: toDate
      }
    })
      .sort({ employee: -1 })
      .lean()
      .exec((err, res) => {
        if (err) reject(err);
        else {
          resolve(res);
        }
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
      .sort({ employee: -1 })
      .lean()
      .exec((err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
  });
};

var getSettingsTaskArray = (fromDate, toDate) => {
  let tasks = [
    "SocialTable",
    "HolidayTable",
    "ExceptionsTable",
    "OtherPayTable",
    "DeductionsTable",
    "IncomeTaxTable"
  ];
  let promiseChain = tasks.map(task => {
    if (task === "HolidayTable") {
      return new Promise((resolve, reject) => {
        adminPayroll[task]
          .find({
            date: {
              $gte: fromDate,
              $lte: toDate
            }
          })
          .lean()
          .exec((err, res) => {
            if (err) reject(err);
            else resolve(res);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        adminPayroll[task]
          .find()
          .lean()
          .exec((err, res) => {
            if (err) reject(err);
            else resolve(res);
          });
      });
    }
  });
  return promiseChain;
};
var getPayrollSettings = (fromDate, toDate) => {
  return new Promise((resolve, reject) => {
    const tasks = getSettingsTaskArray(fromDate, toDate);
    return tasks
      .reduce((promiseChain, currentTask) => {
        return promiseChain.then(chainResults =>
          currentTask.then(currentResult => [...chainResults, currentResult])
        );
      }, Promise.resolve([]))
      .then(arrayOfResults => {
        resolve(arrayOfResults);
      })
      .catch(err => {
        reject(err);
      });
  });
};

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
