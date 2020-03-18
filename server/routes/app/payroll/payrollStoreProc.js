let moment = require('moment');

var GetEmployeesShiftAndConcepts = (type, from, to, payroll_Id, createdBy) => [ {$match: {
  $or: [
    { status: "active", "payroll.payrollType": type },
    { onFinalPayment: true, "payroll.payrollType": type }
  ]
}}
, {
$project: {
  employee: '$_id',
  fromDate: moment(from, 'MM-DD-YYYY').toDate(),
  toDate: moment(to, 'MM-DD-YYYY').toDate(),
  employeeId:1,
  firstName:1,
  middleName:1,
  lastName:1,
  employeeName: {$concat:['$firstName',' ','$middleName',' ','$lastName']},
  socialSecurity:1,
  status:1,
  onFinalPayment: 1,
  email: '$personal.emailAddress',
  employeeCompany: '$company',
  employeePayroll: '$payroll',
  payrollType: '$payroll.payrollType',
  position: {$arrayElemAt: [ "$position", -1 ]},
  _id: 0
}
},
{
  $addFields: {
    payroll_Id: payroll_Id,
    createdBy: createdBy,
    isFinalized: false,
    isPayed: false,
    createdAt: new Date(),
  }
},
{
$lookup: {
  from: "employee-positions",
  let: {
    position_id: "$position"
  },
  pipeline: [
    {
      $match: {
        $expr: { $eq: ["$_id", "$$position_id"] }
      }
    },
    {
      $lookup: {
        from: "administration-positions",
        localField: "position",
        foreignField: "_id",
        as: "position"
      }
    },
    { $unwind: "$position" },
    { $sort: { startDate: 1 } }
  ],
  as: "employeePosition"
}
},
{
$lookup: {
  from: "operations-hours",
  let: {
    employee_employeeId: "$employeeId"
  },
  pipeline: [
    {
      $match: {
        $expr: {
          $eq: ["$employeeId", { $toString: "$$employee_employeeId" }]
        },
        date: {
          $gte: moment(from, 'MM-DD-YYYY').toDate(),
          $lte: moment(to, 'MM-DD-YYYY').toDate()
        },
        payed: false,
        payroll: { $exists: false },
        holiday: false
      }
    },
    { $sort: { date: 1 } },

  ],
  as: "employeeShiftRegular"
}
},
{
  $lookup: {
    from: "operations-hours",
    let: {
      employee_employeeId: "$employeeId"
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $eq: ["$employeeId", { $toString: "$$employee_employeeId" }]
          },
          date: {
            $gte: moment(from, 'MM-DD-YYYY').toDate(),
            $lte: moment(to, 'MM-DD-YYYY').toDate()
          },
          payed: false,
          payroll: { $exists: false },
          holiday: true,
          holidayRate: 1.5,
        }
      },
      { $sort: { date: 1 } }
    ],
    as: "employeeShiftHolidayX1"
  }
  },
  {
    $lookup: {
      from: "operations-hours",
      let: {
        employee_employeeId: "$_id"
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$employeeId", { $toString: "$$employee_employeeId" }]
            },
            date: {
              $gte: moment(from, 'MM-DD-YYYY').toDate(),
              $lte: moment(to, 'MM-DD-YYYY').toDate()
            },
            payed: false,
            payroll: { $exists: false },
            holiday: true,
            holidayRate: 2.0,
          }
        },
        { $sort: { date: 1 } }
      ],
      as: "employeeShiftHolidayX2"
    }
    },
{
$lookup: {
  from: "payroll-deductions",
  let: {
    employee_employeeId: "$employeeId"
  },
  pipeline: [
    {
      $match: {
        $expr: {
          $eq: ["$employeeId", { $toString: "$$employee_employeeId" }]
        },
        date: {
          $gte: moment(from, 'MM-DD-YYYY').toDate(),
          $lte: moment(to, 'MM-DD-YYYY').toDate()
        },
        payed: false,
        verified: true,
        payroll: { $exists: false }
      }
    },
    { $sort: { date: 1 } }
  ],
  as: "employeeDeductions"
}
},
{
$lookup: {
  from: "payroll-otherpays",
  let: {
    employee_employeeId: "$employeeId"
  },
  pipeline: [
    {
      $match: {
        $expr: {
          $eq: ["$employeeId", { $toString: "$$employee_employeeId" }]
        },
        date: {
          $gte: moment(from, 'MM-DD-YYYY').toDate(),
          $lte: moment(to, 'MM-DD-YYYY').toDate()
        },
        payed: false,
        verified: true,
        maternity: false,
        csl: false,
        notice: false,
        severance: false,
        // compassionate: false,
        leaveWithoutPay: false,
        payroll: { $exists: false }
      }
    },
    { $sort: { date: 1 } }
  ],
  as: "employeeOtherpays"
}
},
{
  $lookup: {
    from: "payroll-bonus",
    let: {
      employee_employeeId: "$employeeId"
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $eq: ["$employeeId", { $toString: "$$employee_employeeId" }]
          },
          date: {
            $gte: moment(from, 'MM-DD-YYYY').toDate(),
            $lte: moment(to, 'MM-DD-YYYY').toDate()
          },
          payed: false,
          verified: true,
          taxable: true,
          payroll: { $exists: false }
        }
      },
      { $sort: { date: 1 } }
    ],
    as: "employeeTaxableBonus"
  }
  },
  {
    $lookup: {
      from: "payroll-bonus",
      let: {
        employee_employeeId: "$employeeId"
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$employeeId", { $toString: "$$employee_employeeId" }]
            },
            date: {
              $gte: moment(from, 'MM-DD-YYYY').toDate(),
              $lte: moment(to, 'MM-DD-YYYY').toDate()
            },
            payed: false,
          verified: true,
          taxable: true,
          payroll: { $exists: false }
          }
        },
        { $sort: { date: 1 } }
      ],
      as: "employeeNonTaxableBonus"
    }
    },
    {
      $lookup: {
        from: "payroll-otherpays",
        let: {
          employee_employeeId: "$employeeId"
        },
        pipeline: [
          {
            $match: {
              $or: [
                {
                  $expr: {
                    $eq: ["$employeeId", { $toString: "$$employee_employeeId" }]
                  },
                  date: {
                    $gte: moment(from, 'MM-DD-YYYY').toDate(),
                    $lte: moment(to, 'MM-DD-YYYY').toDate()
                  },
                  payed: false,
                  verified: true,
                  notice: true,
                  severance: false,
                  payroll: { $exists: false }
                },
                {
                  $expr: {
                    $eq: ["$employeeId", { $toString: "$$employee_employeeId" }]
                  },
                  date: {
                    $gte: moment(from, 'MM-DD-YYYY').toDate(),
                    $lte: moment(to, 'MM-DD-YYYY').toDate()
                  },
                  payed: false,
                  verified: true,
                  notice: false,
                  severance: true,
                  payroll: { $exists: false }
                }
              ],
            }
          },
          { $sort: { date: 1 } }
        ],
        as: "employeeFinalPayments"
      }
      },

{
$lookup: {
  from: "payroll-otherpays",
  let: {
    employee_employeeId: "$employeeId"
  },
  pipeline: [
    {
      $match: {
        $expr: {
          $eq: ["$employeeId", { $toString: "$$employee_employeeId" }]
        },
        date: {
          $gte: moment(from, 'MM-DD-YYYY').toDate(),
          $lte: moment(to, 'MM-DD-YYYY').toDate()
        },
        payed: false,
        verified: true,
        maternity: true,
        csl: false,
        payroll: { $exists: false }
      }
    },
    { $sort: { date: 1 } }
  ],
  as: "employeeMaternities"
}
},
{
  $lookup: {
    from: "payroll-otherpays",
    let: {
      employee_employeeId: "$employeeId"
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $eq: ["$employeeId", { $toString: "$$employee_employeeId" }]
          },
          date: {
            $gte: moment(from, 'MM-DD-YYYY').toDate(),
            $lte: moment(to, 'MM-DD-YYYY').toDate()
          },
          payed: false,
          verified: true,
          maternity: false,
          csl: true,
          payroll: { $exists: false }
        }
      },
      { $sort: { date: 1 } }
    ],
    as: "employeeCSL"
  }
  },
{$unwind: '$employeePosition'},
{
  $addFields: {
    employeeSSN: '$socialSecurity',
    employeeStatus:'$status',
    employeeEmail: '$email',
    positionName: '$employeePosition.position.name',
    positionId: '$employeePosition.position.positionId',
    positionBaseWage: '$employeePosition.position.baseWage',
    positionHourlyRate:  {$toDecimal: {$cond:[{$arrayElemAt: [ "$employeeShiftRegular.hourlyRate", 0 ]}, {$arrayElemAt: [ "$employeeShiftRegular.hourlyRate", 0 ]}, 0]}},
    totalScheduledMinutes: {$sum: '$employeeShiftRegular.shiftScheduledHours'},
  }
},{
  $addFields: {
    totalSystemHoursRegular: {
      hh: {$sum: '$employeeShiftRegular.systemHours.hh'},
      mm: {$sum: '$employeeShiftRegular.systemHours.mm'},
      ss: {$sum: '$employeeShiftRegular.systemHours.ss'},
      value:{$sum: '$employeeShiftRegular.systemHours.valueInMinutes'},
      hourlyRate: {$toDecimal: '$positionHourlyRate'}
    },
    totalTrainingHoursRegular: {
      hh: {$sum: '$employeeShiftRegular.trainingHours.hh'},
      mm: {$sum: '$employeeShiftRegular.trainingHours.mm'},
      ss: {$sum: '$employeeShiftRegular.trainingHours.ss'},
      value:{$sum: '$employeeShiftRegular.trainingHours.valueInMinutes'},
      hourlyRate: {$toDecimal: {$multiply: ['$positionHourlyRate', 0]}}
    },
    totalTosHoursRegular: {
      hh: {$sum: '$employeeShiftRegular.tosHours.hh'},
      mm: {$sum: '$employeeShiftRegular.tosHours.mm'},
      ss: {$sum: '$employeeShiftRegular.tosHours.ss'},
      value:{$sum: '$employeeShiftRegular.tosHours.valueInMinutes'},
      hourlyRate: {$toDecimal: {$multiply: ['$positionHourlyRate', 1]}}
    },
    totalSystemHoursHolidayX1: {
      hh: {$sum: '$employeeShiftHolidayX1.systemHours.hh'},
      mm: {$sum: '$employeeShiftHolidayX1.systemHours.mm'},
      ss: {$sum: '$employeeShiftHolidayX1.systemHours.ss'},
      value:{$sum: '$employeeShiftHolidayX1.systemHours.valueInMinutes'},
      hourlyRate: {$toDecimal: {$multiply: ['$positionHourlyRate', 1.5]}}
    },
    totalTrainingHoursHolidayX1: {
      hh: {$sum: '$employeeShiftHolidayX1.trainingHours.hh'},
      mm: {$sum: '$employeeShiftHolidayX1.trainingHours.mm'},
      ss: {$sum: '$employeeShiftHolidayX1.trainingHours.ss'},
      value:{$sum: '$employeeShiftHolidayX1.trainingHours.valueInMinutes'},
      hourlyRate: {$toDecimal: {$multiply: ['$positionHourlyRate', 0]}}
    },
    totalTosHoursHolidayX1: {
      hh: {$sum: '$employeeShiftHolidayX1.tosHours.hh'},
      mm: {$sum: '$employeeShiftHolidayX1.tosHours.mm'},
      ss: {$sum: '$employeeShiftHolidayX1.tosHours.ss'},
      value:{$sum: '$employeeShiftHolidayX1.tosHours.valueInMinutes'},
      hourlyRate: {$toDecimal: {$multiply: ['$positionHourlyRate', 1.5]}}
    },
    totalSystemHoursHolidayX2: {
      hh: {$sum: '$employeeShiftHolidayX2.systemHours.hh'},
      mm: {$sum: '$employeeShiftHolidayX2.systemHours.mm'},
      ss: {$sum: '$employeeShiftHolidayX2.systemHours.ss'},
      value:{$sum: '$employeeShiftHolidayX2.systemHours.valueInMinutes'},
      hourlyRate: {$toDecimal: {$multiply: ['$positionHourlyRate', 2.0]}}

    },
    totalTrainingHoursHolidayX2: {
      hh: {$sum: '$employeeShiftHolidayX2.trainingHours.hh'},
      mm: {$sum: '$employeeShiftHolidayX2.trainingHours.mm'},
      ss: {$sum: '$employeeShiftHolidayX2.trainingHours.ss'},
      value:{$sum: '$employeeShiftHolidayX2.trainingHours.valueInMinutes'},
      hourlyRate: {$toDecimal: {$multiply: ['$positionHourlyRate', 0]}}
    },
    totalTosHoursHolidayX2: {
      hh: {$sum: '$employeeShiftHolidayX2.tosHours.hh'},
      mm: {$sum: '$employeeShiftHolidayX2.tosHours.mm'},
      ss: {$sum: '$employeeShiftHolidayX2.tosHours.ss'},
      value:{$sum: '$employeeShiftHolidayX2.tosHours.valueInMinutes'},
      hourlyRate: {$toDecimal: {$multiply: ['$positionHourlyRate', 2.0]}}
    },
    totalTaxableBonus: {$toDecimal: {$sum: '$employeeTaxableBonus.amount'}},
    totalNonTaxableBonus: {$toDecimal: {$sum: '$employeeNonTaxableBonus.amount'}},
    totalDeductions: {$toDecimal: {$sum: '$employeeDeductions.amount'}},
    totalOtherPays: {$toDecimal: {$sum: '$employeeOtherpays.amount'}},
    totalMaternities: {$toDecimal: {$sum: '$employeeMaternities.amount'}},
    totalFinalPayments: {$toDecimal: {$sum: '$employeeFinalPayments.amount'}},
    totalCSL: {$toDecimal: {$sum: '$employeeCSL.amount'}},
  }
},
{
  $addFields: {
    totalOvertime: {
      $cond: [
        {$gt: [{$divide: [{$subtract:[
          2700, {
            $sum: ['$totalSystemHoursRegular.value',
            '$totalTosHoursRegular.value']
          }]},
          -60
        ]}, 0]},
        {$divide: [{$subtract:[
          2700, {
            $sum: ['$totalSystemHoursRegular.value',
            '$totalTosHoursRegular.value']
          }
          ]},
          -60
        ]},
        {$multiply:[0, 0]}
      ]
    }
  }
},
{
  $addFields: {
    totalOvertimePay: {
      hours: '$totalOvertime',
      rate:  {$toDecimal:{$multiply: ['$totalSystemHoursRegular.hourlyRate', 0.5]}},
      totalPayed: {$toDecimal: { $multiply: ['$totalOvertime', {$multiply: ['$totalSystemHoursRegular.hourlyRate', 0.5]}]}}
    },
    totalSystemRegularPay: {
      hours: {$divide: ['$totalSystemHoursRegular.value', 60]},
      rate:  {$toDecimal: '$totalSystemHoursRegular.hourlyRate'},
      totalPayed: {$toDecimal: { $multiply: [{$divide: ['$totalSystemHoursRegular.value', 60]}, '$totalSystemHoursRegular.hourlyRate'] }}
    },
    totalTrainingRegularPay: {
      hours: {$divide: ['$totalTrainingHoursRegular.value', 60]},
      rate:  {$toDecimal:{$multiply: ['$totalSystemHoursRegular.hourlyRate', 0]}},
      totalPayed: {$toDecimal: { $multiply: [{$divide: ['$totalTrainingHoursRegular.value', 60]}, 0] }}
    },
    totalTosRegularPay: {
      hours: {$divide: ['$totalTosHoursRegular.value', 60]},
      rate:  {$toDecimal:'$totalTosHoursRegular.hourlyRate'},
      totalPayed: {$toDecimal: { $multiply: [{$divide: ['$totalTosHoursRegular.value', 60]}, '$totalTosHoursRegular.hourlyRate'] }}
    },
    totalSystemHolidayX1Pay: {
      hours: {$divide: ['$totalSystemHoursHolidayX1.value', 60]},
      rate:  {$toDecimal:'$totalSystemHoursHolidayX1.hourlyRate'},
      totalPayed: {$toDecimal: { $multiply: [{$divide: ['$totalSystemHoursHolidayX1.value', 60]}, '$totalSystemHoursHolidayX1.hourlyRate'] }}
    },
    totalTrainingHolidayX1Pay: {
      hours: {$divide: ['$totalTrainingHoursHolidayX1.value', 60]},
      rate:  {$toDecimal:{$multiply: ['$totalSystemHoursRegular.hourlyRate', 0]}},
      totalPayed: {$toDecimal: { $multiply: [{$divide: ['$totalTrainingHoursHolidayX1.value', 60]}, 0] }}
    },
    totalTosHolidayX1Pay: {
      hours: {$divide: ['$totalTosHoursHolidayX1.value', 60]},
      rate:  {$toDecimal:'$totalTosHoursHolidayX1.hourlyRate'},
      totalPayed: {$toDecimal: { $multiply: [{$divide: ['$totalTosHoursHolidayX1.value', 60]}, '$totalSystemHoursHolidayX1.hourlyRate'] }}
    },
    totalSystemHolidayX2Pay: {
      hours: {$divide: ['$totalSystemHoursHolidayX2.value', 60]},
      rate:  {$toDecimal:'$totalSystemHoursHolidayX2.hourlyRate'},
      totalPayed: {$toDecimal: { $multiply: [{$divide: ['$totalSystemHoursHolidayX2.value', 60]}, '$totalSystemHoursHolidayX2.hourlyRate'] }}
    },
    totalTrainingHolidayX2Pay: {
      hours: {$divide: ['$totalTrainingHoursHolidayX2.value', 60]},
      rate:  {$toDecimal:'$totalTrainingHoursHolidayX2.hourlyRate'},
      totalPayed: {$toDecimal: { $multiply: [{$divide: ['$totalTrainingHoursHolidayX2.value', 60]}, 0] }}
    },
    totalTosHolidayX2Pay: {
      hours: {$divide: ['$totalTosHoursHolidayX2.value', 60]},
      rate:  {$toDecimal:'$totalTosHoursHolidayX2.hourlyRate'},
      totalPayed: {$toDecimal: { $multiply: [{$divide: ['$totalTosHoursHolidayX2.value', 60]}, '$totalSystemHoursHolidayX2.hourlyRate'] }}
    }
  }
},{
  $addFields: {
    grossBeforeCSLPayment: {$toDecimal: {
      $sum:
      [
        '$totalSystemRegularPay.totalPayed', '$totalTrainingRegularPay.totalPayed', '$totalTosRegularPay.totalPayed',
        '$totalSystemHolidayX1Pay.totalPayed', '$totalTrainingHolidayX1Pay.totalPayed' ,'$totalTosHolidayX1Pay.totalPayed',
        '$totalSystemHolidayX2Pay.totalPayed', '$totalTrainingHolidayX2Pay.totalPayed', '$totalTosHolidayX2Pay.totalPayed',
        '$totalOvertimePay.totalPayed',
        '$totalOtherPays',
        '$totalTaxableBonus'
      ]
    }},
    grossPayment: {$toDecimal: {
      $sum:
      [
        '$totalSystemRegularPay.totalPayed', '$totalTrainingRegularPay.totalPayed', '$totalTosRegularPay.totalPayed',
        '$totalSystemHolidayX1Pay.totalPayed', '$totalTrainingHolidayX1Pay.totalPayed' ,'$totalTosHolidayX1Pay.totalPayed',
        '$totalSystemHolidayX2Pay.totalPayed', '$totalTrainingHolidayX2Pay.totalPayed', '$totalTosHolidayX2Pay.totalPayed',
        '$totalOvertimePay.totalPayed',
        '$totalOtherPays',
        '$totalTaxableBonus',
        '$totalMaternities', '$totalCSL', '$totalFinalPayments'
      ]
    }},
  }
},
{
  $lookup: {
    from: "payroll-socialtables",
    let: {
      gross: "$grossBeforeCSLPayment"
    },
    pipeline: [
      {
        $match: {
            $expr:
            {
              $or: [
                {
                  $and:
                  [
                    { $lte: [ "$fromEarnings",  "$$gross" ] },
                    { $gte: [ "$toEarnings", "$$gross" ] }
                  ]
                },
                {
                  $and:
                  [
                    { $lte: [ "$fromEarnings",  "$$gross" ] },
                    { $gte: [ "$$gross", 460] },
                    { $eq: [ '$toEarnings', 460]}
                  ]
                }
              ]

            }

          }
      },
    ],
    as: "socialContribution"
  },
},
{
  $lookup: {
    from: "payroll-incometaxtables",
    let: {
      gross: "$grossBeforeCSLPayment"
    },
    pipeline: [
      {
        $match: {
            $expr:
            {
              $and:
              [
                { $lte: [ "$fromAmount",  "$$gross" ] },
                { $gte: [ {$sum: ["$toAmount", 0.1]}, "$$gross" ] }
              ]
            }
          }
      },
    ],
    as: "incomeTax"
  },
},
{
  $addFields: {
    ssEmployeeContribution: {$toDecimal: {$cond:[{$arrayElemAt: [ "$socialContribution", 0 ]}, {$arrayElemAt: [ "$socialContribution.employeeContribution", 0 ]}, 0]}},
    ssEmployerContribution: {$toDecimal: {$cond:[{$arrayElemAt: [ "$socialContribution", 0 ]}, {$arrayElemAt: [ "$socialContribution.employerContribution", 0 ]}, 0]}} ,
    incomeTax:  {$toDecimal: {$cond: {if:{$eq: [{$size: '$incomeTax'}, 2]}, then: {$arrayElemAt: ['$incomeTax.taxAmount', 1]}, else: {$cond: {if: {$eq: [{$size: '$incomeTax'}, 1]},then: {$arrayElemAt: ['$incomeTax.taxAmount', 0]}, else: 0} }}}},
  }
},
{
  $addFields: {
    netPayment: {$toDecimal: {$subtract: [{$subtract: [{$subtract: ['$grossPayment', '$ssEmployeeContribution']}, '$incomeTax']}, '$totalDeductions']}}
  }
}
];
var GetEmployeeHoursStats = (type, from, to) => [ // Stage 1
      {
        $match: {
            $or: [
              { status: "active", "payroll.payrollType": type },
              { onFinalPayment: true, "payroll.payrollType": type}
            ]
        }
      },
      // Stage 2
      {
        $lookup: {
              from: "operations-hours",
              let: {
                employee_employeeId: "$employeeId"
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$employeeId", { $toString: "$$employee_employeeId" }]
                    },
                    date: {
                      $gte: moment(from, 'MM-DD-YYYY').toDate(),
                      $lte: moment(to, 'MM-DD-YYYY').toDate()
                    },
                    payed: false,
                    hasHours: true,
                    payroll: { $exists: false },
                  }
                },
                { $sort: { date: 1 } }
              ],
              as: "employeeShiftRegular"
        }
      },

      // Stage 3
      {
        $unwind: {
            path : "$employeeShiftRegular",
            preserveNullAndEmptyArrays : false
        }
      },

      // Stage 4
      {
        $group: {
          _id: {date: '$employeeShiftRegular.date', client: '$company.client'},
          value : {$sum: 1},
          date: {$first: '$employeeShiftRegular.date'}
        }
      },

      // Stage 5
      {
        $sort: {
        '_id.date':1, '_id.client':1
        }
      },

      // Stage 6
      {
        $group: {
          _id: '$_id.client',
          categories: {$push: '$_id.date'},
          seriesname: {$first: '$_id.client'},
          data: {$push: {value: '$value'}},
        }
      },
];
var GetPayedPayroll = (id) => [
  {
    $match: {
      payment_Id: id
    }
  },
  { $sort: { fromDate: -1 } },
  {
    $group: {
      _id: "$employee",
      payrolls: { $addToSet: "$payroll_Id"},
      employeeId: { $first: "$employeeId" },
      firstName: { $first: "$firstName" },
      middleName: { $first: "$middleName" },
      lastName: { $first: "$lastName" },
      employeeName: { $first: "$employeeName" },
      onFinalPayment: { $last: "$onFinalPayment" },
      employeeSSN: { $last: "$employeeSSN" },
      employeeStatus: { $last: "$employeeStatus" },
      employeeEmail: { $last: "$employeeEmail" },
      employeeCompany: { $last: "$employeeCompany" },
      employeePayroll: { $last: "$employeePayroll" },
      employeePosition: { $last: "$employeePosition" },
      employeeShiftRegular: { $push: "$employeeShiftRegular" },
      employeeShiftHolidayX1:{ $push: "$employeeShiftHolidayX1" },
      employeeShiftHolidayX2:{ $push: "$employeeShiftHolidayX2" },
      payrollType: { $last: "$payrollType" },
      positionName: { $last: "$positionName" },
      positionId: { $last: "$positionId" },
      positionBaseWage:{ $last: "$positionBaseWage" },
      positionHourlyRate:{ $last: "$positionHourlyRate" },
      employeeDeductions: { $push: "$employeeDeductions" },
      employeeOtherpays: { $push: "$employeeOtherpays" },
      employeeMaternities: { $push: "$employeeMaternities" },
      employeeBonus: { $push: "$employeeBonus" },
      totalScheduledMinutes:  {$sum: '$totalScheduledMinutes'},
      totalSystemHoursRegular: { $push: '$totalSystemHoursRegular'},
      totalTrainingHoursRegular:  { $push: '$totalTrainingHoursRegular'},
      totalTosHoursRegular:  { $push: '$totalTosHoursRegular'},
      totalSystemHoursHolidayX1:  { $push: '$totalSystemHoursHolidayX1'},
      totalTrainingHoursHolidayX1: { $push: '$totalTrainingHoursHolidayX1'},
      totalTosHoursHolidayX1: { $push: '$totalTosHoursHolidayX1'},
      totalSystemHoursHolidayX2: { $push: '$totalSystemHoursHolidayX2'},
      totalTrainingHoursHolidayX2: { $push: '$totalTrainingHoursHolidayX2'},
      totalTosHoursHolidayX2:  { $push: '$totalTosHoursHolidayX2'},
      totalDeductions: {$sum: '$totalDeductions'},
      totalOtherPays: {$sum: '$totalOtherPays'},
      totalMaternities: {$sum: '$totalMaternities'},
      totalCSL: {$sum: '$totalCSL'},
      totalOvertime: {$sum: '$totalOvertime'},
      totalOvertimePay: { $push: '$totalOvertimePay'},
      totalSystemRegularPay: { $push: '$totalSystemRegularPay'},
      totalTrainingRegularPay: { $push: '$totalTrainingRegularPay'},
      totalTosRegularPay: { $push: '$totalTosRegularPay'},
      totalSystemHolidayX1Pay: { $push: '$totalSystemHolidayX1Pay'},
      totalTrainingHolidayX1Pay: { $push: '$totalTrainingHolidayX1Pay'},
      totalTosHolidayX1Pay: { $push: '$totalTosHolidayX1Pay'},
      totalSystemHolidayX2Pay: { $push: '$totalSystemHolidayX2Pay'},
      totalTrainingHolidayX2Pay: { $push: '$totalTrainingHolidayX2Pay'},
      totalTosHolidayX2Pay: { $push: '$totalTosHolidayX2Pay'},
      grossBeforeCSLPayment: {$sum: '$grossBeforeCSLPayment'},
      grossPayment: {$sum: '$grossPayment'},
      ssEmployeeContribution: {$sum: '$ssEmployeeContribution'},
      ssEmployerContribution:  {$sum: '$ssEmployerContribution'},
      incomeTax:  {$sum: '$incomeTax'},
      netPayment: {$sum: '$netPayment'},
    }
  }
];
var GetPayedPayrolls = () => [
  { $match: { isPayed: true } },
  { $sort: { fromDate: -1 } },
  {$group: {
      _id: '$payment_Id',
      payrolls: {$addToSet: "$payroll_Id"},
      fromDate: { $last: "$fromDate" },
      toDate: { $first: "$toDate" },
      paymentDate: { $last: '$paymentDate'},
      employees: { $addToSet: "$employeeId" },
      totalPayed: { $sum: "$netPayment" },
      totalWages: { $sum: "$positionBaseWage" },
       totalTaxes: { $sum: "$incomeTax" },
      totalRegularHours: { $sum: "$totalSystemRegularPay.hours" },
      totalRegularHoursPay: {
        $sum: "$totalSystemRegularPay.totalPayed"
      },
      totalOvertimeHours: { $sum: "$totalOvertimePay.hours" },
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
      totalBonus: { $sum: "$totalTaxableBonus" },
      totalOtherpay: { $sum: "$totalOtherPays" },
      totalDeductions: { $sum: "$totalDeductions" },
      totalCompanyContributions: {
        $sum: "$ssEmployerContribution"
      },
      totalEmployeeContributions: {
        $sum: "$ssEmployeeContribution"
      }
      },

    },
    {
      $addFields: {
        employeesAmount: { $size: "$employees" }
      }
    }
]
var GetPayedPayrollsStats = (id) => [
  {
    $match: {
      payment_Id: id
    }
  },
  { $sort: { fromDate: -1 } },

]

module.exports = [GetEmployeesShiftAndConcepts, GetEmployeeHoursStats, GetPayedPayroll, GetPayedPayrolls, GetPayedPayrollsStats]