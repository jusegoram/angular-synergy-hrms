const fs = require("fs");
let jwt = require("jsonwebtoken");
let moment = require("moment");
let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
let Employee = require("../../../models/app/employee/employee-main");
let Hours = require("../../../models/app/operations/operations-hour");
let PayrollSchemas = require("../../../models/app/payroll/payroll");
let Deduction = PayrollSchemas.deduction;
let Bonus = PayrollSchemas.bonus;
let Otherpay = PayrollSchemas.otherPay;
let Payroll = PayrollSchemas.payroll;
let sendEmail = require("../../../utils/sendEmail");
let payslipTemplate = require("../../../static/payslipTemplate");
let adminPayroll = require("../../../models/administration/administration-payroll");
let [
  GetEmployeesShiftAndConcepts, GetEmployeeHoursStats, GetPayedPayroll, GetPayedPayrolls, GetPayedPayrollsStats
] = require("../payroll/payrollStoreProc");



var getPayrolls = (type, finalizedBoolean) => {
  return new Promise((resolve, reject) => {
    let or;
    if (type === "")
      or = {
        $or: [{ payrollType: "BI-WEEKLY" }, { payrollType: "SEMIMONTHLY" }]
      };
    else {
      or = { $or: [{ payrollType: type }] };
    }
    Payroll.aggregate([
      { $match: { isFinalized: finalizedBoolean, ...or } },
      {
        $group: {
          _id: "$payroll_Id",
          fromDate: { $first: "$fromDate" },
          toDate: { $first: "$toDate" },
          employeesAmount: { $sum: 1 },
          isPayed: { $first: "$isPayed" },
          isFinalized: { $first: "$isFinalized" },
          payedDate: { $first: "$payedDate" },
          totalPayed: { $sum: "$netPayment" },
          totalTaxes: { $sum: "$incomeTax" },
          totalCompanyContributions: { $sum: "$ssEmployerContribution" },
          totalEmployeeContributions: { $sum: "$ssEmployeeContribution" }
        }
      },
      { $sort: { fromDate: -1 } },
      { $limit: 53 }
    ])
      .allowDiskUse(true)
      .exec((err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
  });
};
var getPayrollDetail = id => {
  return new Promise((resolve, reject) => {
    Payroll.aggregate([
      { $match: { payroll_Id: mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: {
            client: "$employeeCompany.client"
          },
          campaigns: { $addToSet: "$employeeCompany.campaign" },
          employeesAmount: { $sum: 1 },
          totalPayed: { $sum: "$netPayment" },
          totalMonthlyWages: { $sum: "$positionBaseWage" },
          totalTaxes: { $sum: "$incomeTax" },
          totalRegularHours: { $sum: "$totalSystemRegularPay.hours" },
          totalRegularHoursPay: { $sum: "$totalSystemRegularPay.totalPayed" },
          totalOvertimeHours: {
            $sum: "$totalOvertimePay.hours"
          },
          totalOvertimeHoursPay: {
            $sum: "$totalOvertimePay.totalPayed"
          },
          totalHolidayHoursX2: {
            $sum: "$totalSystemHolidayX2Pay.hours"
          },
          totalHolidayHoursX2Pay: {
            $sum: "$totalSystemHolidayX2Pay.totalPayed"
          },
          totalHolidayHoursX1: {
            $sum: "$totalSystemHolidayX1Pay.hours"
          },
          totalHolidayHoursX1Pay: {
            $sum: "$totalSystemHolidayX1Pay.totalPayed"
          },
          totalBonus: { $sum: "$totalBonus" },
          totalOtherpay: { $sum: "$totalOtherPays" },
          totalCompanyContributions: {
            $sum: "$ssEmployerContribution"
          },
          totalEmployeeContributions: {
            $sum: "$ssEmployeeContribution"
          }
        }
      },
      {
        $addFields: {
          totalPayed: { $toDouble: "$totalPayed" },
          totalRegularHoursPay: { $toDouble: "$totalRegularHoursPay" },
          totalOvertimeHoursPay: { $toDouble: "$totalOvertimeHoursPay" },
          totalHolidayHoursX2Pay: { $toDouble: "$totalHolidayHoursX2Pay" },
          totalHolidayHoursX1Pay: { $toDouble: "$totalHolidayHoursX1Pay" },
          totalBonus: { $toDouble: "$totalBonus" },
          totalOtherpay: { $toDouble: "$totalOtherpay" },
          totalCompanyContributions: {
            $toDouble: "$totalCompanyContributions"
          },
          totalEmployeeContributions: {
            $toDouble: "$totalEmployeeContributions"
          },
          totalTaxes: { $toDouble: "$totalTaxes" },

          totalWeeklyWages: {
            $divide: [{ $multiply: [{ $sum: "$totalMonthlyWages" }, 12] }, 52]
          }
        }
      },
      { $sort: { "_id.client": 1 } }
    ]).exec((err, doc) => {
      if (err) console.log(err);
      if (doc) {
        Payroll.find({ payroll_Id: id })
          .lean()
          .exec((e, d) => {
            resolve({
              stats: doc,
              payroll: d
            });
          });
      }
    });
  });
};
var getPayedRuns = () => {
  return new Promise((resolve, reject) => {
    Payroll.aggregate([
      ...GetPayedPayrolls()
       ])
         .allowDiskUse(true)
         .exec((err, doc) => {
           if (err) reject(err)
           else resolve(doc);
         });
  })
};
router.get("/new", (req, res) => {
  let type = req.query.payrollType + "";
  let from = req.query.from;
  let to = req.query.to;
  Employee.aggregate(GetEmployeesShiftAndConcepts(type, from, to, '', ''))
  .allowDiskUse()
    .exec((err, result) => {
      Employee.aggregate([...GetEmployeeHoursStats(type, from, to)], (e, r) => {
        if (e) res.status(400).json(e);
        else res.status(200).json({payroll:result, stats: r});
      });
    });
});

router.get("/", (req, res) => {
  const { id, type, finalized, payed} = req.query;
  let finalizedBoolean = finalized === "true" ? true : false;
  if (id === "all") {
    getPayrolls(type, finalizedBoolean)
      .then(doc => res.status(200).json(doc))
      .catch(err => res.status(400).json(err));
  } else if (payed === 'true') {
    getPayedRuns()
      .then(doc => res.status(200).json(doc))
      .catch(err => res.status(400).json(err));
  } else if (id !== "" && id !== 'undefinded' && id !== undefined){
    getPayrollDetail(id)
      .then(doc => res.status(200).json(doc))
      .catch(err => res.status(400).json(err));
  }
});
router.post("/", (req, res) => {
  const { payroll } = req.body;
  const from = payroll.fromDate,
    to = payroll.toDate;
  const conceptMatch = {
    date: {
      $gte: moment(from).toDate(),
      $lte: moment(to).toDate()
    },
    payed: false,
    verified: true,
    payroll: { $exists: false }
  };
  const hoursMatch = {
    date: {
      $gte: moment(from).toDate(),
      $lte: moment(to).toDate()
    },
    payed: false,
    payroll: { $exists: false }
  };

  Payroll.find({
    $or: [
      { $and: [{ fromDate: { $gte: from } }, { fromDate: { $lte: to } }] },
      { $and: [{ toDate: { $gte: from } }, { toDate: { $lte: to } }] },
      { $and: [{ fromDate: { $gte: from } }, { toDate: { $lte: to } }] },
      { $and: [{ fromDate: { $lte: from } }, { toDate: { $gte: to } }] }
    ]
  })
    .limit(10)
    .lean()
    .exec((err, doc) => {
      console.log(err);
      if (err)
        res
          .status(400)
          .json({ message: "Error while creating payroll", err: err });
      else {
        if (doc.length > 0) {
          res.status(400).json({
            message: "The payroll you are trying to create already exists.",
            err: doc
          });
        } else {
          let id = new mongoose.Types.ObjectId();
          const setPayrollId = {
            $set: {
              payroll: id,
              assigned: true,
            }
          };
          Employee.aggregate(
            [
              ...GetEmployeesShiftAndConcepts(
              payroll.type,
              moment(from).format('MM-DD-YYYY').toString(),
              moment(to).format('MM-DD-YYYY').toString(),
              id,
              payroll.createdBy),
              { $merge : { into : "payrolls" } }
            ]).exec((err, result) => {
              if (err)
                res
                  .status(400)
                  .json({ message: "Error while creating payroll", err: err });
              else {
                Deduction.updateMany(conceptMatch, setPayrollId, (e, d) =>
                  Bonus.updateMany(conceptMatch, setPayrollId, (e, d) =>
                    Otherpay.updateMany(conceptMatch, setPayrollId, (e, d) =>
                      Hours.updateMany(hoursMatch, setPayrollId, (e, d) =>
                        res
                          .status(200)
                          .json({
                            message: "Great!, the payroll got saved",
                          })
                      )
                    )
                  )
                );
              }
          })
        }
      }
    });
});
var getPayedPayrollDetails = (payment_Id) => {
  return new Promise((resolve, reject) => {
    Payroll.aggregate([
      ...GetPayedPayroll(payment_Id)
    ]).exec((err, doc) => {
      if(err) reject(err);
      else resolve(doc);
    })
  })
}
var getPayedPayrollStats = (payment_Id) => {
return new Promise((resolve, reject) => {
  Payroll.aggregate([
    ...GetPayedPayrollsStats(payment_Id)
  ]).exec((err, doc) => {
    if(err) reject(err);
      else resolve(doc);
  })
});
}
router.get('/:payment_Id/details', (req, res) => {
  let {payment_Id} = req.params;
   getPayedPayrollStats(payment_Id)
   .then(stats => {
     getPayedPayrollDetails(payment_Id)
     .then(details => {
       res.status(200).json({stats: stats, details: details})
     }).catch(e => res.status(200).json({stats: stats, details: e}));
   }).catch(e => res.status(400).json({message: 'error', err: e}));
});
let getSSAndTaxes = grossPayment => {
  if(grossPayment > 1213) grossPayment = 1213.30;
  return new Promise((resolve, reject) => {
    adminPayroll.SocialTable.aggregate([
      {
        $match: {
          $expr: {
            $or: [
              {
                $and: [
                  { $lte: ["$fromEarnings", grossPayment] },
                  { $gte: ["$toEarnings", grossPayment] }
                ]
              },
              {
                $and: [
                  { $lte: ["$fromEarnings", grossPayment] },
                  { $gte: [grossPayment, 460] },
                  { $eq: ["$toEarnings", 460] }
                ]
              }
            ]
          }
        },

      },
      {
        $lookup: {
          from: "payroll-incometaxtables",
          pipeline: [
            {
              $match: {
                  $expr:
                  {
                    $and:
                    [
                      { $lte: [ "$fromAmount",  grossPayment ] },
                      { $gte: [ {$sum: ["$toAmount", 0.09]}, grossPayment ] }
                    ]
                  }
                }
            },
          ],
          as: "incomeTax"
        },
      },
      { $project: {
        _id: 0 ,
        ssEmployeeContribution: '$employeeContribution',
        ssEmployerContribution: '$employerContribution',
        incomeTax: {$arrayElemAt: [ "$incomeTax.taxAmount", 0]},
      }}
    ]).exec((err, doc) => {
      if (err) reject(err);
      else {
        let [single] = doc
        if(grossPayment < 500) single.incomeTax = 0;
        resolve(single);
      }
    });
  });
};
let assignVac = (element, payrollRecordId) => {
  return new Promise((resolve, reject) => {
    if( element.verified === true){
      Otherpay.find({_id: element._id}, (error, concept) => {
        if (error) reject(error);
        else {

          Payroll.findOneAndUpdate({_id: payrollRecordId}, [
            {$set: { employeeOtherpays: { $concatArrays: [ "$employeeOtherpays", concept ] } } },
            {$set: { totalOtherPays: {$sum: '$employeeOtherpays.amount'}}},
            {$set: {
              grossBeforeCSLPayment: {
                $sum:
                [
                  '$totalSystemRegularPay.totalPayed', '$totalTrainingRegularPay.totalPayed', '$totalTosRegularPay.totalPayed',
                  '$totalSystemHolidayX1Pay.totalPayed', '$totalTrainingHolidayX1Pay.totalPayed' ,'$totalTosHolidayX1Pay.totalPayed',
                  '$totalSystemHolidayX2Pay.totalPayed', '$totalTrainingHolidayX2Pay.totalPayed', '$totalTosHolidayX2Pay.totalPayed',
                  '$totalOvertimePay.totalPayed',
                  '$totalOtherPays',
                ]
              },
              grossPayment: {
                $sum:
                [
                  '$totalSystemRegularPay.totalPayed', '$totalTrainingRegularPay.totalPayed', '$totalTosRegularPay.totalPayed',
                  '$totalSystemHolidayX1Pay.totalPayed', '$totalTrainingHolidayX1Pay.totalPayed' ,'$totalTosHolidayX1Pay.totalPayed',
                  '$totalSystemHolidayX2Pay.totalPayed', '$totalTrainingHolidayX2Pay.totalPayed', '$totalTosHolidayX2Pay.totalPayed',
                  '$totalOvertimePay.totalPayed',
                  '$totalOtherPays', '$totalMaternities', '$totalCSL'
                ]
              }
            }},
          ], { new: true }).exec((err, payroll) => {
                  let gross = parseFloat(payroll.grossBeforeCSLPayment.toJSON()['$numberDecimal']);
                 getSSAndTaxes(gross).then(tax => {
                  Payroll.updateOne({_id: payrollRecordId}, [
                    {$set: {
                      ssEmployeeContribution: {$convert: {input: tax.ssEmployeeContribution, to: 'decimal'}},
                      ssEmployerContribution: {$convert: {input: tax.ssEmployerContribution, to: 'decimal'}},
                      incomeTax: {$convert: {input: tax.incomeTax, to: 'decimal'}},
                    }},
                    {
                      $set: { netPayment: {$subtract: [{$subtract: [{$subtract: ['$grossPayment', '$ssEmployeeContribution']}, '$incomeTax']}, '$totalDeductions']}}
                    }
                  ]).exec((err, doc) => {
                    resolve(doc);
                  })
                 })
          })
      }});
    }else{
      Otherpay.create(element, (error, concept) => {
        if (error) reject(error);
        else {
          resolve(concept);
      }});
    }

  });
};
let assignFP = element => {
  return new Promise((resolve, reject) => {});
};
let finalizePayroll = (payrollId, user) => {
  return new Promise((resolve, reject) => {
    let query = {
      $set: {
        isFinalized: true,
        updatedAt: new Date(),
        updatedBy: user,
      }
    }
    Payroll.updateMany({payroll_Id: payrollId }, query).exec((err, doc) => {
      if(err) reject(err);
      else resolve(doc);
    });
  });
}
let payPayrolls = (ids, user) => {
  return new Promise((resolve, reject) => {
    const query = {
      $set: {
        payment_Id: new mongoose.Types.ObjectId(),
        paymentDate: new Date(),
        isPayed: true,
        payedBy: user,
      }
    }
    let parsedIds = JSON.parse(ids);
    let [id1, id2] = parsedIds;
    Otherpay.updateMany(
      { payroll: { $in: parsedIds } },
      { $set: { payed: true } },
      (err, raw) => {}
    );
    Bonus.updateMany(
      { payroll: { $in: parsedIds } },
      { $set: { payed: true } },
      (err, raw) => {}
    );
    Deduction.updateMany(
      { payroll: { $in: parsedIds } },
      { $set: { payed: true } },
      (err, raw) => {}
    );
    Payroll.updateMany({payroll_Id: {$in: [mongoose.Types.ObjectId(id1),mongoose.Types.ObjectId(id2)]}}, query).exec((err, doc) => {
      console.log(err);
      if(err) reject(err);
      else resolve(doc);
    });
  })
}

//TODO: need to finish final payment
router.put("/:payrollId", (req, res) => {
  let { body } = req;
  let {payrollId} = req.params
  let { payrollRecordId, conceptType } = req.query;
  switch (conceptType) {
    case "FIN":
      finalizePayroll(payrollId, body).then( result => {
        res.status(200).json(result)
      }).catch(e => res.status(400).json({message: 'error', err: e}));
    break;
    case "VAC":
      assignVac(body, payrollRecordId).then(result => {
       res.status(200).json(result);
      }).catch(err => res.status(400).json({message: 'error', err: err}));
      break;
      case "PAY":
      payPayrolls(payrollId, body).then( result => {
        res.status(200).json(result)
      }).catch(e => console.log(e));
      break;
    case "FP":
      res.status(400);
      break;
    default:
      res.status(400);
      break;
  }
});

//FIXME: update front end
router.post("/concepts", (req, res) => {
  let item = req.body;
  const date = new Date();
  const payId = new mongoose.Types.ObjectId().toString();
  let mappedPayrollsId = item.payedPayrolls.map(i => i.payroll);
  Otherpay.updateMany(
    { payroll: { $in: mappedPayrollsId } },
    { $set: { payed: true } },
    (err, raw) => {}
  );
  Bonus.updateMany(
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
    if (err) res.status(400).json(err);
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
    if (err) res.status(400).json(err);
    res.status(200).json(doc);
  });
});




var saveDeductions = (concept) => {
  return new Promise((resolve, reject) => {
    if(concept.length !== undefined && concept.length > 0) {
      let bulkCreate = [];
      for (let i = 0; i < concept.length; i++) {
        const element = concept[i];
        let find = {
          employee: element.employee,
          reason: element.reason,
          date: element.date
        };
        Deduction.find(find, (err, doc) => {
          if (err) reject(err);
            else if (doc.length > 0) {
              reject({ error: "duplicate" });
            }else {
              bulkCreate.push({insertOne: element})
            }
        })
      }
      Deduction.bulkWrite(bulkCreate, {ordered: false})
      .then(res => resolve({inserted: res.insertedCount}))
      .catch(e => reject(e));
    }else {
      let find = {
        employee: concept.employee,
        reason: concept.reason,
        date: concept.date
      };
      Deduction.find(find, (err, doc) => {
        if (err) reject(err);
        else if (doc.length > 0) {
          reject({ error: "duplicate" });
        } else {
          Deduction.create(concept, (err, small) => {
            if (err) reject(err);
            else resolve(concept);
          });
        }
      });
    }
  });
};
var saveOtherpayments = (concept) => {
  return new Promise((resolve, reject) => {
    if(concept.length !== undefined && concept.length > 0) {
      let bulkCreate = [];
      for (let i = 0; i < concept.length; i++) {
        const element = concept[i];
        let find = {
          employee: element.employee,
          reason: element.reason,
          date: element.date
        };
        Otherpay.find(find, (err, doc) => {
          if (err) reject(err);
            else if (doc.length > 0) {
              reject({ error: "duplicate" });
            }else {
              bulkCreate.push({insertOne: element})
            }
        })
      }
      Otherpay.bulkWrite(bulkCreate, {ordered: false})
      .then(res => resolve({inserted: res.insertedCount}))
      .catch(e => reject(e));
    }else {
      let find = {
        employee: concept.employee,
        reason: concept.reason,
        date: concept.date
      };
      Otherpay.find(find, (err, doc) => {
        if (err) reject(err);
        else if (doc.length > 0) {
          reject({ error: "duplicate" });
        } else {
          Otherpay.create(concept, (err, small) => {
            if (err) reject(err);
            else resolve(concept);
          });
        }
      });
    }
  });
};
var saveBonus = (concept) => {
  return new Promise((resolve, reject) => {
    if(concept.length !== undefined && concept.length > 0) {
      let bulkCreate = [];
      for (let i = 0; i < concept.length; i++) {
        const element = concept[i];
        let find = {
          employee: element.employee,
          reason: element.reason,
          date: element.date
        };
        Bonus.find(find, (err, doc) => {
          if (err) reject(err);
            else if (doc.length > 0) {
              reject({ error: "duplicate" });
            }else {
              bulkCreate.push({insertOne: element})
            }
        })
      }
      Bonus.bulkWrite(bulkCreate, {ordered: false})
      .then(res => resolve({inserted: res.insertedCount}))
      .catch(e => reject(e));
    }else {
      let find = {
        employee: concept.employee,
        reason: concept.reason,
        date: concept.date
      };
      Bonus.find(find, (err, doc) => {
        if (err) reject(err);
        else if (doc.length > 0) {
          reject({ error: "duplicate" });
        } else {
          Bonus.create(concept, (err, small) => {
            if (err) reject(err);
            else resolve(concept);
          });
        }
      });
    }
  });
};
var saveFinalPayment = (concept) => {
  return new Promise((resolve, reject) => {
    saveOtherpayments(concept).then(result => {
      if(concept.length !== undefined && concept.length > 0 ) {
        let bulkUpdate = [];
          for (let i = 0; i < concept.length; i++) {
          const element = concept[i];
            bulkCreate.push({updateOne: {
              filter: {_id: element.employee},
              update: { $set: {
                onFinalPayment: true,
              }}
            }})
          }
          Employee.bulkWrite(bulkUpdate, {ordered: false})
          .then(res => resolve({updated: res.modifiedCount}))
          .catch(e => reject(e));
      }else {
        Employee.updateOne({_id: concept.employee}, { $set: {
          onFinalPayment: true,
        }}).exec((err, doc) => {
          if(err) reject(err);
          else resolve(result);
        })
      }
    })
  });
}
router.get("/concepts/:type/:id", (req, res) => {
  const { type, id } = req.params;
  const {
    verified, payed, maternity,
    csl, notice, severance,
    compassionate, leaveWithoutPay,
    vacations, assigned, payroll} = req.query;

  let query = new Object();
  if(assigned === 'true') {
    query = {
      $or: [
        {
          assigned: assigned === 'true'
        },
        {
          assigned: assigned === 'true'
        }
      ]
    };
  }else {
    query = {
      $or: [
        {
          assigned: false
        },
        {
          assigned: { $exists: false }
        }
      ]
    };
  }

  if (id !== "all") {
    query["$or"][0].employee = id;
    query["$or"][1].employee = id;
  }
  if (verified !== undefined && verified !== "null") {
    query["$or"][0].verified = verified === "true";
    query["$or"][1].verified = verified === "true";
  }
  if (payed !== undefined && payed !== "null") {
    query["$or"][0].payed = payed === "true";
    query["$or"][1].payed = payed === "true";
  }
  if (maternity !== undefined && maternity !== "null") {
    query["$or"][0].maternity = maternity === "true";
    query["$or"][1].maternity = maternity === "true";
  }
  if (csl !== undefined && csl !== "null") {
    query["$or"][0].csl = csl === "true";
    query["$or"][1].csl = csl === "true";
  }
  if (notice !== undefined && notice !== "null") {
    query["$or"][0].notice = notice === "true";
    query["$or"][1].notice = notice === "true";
  }
  if (severance !== undefined && severance !== "null") {
    query["$or"][0].severance = severance === "true";
    query["$or"][1].severance = severance === "true";
  }

  if (compassionate !== undefined && compassionate !== "null") {
    query["$or"][0].compassionate = compassionate === "true";
    query["$or"][1].compassionate = compassionate === "true";
  }

  if (leaveWithoutPay !== undefined && leaveWithoutPay !== "null") {
    query["$or"][0].leaveWithoutPay = leaveWithoutPay === "true";
    query["$or"][1].leaveWithoutPay = leaveWithoutPay === "true";
  }

  if (vacations !== undefined && vacations !== "null") {
    query["$or"][0].vacations = vacations === "true";
    query["$or"][1].vacations = vacations === "true";
  }
  if (payroll !== undefined && payroll !== "null") {
    query["$or"][0].payroll = payroll;
    query["$or"][1].payroll = payroll;
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
  let bonus = () => {
    Bonus.find(query)
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
      case "taxablebonus":
        bonus();
      break;
      case "non-taxablebonus":
        bonus();
      break;
      case "finalpayments":
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
  switch (type.toLowerCase().replace(/\s+/g, "")) {
    case "deduction":
      saveDeductions(concept)
      .then(doc => res.status(200).json(doc))
      .catch(e => res.status(400).json({message: 'error', err: e}));
    break;
    case "otherpayments":
      saveOtherpayments(concept)
      .then(doc => res.status(200).json(doc))
      .catch(e => res.status(400).json({message: 'error', err: e}));
    break;
    case "taxablebonus":
      saveBonus(concept)
      .then(doc => res.status(200).json(doc))
      .catch(e => res.status(400).json({message: 'error', err: e}));
    break;
    case "non-taxablebonus":
      saveBonus(concept)
      .then(doc => res.status(200).json(doc))
      .catch(e => res.status(400).json({message: 'error', err: e}));
    break;
    case "finalpayments":
      saveFinalPayment(concept)
      .then(doc => res.status(200).json(doc))
      .catch(e => res.status(400).json({message: 'error', err: e}));
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
  const bonus = () => {
    Bonus.updateMany(update, { $set: query }, (err, small) => {
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
    case "taxablebonus":
      bonus();
    break;
    case "non-taxablebonus":
      bonus();
    break;
    case "finalpayments":
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
  let bonus = () => {
    Bonus.deleteOne(toDelete, (err, small) => {
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
    case "taxablebonus":
      bonus();
    break;
    case "non-taxablebonus":
      bonus();
    break;
    case "finalpayments":
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

// router.post("/getOtherPayrollInfo", (req, res) => {
//   let employeeIds;
//   let from = req.body.from;
//   let to = req.body.to;
//   Promise.all([
//     getHours(employeeIds, from, to),
//     getBonus(employeeIds, from, to),
//     getDeductions(employeeIds, from, to),
//     getOtherpay(employeeIds, from, to)
//   ])
//     .then(result => {
//       res.status(200).json(result);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// });

// router.get("/settings", (req, res) => {
//   let fromDate = decodeURIComponent(req.query.from);
//   let toDate = decodeURIComponent(req.query.to);
//   getPayrollSettings(fromDate, toDate).then(
//     result => {
//       res.status(200).json(result);
//     },
//     rejected => {
//       res.status(400).json(rejected);
//     }
//   );
// });

// var getActiveAndPayrolltypeEmployees = (payrollType, from, to) => {
//   let type = payrollType.toUpperCase();
//   return new Promise((resolve, reject) => {
//     let employees = [];
//     let cursor = Employee.find(
//       {
//         $or: [
//           { status: "active", "payroll.payrollType": type },
//           { onFinalPayment: true, "payroll.payrollType": type }
//         ]
//       },
//       "_id employeeId firstName middleName lastName socialSecurity status personal.emailAddress company payroll position shift"
//     )
//       .populate({
//         path: "Employee-Shift",
//         options: { sort: { startDate: -1 }, limit: 1 }
//       })
//       .sort({ _id: -1 })
//       .cursor();
//     cursor.on("data", item => {
//       employees.push(item);
//     });
//     cursor.on("error", err => {
//       console.log(err);
//       if (err) reject(err);
//     });
//     cursor.on("end", () => {
//       let mappedEmployees = employees.map(async employee => {
//         let hours;
//         let resEmployee = JSON.parse(JSON.stringify(employee));
//         delete resEmployee._id;
//         delete resEmployee.payroll;
//         delete resEmployee.company;
//         delete resEmployee.payroll;
//         delete resEmployee.position;
//         delete resEmployee.shift;
//         resEmployee.employeeName = `${employee.firstName} ${employee.middleName} ${employee.lastName}`;
//         resEmployee.employeeName + employee.middleName
//           ? employee.middleName + " " + employee.lastName
//           : employee.lastName;
//         resEmployee.employeePosition = employee.position[
//           employee.position.length - 1
//         ]
//           ? employee.position[employee.position.length - 1].position
//           : null;
//         resEmployee.employeeShift = employee.shift[0]
//           ? employee.shift[0].shift
//           : null;
//         resEmployee.employee = employee._id;
//         resEmployee.employeePayroll = employee.payroll;
//         resEmployee.payrollType = employee.payroll.payrollType;
//         resEmployee.employeeCompany = employee.company;
//         resEmployee.hourlyRate = calculateHourlyRate(
//           resEmployee.employeePosition
//             ? resEmployee.employeePosition.baseWage
//             : null
//         );
//         return resEmployee;
//       });
//       Promise.all(mappedEmployees).then(completed => {
//         resolve(completed);
//       });
//     });
//   });
// };

// var getDeductions = (employee, fromDate, toDate) => {
//   // let mappedEmployees = employees.map(employee => employee.employee);
//   return new Promise((resolve, reject) => {
//     Deduction.find({
//       date: {
//         $gte: fromDate,
//         $lte: toDate
//       },
//       payed: false,
//       verified: true,
//       payroll: { $exists: false }
//     })
//       .sort({ employee: -1 })
//       .lean()
//       .exec((err, res) => {
//         if (err) reject(err);
//         else resolve(res);
//       });
//   });
// };

// var getBonus = (employees, fromDate, toDate) => {
//   // let mappedEmployees = employees.map(employee => employee.employee);
//   return new Promise((resolve, reject) => {
//     Bonus.find({
//       date: {
//         $gte: fromDate,
//         $lte: toDate
//       },
//       payed: false,
//       verified: true,
//       payroll: { $exists: false }
//     })
//       .sort({ employee: -1 })
//       .lean()
//       .exec((err, res) => {
//         if (err) reject(err);
//         else resolve(res);
//       });
//   });
// };

// var getOtherpay = (employees, fromDate, toDate) => {
//   // let mappedEmployees = employees.map(employee => employee.employee);
//   return new Promise((resolve, reject) => {
//     Otherpay.find({
//       date: {
//         $gte: fromDate,
//         $lte: toDate
//       },
//       payed: false,
//       verified: true,
//       maternity: false,
//       payroll: { $exists: false }
//     })
//       .sort({ employee: -1 })
//       .lean()
//       .exec((err, res) => {
//         if (err) reject(err);
//         else resolve(res);
//       });
//   });
// };

// var getHours = (employees, fromDate, toDate) => {
//   // let mappedEmployees = employees.map(employee => employee.employee);
//   return new Promise((resolve, reject) => {
//     if (fromDate === undefined || toDate === undefined) {
//       reject("hours error");
//     }
//     Hours.find({
//       date: {
//         $gte: fromDate,
//         $lte: toDate
//       }
//     })
//       .sort({ employee: -1 })
//       .lean()
//       .exec((err, res) => {
//         if (err) reject(err);
//         else {
//           resolve(res);
//         }
//       });
//   });
// };

// var getSettingsTaskArray = (fromDate, toDate) => {
//   let tasks = [
//     "SocialTable",
//     "HolidayTable",
//     "ExceptionsTable",
//     "OtherPayTable",
//     "DeductionsTable",
//     "IncomeTaxTable"
//   ];
//   let promiseChain = tasks.map(task => {
//     if (task === "HolidayTable") {
//       return new Promise((resolve, reject) => {
//         adminPayroll[task]
//           .find({
//             date: {
//               $gte: fromDate,
//               $lte: toDate
//             }
//           })
//           .lean()
//           .exec((err, res) => {
//             if (err) reject(err);
//             else resolve(res);
//           });
//       });
//     } else {
//       return new Promise((resolve, reject) => {
//         adminPayroll[task]
//           .find()
//           .lean()
//           .exec((err, res) => {
//             if (err) reject(err);
//             else resolve(res);
//           });
//       });
//     }
//   });
//   return promiseChain;
// };
// var getPayrollSettings = (fromDate, toDate) => {
//   return new Promise((resolve, reject) => {
//     const tasks = getSettingsTaskArray(fromDate, toDate);
//     return tasks
//       .reduce((promiseChain, currentTask) => {
//         return promiseChain.then(chainResults =>
//           currentTask.then(currentResult => [...chainResults, currentResult])
//         );
//       }, Promise.resolve([]))
//       .then(arrayOfResults => {
//         resolve(arrayOfResults);
//       })
//       .catch(err => {
//         reject(err);
//       });
//   });
// };

// function calculateHourlyRate(employeeWage) {
//   if (employeeWage !== null) {
//     let wage = employeeWage;
//     hourlyRate = 0;
//     hourlyRate = (wage * 12) / 26 / 90;
//     return hourlyRate;
//   } else {
//     return 0;
//   }
// }

// function getVacationSalary(employeeVacation) {}

module.exports = router;
