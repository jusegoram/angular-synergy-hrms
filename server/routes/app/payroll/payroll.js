const fs = require("fs");
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
let Payroll = PayrollSchemas.payroll;
let PayedPayroll = PayrollSchemas.payedPayroll;
let sendEmail = require("../../../utils/sendEmail");
let payslipTemplate = require("../../../static/payslipTemplate");
let adminPayroll = require("../../../models/administration/administration-payroll");

router.post("/", (req, res) => {
  const { payroll, otherpay, deduction, bonus } = req.body;

  Payroll.find(
    {
      $or: [
        {
          $and: [
            {
              fromDate: {
                $lte: payroll._fromDate
              },
              toDate: {
                $gte: payroll._fromDate
              }
            },
            {
              fromDate: {
                $lte: payroll._toDate
              },
              toDate: {
                $gte: payroll._toDate
              }
            }
          ]
        },
        {
          fromDate: {
            $gte: payroll._fromDate,
            $lte: payroll._toDate
          },
          toDate: {
            $lte: payroll._fromDate,
            $lte: payroll._toDate
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
        if (doc.length > 0) {
          res.status(500).json({
            error: "The payroll you are trying to create already exists."
          });
        } else {
          const employees = payroll._employees.sort((a, b) => {
            return a.firstName.localeCompare(b.firstName);
          });

          let id = new mongoose.Types.ObjectId();
          if (otherpay.length > 0) {
            Otherpay.updateMany(
              { _id: { $in: otherpay } },
              { $set: { payroll: id } },
              (err, raw) => {}
            );
          }
          if (deduction.length > 0) {
            Deduction.updateMany(
              { _id: { $in: deduction } },
              { $set: { payroll: id } },
              (err, raw) => {}
            );
          }
          let newPayroll = {
            _id: id,
            employees: employees,
            payrollType: payroll._employees[0].payrollType,
            isPayed: payroll._isPayed,
            payedDate: payroll._payedDate,
            socialTable: payroll._socialTable,
            incometaxTable: payroll._incometaxTable,
            deductionsTable: payroll._deductionsTable,
            otherpayTable: payroll._otherpayTable,
            exceptionsTable: payroll._exceptionsTable,
            holidayTable: payroll._holidayTable,
            fromDate: payroll._fromDate,
            toDate: payroll._toDate
          };
          Payroll.create(newPayroll, (err, doc) => {
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

router.get("/", (req, res) => {
  const { id, id2, type, finalized } = req.query;
  let finalizedBoolean = finalized === "true" ? true : false;
  if (id === "") {
    //TODO: Use aggregate to calculate total amount of employees, and total payed, total Social, total Tax
    // Payroll.find().limit(52).select({incometaxTable: 0, employees: 0}).lean()
    let or;
    if (type === "")
      or = {
        $or: [
          { "employees.payrollType": "BI-WEEKLY" },
          { "employees.payrollType": "SEMIMONTHLY" }
        ]
      };
    else {
      or = { $or: [{ "employees.payrollType": type }] };
    }
    Payroll.aggregate([
      { $unwind: "$employees" },
      { $match: { isFinalized: finalizedBoolean, ...or } },
      {
        $project: {
          _id: 1,
          employees: 1,
          fromDate: 1,
          toDate: 1,
          isPayed: 1,
          isFinalized: 1,
          payedDate: 1
        }
      },
      {
        $group: {
          _id: {
            _id: "$_id",
            fromDate: "$fromDate",
            toDate: "$toDate"
          },
          employeesAmount: { $sum: 1 },
          isPayed: { $first: "$isPayed" },
          isFinalized: { $first: "$isFinalized" },
          payedDate: { $first: "$payedDate" },
          netWages: { $push: "$employees.netWage" },
          totalPayed: { $sum: "$employees.netWage" },
          incomeTaxes: { $push: "$employees.incomeTax" },
          totalTaxes: { $sum: "$employees.incomeTax" },
          companyContributions: { $push: "$employees.socialSecurityEmployer" },
          totalCompanyContributions: {
            $sum: "$employees.socialSecurityEmployer"
          },
          employeeContributions: { $push: "$employees.socialSecurityEmployee" },
          totalEmployeeContributions: {
            $sum: "$employees.socialSecurityEmployee"
          }
        }
      },
      { $sort: { "_id.fromDate": -1 } },
      { $limit: 53 }
    ])
      .allowDiskUse(true)
      .exec((err, doc) => {
        if (err) res.status(500).json(err);
        res.status(200).json(doc);
      });
  } else if (id !== "" && id2) {
    Payroll.aggregate([
      {
        $match: {
          $or: [
            { _id: mongoose.Types.ObjectId(id) },
            { _id: mongoose.Types.ObjectId(id2) }
          ]
        }
      },
      { $unwind: "$employees" },
      { $sort: { fromDate: -1 } },
      {
        $project: {
          socialTable: 0,
          incometaxTable: 0,
          deductionsTable: 0,
          otherpayTable: 0,
          exceptionsTable: 0,
          holidayTable: 0
        }
      },
      {
        $group: {
          _id: { employee: "$employees.employee" },
          payrolls: {
            $addToSet: { _id: "$_id", fromDate: "$fromDate", toDate: "$toDate" }
          },
          employeeId: { $first: "$employees.employeeId" },
          firstName: { $first: "$employees.firstName" },
          middleName: { $first: "$employees.middleName" },
          lastName: { $first: "$employees.lastName" },
          client: { $first: "$employees.employeeCompany.client" },
          campaign: { $first: "$employees.employeeCompany.campaign" },
          billable: { $first: "$employees.employeePayroll.billable" },
          paymentType: { $first: "$employees.employeePayroll.paymentType" },
          bankAccount: { $first: "$employees.employeePayroll.bankAccount" },
          bankName: { $first: "$employees.employeePayroll.bankName" },
          payrollType: { $first: "$employees.employeePayroll.payrollType" },
          TIN: { $first: "$employees.employeePayroll.TIN" },
          socialSecurity: { $first: "$employees.socialSecurity" },
          totalIncomeTax: { $sum: "$employees.incomeTax" },
          totalCompanyContributions: {
            $sum: "$employees.socialSecurityEmployer"
          },
          totalEmployeeContributions: {
            $sum: "$employees.socialSecurityEmployee"
          },
          totalNetWage: { $sum: "$employees.netWage" }
        }
      }
    ])
      .allowDiskUse(true)
      .exec((err, doc) => {
        if (err) res.status(500).json(err);
        res.status(200).json(doc);
      });
  } else {
    Payroll.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      { $unwind: "$employees" },
      {
        $project: {
          socialTable: 0,
          incometaxTable: 0,
          deductionsTable: 0,
          otherpayTable: 0,
          exceptionsTable: 0,
          holidayTable: 0
        }
      },
      {
        $group: {
          _id: {
            client: "$employees.employeeCompany.client"
          },
          campaigns: { $addToSet: "$employees.employeeCompany.campaign" },
          employeesAmount: { $sum: 1 },
          totalPayed: { $sum: "$employees.netWage" },
          totalWeeklyWages: { $sum: "$employees.wage" },
          totalTaxes: { $sum: "$employees.incomeTax" },
          totalRegularHours: { $sum: "$employees.totalRegularHoursPay.hours" },
          totalRegularHoursPay: {
            $sum: "$employees.totalRegularHoursPay.totalPayed"
          },
          totalOvertimeHours: {
            $sum: "$employees.totalOvertimeHoursPay.hours"
          },
          totalOvertimeHoursPay: {
            $sum: "$employees.totalOvertimeHoursPay.totalPayed"
          },
          totalHolidayHoursX2: {
            $sum: "$employees.totalHolidayHoursPayX2.hours"
          },
          totalHolidayHoursX2Pay: {
            $sum: "$employees.totalHolidayHoursPayX2.totalPayed"
          },
          totalHolidayHoursX1: {
            $sum: "$employees.totalHolidayHoursPayX1.hours"
          },
          totalHolidayHoursX1Pay: {
            $sum: "$employees.totalHolidayHoursPayX1.totalPayed"
          },
          totalBonus: { $sum: "$employees.totalBonusPay" },
          totalOtherpay: { $sum: "$employees.totalOtherpay" },
          totalCompanyContributions: {
            $sum: "$employees.socialSecurityEmployer"
          },
          totalEmployeeContributions: {
            $sum: "$employees.socialSecurityEmployee"
          }
        }
      },
      { $sort: { "_id.client": 1, "_id.campaign": 1 } }
    ])
      .allowDiskUse(true)
      .exec((err, doc) => {
        if (err) res.status(500).json(err);
        Payroll.find({ _id: id })
          .lean()
          .exec((e, d) => {
            if (e) res.status(500).json(e);
            res.status(200).json({
              stats: doc,
              payroll: d
            });
          });
      });
  }
});


let assignCSL = (element) => {
  return new Promise((resolve, reject) => {
    const cloned = JSON.parse(JSON.stringify(element));
    const otherpays = cloned.otherpay;
    const mapped = otherpays.map(i => i._id)
    Otherpay.updateMany({_id: {$in: mapped}}, {$set: {assigned: true}}).exec((err, doc) => {
      if(err) reject();
      else resolve();
    })
  })
}
let assignMat = (element) => {
  return new Promise((resolve, reject) => {

  })
}
let assignVac = (element) => {
  return new Promise((resolve, reject) => {

  })
}
let assignFP = (element) => {
  return new Promise((resolve, reject) => {

  })
}

router.put("/:payrollId", (req, res) => {
  let { body } = req;
  let { payrollId } = req.params;
  let { conceptType } = req.query;
  switch (conceptType) {
    case "VAC":
      break;
    case "FP":
      break;
    default:
      assignCSL(body).then(res => {});
      break;
  }
  Payroll.update(
    { _id: payrollId, "employees.employee": body.employee },
    { "employees.$": body }
  ).exec((err, doc) => {
    res.status(200).json({
      answer: "OK",
      payroll: payrollId,
      body: body,
      type: conceptType,
      result: doc
    });
  });
});

router.get("/pay", (req, res) => {
  Payroll.aggregate([
    { $match: { isPayed: true } },
    { $sort: { fromDate: -1 } },
    { $limit: 24 },
    { $unwind: "$employees" },
    {
      $project: {
        socialTable: 0,
        incometaxTable: 0,
        deductionsTable: 0,
        otherpayTable: 0,
        exceptionsTable: 0,
        holidayTable: 0
      }
    },
    {
      $group: {
        _id: {
          payId: "$payId"
        },
        employees: { $addToSet: "$employees.employee" },
        fromDate: { $last: "$fromDate" },
        toDate: { $first: "$toDate" },
        payrolls: { $addToSet: "$_id" },
        payedDate: { $first: "$payedDate" },
        totalPayed: { $sum: "$employees.netWage" },
        totalWeeklyWages: { $sum: "$employees.wage" },
        totalTaxes: { $sum: "$employees.incomeTax" },
        totalRegularHours: { $sum: "$employees.totalRegularHoursPay.hours" },
        totalRegularHoursPay: {
          $sum: "$employees.totalRegularHoursPay.totalPayed"
        },
        totalOvertimeHours: { $sum: "$employees.totalOvertimeHoursPay.hours" },
        totalOvertimeHoursPay: {
          $sum: "$employees.totalOvertimeHoursPay.totalPayed"
        },
        totalHolidayHoursX2: {
          $sum: "$employees.totalHolidayHoursPayX2.hours"
        },
        totalHolidayHoursX2Pay: {
          $sum: "$employees.totalHolidayHoursPayX2.totalPayed"
        },
        totalHolidayHoursX1: {
          $sum: "$employees.totalHolidayHoursPayX1.hours"
        },
        totalHolidayHoursX1Pay: {
          $sum: "$employees.totalHolidayHoursPayX1.totalPayed"
        },
        totalBonus: { $sum: "$employees.totalBonusPay" },
        totalOtherpay: { $sum: "$employees.totalOtherpay" },
        totalDeductions: { $sum: "$employees.totalDeductions" },
        totalCompanyContributions: {
          $sum: "$employees.socialSecurityEmployer"
        },
        totalEmployeeContributions: {
          $sum: "$employees.socialSecurityEmployee"
        }
      }
    },
    {
      $addFields: {
        employeesAmount: { $size: "$employees" }
      }
    }
  ]).exec((err, doc) => {
    if (err) res.status(500).json(err);
    res.status(200).json(doc);
  });
});

router.post("/pay", (req, res) => {
  let item = req.body;
  const date = new Date();
  const payId = new mongoose.Types.ObjectId().toString();
  let mappedPayrollsId = item.payedPayrolls.map(i => i.payroll);
  Otherpay.updateMany(
    { payroll: { $in: mappedPayrollsId } },
    { $set: { payed: true } },
    (err, raw) => {}
  );
  Deduction.updateMany(
    { payroll: { $in: mappedPayrollsId } },
    { $set: { payed: true } },
    (err, raw) => {}
  );
  Payroll.updateMany(
    {
      $or: [
        { _id: item.payedPayrolls[0].payroll },
        { _id: item.payedPayrolls[1].payroll }
      ]
    },
    { $set: { isPayed: true, payedDate: date, payId: payId } },
    (error, doc) => {
      if (error) res.status(500).json(error);
      else {
        res.status(200).json({ message: "saved!" });
      }
    }
  );
});
// FIXME: IS SET TO RETURN DB OBJECT AND NOT CONSTRUCTED HTML
router.get("/payslips/:id", async (req, res) => {
  const { payId } = req.body;
  const { id } = req.params;
  Payroll.aggregate([
    { $match: { payId: payId } },
    { $unwind: "$employees" },
    { $match: { "employees.employee": id } },
    {
      $project: {
        socialTable: 0,
        incometaxTable: 0,
        deductionsTable: 0,
        otherpayTable: 0,
        exceptionsTable: 0,
        holidayTable: 0
      }
    },
    {
      $group: {
        _id: {
          payId: "$payId",
          employee: "$employees.employee"
        },
        employeeId: { $first: "$employees.employeeId" },
        employeeName: { $first: "$employees.employeeName" },
        socialSecurity: { $first: "$employees.socialSecurity" },
        hourlyRate: { $first: "$employees.hourlyRate" },
        payrollType: { $first: "$employees.payrollType" },
        emailAddress: { $first: "$employees.emailAddress" },
        employeeCompany: { $first: "$employees.employeeCompany" },
        employeePosition: { $first: "$employees.employeePosition" },
        employeePayroll: { $first: "$employees.employeePayroll" },
        basicWage: { $first: "$employees.wage" },
        grossWage: { $sum: "$employees.grossWage" },
        totalPayed: { $sum: "$employees.netWage" },
        totalWeeklyWages: { $sum: "$employees.wage" },
        totalTaxes: { $sum: "$employees.incomeTax" },
        totalRegularHours: { $sum: "$employees.totalRegularHoursPay.hours" },
        totalRegularHoursPay: {
          $sum: "$employees.totalRegularHoursPay.totalPayed"
        },
        totalOvertimeHours: { $sum: "$employees.totalOvertimeHoursPay.hours" },
        totalOvertimeHoursPay: {
          $sum: "$employees.totalOvertimeHoursPay.totalPayed"
        },
        totalHolidayHoursX2: {
          $sum: "$employees.totalHolidayHoursPayX2.hours"
        },
        totalHolidayHoursX2Pay: {
          $sum: "$employees.totalHolidayHoursPayX2.totalPayed"
        },
        totalHolidayHoursX1: {
          $sum: "$employees.totalHolidayHoursPayX1.hours"
        },
        totalHolidayHoursX1Pay: {
          $sum: "$employees.totalHolidayHoursPayX1.totalPayed"
        },
        totalBonus: { $sum: "$employees.totalBonusPay" },
        totalOtherpay: { $sum: "$employees.totalOtherpay" },
        totalDeductions: { $sum: "$employees.totalDeductions" },
        totalCompanyContributions: {
          $sum: "$employees.socialSecurityEmployer"
        },
        totalEmployeeContributions: {
          $sum: "$employees.socialSecurityEmployee"
        },
        allBonus: { $push: "$employees.bonus" },
        allOtherpay: { $push: "$employees.otherpay" },
        allDeductions: { $push: "$employees.deductions" }
      }
    },
    {
      $addFields: {
        allBonus: {
          $reduce: {
            input: "$allBonus",
            initialValue: [],
            in: { $concatArrays: ["$$value", "$$this"] }
          }
        },
        allOtherpay: {
          $reduce: {
            input: "$allOtherpay",
            initialValue: [],
            in: { $concatArrays: ["$$value", "$$this"] }
          }
        },
        allDeductions: {
          $reduce: {
            input: "$allDeductions",
            initialValue: [],
            in: { $concatArrays: ["$$value", "$$this"] }
          }
        }
      }
    }
  ]).exec((err, doc) => {
    if (err) res.status(500).json(err);
    var itemsProcessed = 0;
    let employeePayslip = doc[0];
    //const html = payslipTemplate({employeePayslip: employeePayslip})

    res.status(200).json(employeePayslip);
    //     itemsProcessed++
    //     const html = payslipTemplate({employeePayslip: item})
    //       const email =  sendEmail({
    //         recipient: 'sgomez@rccbpo.com',
    //         subject: 'test noreply email',
    //         html: html,
    //       })
    //        await email;
    //   if(itemsProcessed === doc.length) {
    //     res.status(200).json({message: 'all emails sent'})
    //   }
    // })
  });
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
        "employees.socialSecurityEmployer": 1,
        "employees.socialSecurityEmployee": 1,
        "employees.employeeCompany": 1,
        "employees.employeePosition": 1,
        "employees.employeePayroll": 1,
        "employees.deductions": 1,
        "employees.otherpay": 1,
        "employees.vacations": 1,
        "employees.maternity": 1,
        "employees.csl": 1,
        "employees.netWage": 1,
        "employees.incomeTax": 1,
        fromDate: 1,
        toDate: 1
      }
    },
    { $sort: { fromDate: -1 } },
    {
      $group: {
        _id: "employees.employee",
        payrolls: {
          $push: {
            employeeId: "$employees.employeeId",
            employeeName: "$employees.employeeName",
            campaign: "$employees.employeeCompany.campaign",
            client: "$employees.employeeCompany.client",
            positionId: "$employees.employeePosition.positionId",
            positionName: "$employees.employeePosition.name",
            employeePayroll: "$employees.employeePayroll",
            systemHours: "$employees.totalSystemHours",
            overtimeHours: "$employees.totalOvertimeHours",
            holidayHours: "$employees.totalHolidayHours",
            socialSecurityEmployer: "$employees.socialSecurityEmployer",
            socialSecurityEmployee: "$employees.socialSecurityEmployee",
            netWage: "$employees.netWage",
            incomeTax: "$employees.incomeTax",
            fromDate: "$fromDate",
            toDate: "$toDate"
          }
        },
        weeks: { $sum: 1 },
        totalYearlyWage: { $sum: "$employees.employeePosition.wage" },
        baseWageList: { $push: "$employees.employeePosition.wage" },
        totalPayed: { $sum: "$employees.netWage" },
        yearlyCSL: { $push: "$employees.csl" },
        yearlyMaternity: { $push: "$employees.maternity" },
        yearlyVacations: { $push: "$employees.vacations" },
        yearlyDeductions: { $push: "$employees.deductions" },
        totalCompanyContributions: {
          $sum: "$employees.socialSecurityEmployer"
        },
        totalEmployeeContributions: {
          $sum: "$employees.socialSecurityEmployee"
        },
        totalIncomeTax: { $sum: "$employees.incomeTax" }
      }
    },
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

router.get("/concepts/:type/:id", (req, res) => {
  const { type, id } = req.params;
  const { verified, payed, maternity, csl } = req.query;
  let query = {$or: [{
    assigned: false,
  },
  {
    assigned: { $exists: false },
  },
]};
  if (id !== "all") {
    query['$or'][0].employee = id;
    query['$or'][1].employee = id;
  }
  if (verified !== "undefined" && verified !== "null"){
    query['$or'][0].verified = verified === "true";
    query['$or'][1].verified = verified === "true";

  }
  if (payed !== "undefined" && payed !== "null") {
    query['$or'][0].payed = payed === "true";
    query['$or'][1].payed = payed === "true";

  }
  if (maternity !== "undefined" && maternity !== "null"){
    query['$or'][0].maternity = maternity === "true";
    query['$or'][1].maternity = maternity === "true";

  }
if (csl !== "undefined" && csl !== "null"){
  query['$or'][0].csl = csl === "true";
  query['$or'][1].csl = csl === "true";
}

  let deductions = () => {
    Deduction.find(query)
      .lean()
      .exec((err, doc) => {
        if (err) res.status(400).json(err);
        else {
          res.status(200).json(doc);
        }
      });
  };

  let otherpays = () => {
    Otherpay.find(query)
      .lean()
      .exec((err, doc) => {
        if (err) res.status(400).json(err);
        else {
          res.status(200).json(doc);
        }
      });
  };

  switch (type.toLowerCase().replace(/\s+/g, "")) {
    case "deduction":
      deductions();
      break;
    case "otherpayments":
      otherpays();
      break;

    default:
      res.status(400).json({
        error:
          type.toLowerCase().replace(/\s+/g, "") + " is not a valid concept"
      });
      break;
  }
});

router.post("/concepts/:type/:id", (req, res) => {
  const { id, type } = req.params;
  const concept = req.body;

  let deductions = () => {
    let find = {
      employee: concept.employee,
      reason: concept.reason,
      date: concept.date
    };
    Deduction.find(find, (err, doc) => {
      if (err) console.log(err);
      else if (doc.length > 0) {
        res.status(400).json({ error: "duplicate" });
      } else {
        Deduction.create(concept, (err, small) => {
          if (err) res.status(500).json(err);
          else res.status(200).json(concept);
        });
      }
    });
  };
  let otherpays = () => {
    let find = {
      employee: concept.employee,
      reason: concept.reason,
      date: concept.date
    };
    Otherpay.find(find, (err, doc) => {
      if (err) console.log(err);
      else if (doc.length > 0) {
        res.status(400).json({ error: "duplicate" });
      } else {
        Otherpay.create(concept, (err, small) => {
          if (err) res.status(500).json(err);
          else res.status(200).json(concept);
        });
      }
    });
  };
  switch (type.toLowerCase().replace(/\s+/g, "")) {
    case "deduction":
      deductions();
      break;
    case "otherpayments":
      otherpays();
      break;

    default:
      res.status(400).json({
        error:
          type.toLowerCase().replace(/\s+/g, "") + " is not a valid concept"
      });
      break;
  }
});

router.put("/concepts/:type", (req, res) => {
  const { type } = req.params;
  const { id, query } = req.body;
  let update = { _id: { $in: id } };
  const deductions = () => {
    Deduction.updateMany(update, { $set: query }, (err, small) => {
      if (err) res.status(400).json(err);
      else res.status(200).json(small);
    });
  };
  const otherpays = () => {
    Otherpay.updateMany(update, { $set: query }, (err, small) => {
      if (err) res.status(400).json(err);
      else res.status(200).json(small);
    });
  };
  switch (type.toLowerCase().replace(/\s+/g, "")) {
    case "deduction":
      deductions();
      break;
    case "otherpayments":
      otherpays();
      break;

    default:
      res.status(400).json({
        error:
          type.toLowerCase().replace(/\s+/g, "") + " is not a valid concept"
      });
      break;
  }
});

router.delete("/concepts/:type", (req, res) => {
  const { type } = req.params;
  const { id } = req.query;
  let toDelete = { _id: id };
  let deductions = () => {
    Deduction.deleteOne(toDelete, (err, small) => {
      if (err) res.status(400).json(err);
      else res.status(200).json(small);
    });
  };
  let otherpays = () => {
    Otherpay.deleteOne(toDelete, (err, small) => {
      if (err) res.status(400).json(err);
      else res.status(200).json(small);
    });
  };
  switch (type.toLowerCase().replace(/\s+/g, "")) {
    case "deduction":
      deductions();
      break;
    case "otherpayments":
      otherpays();
      break;

    default:
      res.status(400).json({
        error:
          type.toLowerCase().replace(/\s+/g, "") + " is not a valid concept"
      });
      break;
  }
});

router.post("/getOtherPayrollInfo", (req, res) => {
  let employeeIds;
  let from = req.body.from;
  let to = req.body.to;
  Promise.all([
    getHours(employeeIds, from, to),
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

var getActiveAndPayrolltypeEmployees = (payrollType, from, to) => {
  let type = payrollType.toUpperCase();
  return new Promise((resolve, reject) => {
    let employees = [];
    let cursor = Employee.find(
      {
        $or: [
          { status: "active", "payroll.payrollType": type },
          { onFinalPayment: true, "payroll.payrollType": type }
        ]
      },
      "_id employeeId firstName middleName lastName socialSecurity status personal.emailAddress company payroll position shift"
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

var getDeductions = (employee, fromDate, toDate) => {
  // let mappedEmployees = employees.map(employee => employee.employee);
  return new Promise((resolve, reject) => {
    Deduction.find({
      date: {
        $gte: fromDate,
        $lte: toDate
      },
      payed: false,
      verified: true,
      payroll: { $exists: false }
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
      },
      payed: false,
      verified: true,
      payroll: { $exists: false }
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
      },
      payed: false,
      verified: true,
      maternity: false,
      payroll: { $exists: false }
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
