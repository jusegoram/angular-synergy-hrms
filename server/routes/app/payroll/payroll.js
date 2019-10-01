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
            payrollType: req.body._employees[0].payrollType,
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

router.get('/', (req, res) => {
  const {id, type} = req.query;
  if(id === ''){
    //TODO: Use aggregate to calculate total amount of employees, and total payed, total Social, total Tax
    // Payroll.find().limit(52).select({incometaxTable: 0, employees: 0}).lean()
   let or;
   if(type === '') or = {$or: [{"employees.payrollType": 'BI-WEEKLY'}, {"employees.payrollType": 'SEMIMONTHLY'}]};
   else { or = {$or: [{"employees.payrollType": type}]};}
   Payroll.aggregate([
    { $unwind: "$employees" },
    { $match:  or },
    {$project: {
      '_id': 1,
      'employees': 1,
      'fromDate': 1,
      'toDate': 1,
    }},
    { $group: {
      _id:{
        '_id': '$_id',
        'fromDate': '$fromDate',
        'toDate': '$toDate',
      },
      'employeesAmount': {$sum: 1},
      "netWages": { $push: "$employees.netWage" },
      "totalPayed" : {$sum: '$employees.netWage'},
      "incomeTaxes": {$push: "$employees.incomeTax"},
      'totalTaxes': {$sum:'$employees.incomeTax'},
      "companyContributions": {$push: '$employees.socialSecurityEmployer'},
      'totalCompanyContributions': {$sum:'$employees.socialSecurityEmployer'},
      "employeeContributions": {$push: '$employees.socialSecurityEmployee'},
      'totalEmployeeContributions': {$sum:'socialSecurityEmployee'}
    }},
    {$sort: {'_id.fromDate': -1}},
    { $limit: 53 }
   ]).allowDiskUse(true).exec((err, doc) => {
    if (err) res.status(500).json(err);
    res.status(200).json(doc);
  });
  }else{
    Payroll.find({_id: id}, (err, doc) => {
      if(err) res.status(500).json(err);
      else { res.status(200).json(doc)}
    })
  }
});

router.get("/employees", (req, res) => {
  let id = req.query.id;
  Payroll.aggregate([
    { $limit: 53 },
    { $unwind: "$employees" },
    { $match: { "employees.employee": id } },
    {
      $project: {
        "employees.employeeId": 1,
        "employees.employeeName": 1,
        "employees.totalSystemHours": 1,
        "employees.totalOvertimeHours": 1,
        "employees.totalHolidayHours": 1,
        "employees.socialSecurityEmployer":1,
        "employees.socialSecurityEmployee":1,
        "employees.employeeCompany":1,
        'employees.employeePosition': 1,
        "employees.employeePayroll":1,
        "employees.deductions": 1,
        "employees.otherpay": 1,
        "employees.vacations": 1,
        "employees.maternity": 1,
        "employees.csl": 1,
        "employees.netWage": 1,
        "employees.incomeTax": 1,
        "fromDate": 1,
        "toDate": 1
      },
    },
    { $sort: { fromDate: -1 } },
    { $group: {
      _id: 'employees.employee',
      'payrolls':
      {
        $push: {
        employeeId:'$employees.employeeId',
        employeeName: '$employees.employeeName',
        campaign: '$employees.employeeCompany.campaign',
        client: '$employees.employeeCompany.client',
        positionId:'$employees.employeePosition.positionId',
        positionName: '$employees.employeePosition.name',
        employeePayroll: '$employees.employeePayroll',
        systemHours: '$employees.totalSystemHours',
        overtimeHours:'$employees.totalOvertimeHours',
        holidayHours:'$employees.totalHolidayHours',
        socialSecurityEmployer:'$employees.socialSecurityEmployer',
        socialSecurityEmployee: '$employees.socialSecurityEmployee',
        netWage: '$employees.netWage',
        incomeTax: '$employees.incomeTax',
        fromDate: '$fromDate',
        toDate:'$toDate'}},
      'weeks': {$sum: 1},
      'totalYearlyWage': {$sum: '$employees.employeePosition.wage'},
      'baseWageList': {$push: '$employees.employeePosition.wage'},
      'totalPayed': {$sum: '$employees.netWage'},
      'yearlyCSL': {$push: '$employees.csl'},
      'totalCSL': {$sum: '$employees.csl.amount'},
      'yearlyMaternity': {$push: '$employees.maternity'},
      'totalCSL': {$sum: '$employees.maternity.amount'},
      'yearlyVacations': {$push: '$employees.vacations'},
      'totalCSL': {$sum: '$employees.vacations.amount'},
      'yearlyDeductions':  {$push: '$employees.deductions'},
      'totalDeductions': {$sum: '$employees.deductions.amount'},
      'totalCompanyContributions': {$sum:'$employees.socialSecurityEmployer'},
      'totalEmployeeContributions': {$sum:'$employees.socialSecurityEmployee'},
      'totalIncomeTax': {$sum:'$employees.incomeTax'},
    }},
    { $limit: 53 }
  ]).exec((err, doc) => {
    if (err) res.status(500).json(err);
    res.status(200).json(doc);
  });
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
