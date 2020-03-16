let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
const { parse } = require('json2csv');
let OperationHours = require("../../../models/app/operations/operations-hour");
let OperationsKpi = require("../../../models/app/operations/operations-kpi");
let EmployeeShifts = require("../../../models/app/employee/employee-shift");
let Employees = require("../../../models/app/employee/employee-main");
let Shifts = EmployeeShifts.shift;
let moment = require("moment");
router.post("/hour", (req, res, next) => {
  let query = req.body;
  for (let propName in query) {
    if (
      query[propName] === null ||
      query[propName] === undefined ||
      query[propName] === ""
    ) {
      delete query[propName];
    }
  }
  if (
    query.date.$gte === "" ||
    query.date.$gte === undefined ||
    query.date.$gte === null
  ) {
    delete query.date;
  }
  let AllHours = [];
  const cursor = OperationHours.find(query)
    .sort({ date: -1, client: 1, campaign: 1, employeeName: 1 })
    .lean()
    .cursor();
  cursor.on("data", item => AllHours.push(item));
  cursor.on("end", () => {
    if (!AllHours) {
      res.status(404);
    } else {
      res.status(200).json(AllHours);
    }
  });
});

router.post("/kpi", (req, res) => {
  let query = req.body;
  let AllKpis = [];
  for (let propName in query) {
    if (
      query[propName] === null ||
      query[propName] === undefined ||
      query[propName] === ""
    ) {
      delete query[propName];
    }
  }
  if (
    query.date.$gte === "" ||
    query.date.$gte === undefined ||
    query.date.$gte === null
  ) {
    delete query.date;
  }
  const cursor = OperationsKpi.find(query)
    .lean()
    .cursor();
  cursor.on("data", kpi => AllKpis.push(kpi));
  cursor.on("end", () => {
    if (!AllKpis) {
      res.status(404);
    } else {
      res.status(200).json(AllKpis);
    }
  });
});

router.get("/hourTemplate", function(req, res, next) {
  var fields = [
    "employeeId",
    "dialerId",
    "date",
    "systemHours",
    "breakHours",
    "lunchHours",
    "trainingHours",
    "tosHours",
    "timeIn"
  ];

  var csv = parse('', {fields});

  res.set(
    "Content-Disposition",
    "attachment;filename=employee-hours-upload.csv"
  );
  res.set("Content-Type", "application/octet-stream");

  res.send(csv);
});

router.get("/kpiTemplate", function(req, res, next) {
  var fields = [
    "employeeId",
    "teamId",
    "kpiName",
    "date",
    "score",
    "scoreInTime"
  ];

  var csv = parse('', {fields});

  res.set("Content-Disposition", "attachment;filename=employee-kpi-upload.csv");
  res.set("Content-Type", "application/octet-stream");

  res.send(csv);
});

router.get("/attendance", (req, res) => {
  const { date, startTime, endTime, client, campaign } = req.query;
  const query = {
    $or: [
      {
        onShift:true,
        hasShift: true,
        date: date,
        client: client,
        campaign: campaign,
        shiftStartTime: { $gte: startTime, $lte: endTime }
      },
      {
        onShift:true,
        hasShift: true,
        date: date,
        client: client,
        campaign: campaign,
        shiftEndTime: { $gte: startTime, $lte: endTime }
      },
      {
        onShift:true,
        hasShift: true,
        date: date,
        client: client,
        campaign: campaign,
        shiftStartTime: { $lte: startTime },
        shiftEndTime: { $gte: endTime }
      }
    ]
  };
if(client === 'undefined'){
 query.$or.forEach(i => {
   delete i.client
   delete i.campaign
  });
}else if(campaign === '*' || campaign === ''){
  query.$or.forEach(i => {
   delete i.campaign
  });
}
console.log(query);
  OperationHours.find(query).lean().exec((err, doc) => {
    if(err) res.status(400).json(err);
    if(doc) res.status(200).json(doc);
    else res.status(400).json({message: 'Woops! Something is wrong'});
  })
});


router.get('/matrix', (req, res) => {
  //ADD POSITIONS
let {client, campaign, from, to, positions} = req.query;
let countByInterval = matrixQueryBuilder(30);
OperationHours.aggregate([
  {
    $match: {
    onShift:true,
    hasShift: true,
    matrix: {$in: JSON.parse(positions)},
    date: {$gte: moment(from, 'MM/DD/YYYY').toDate(), $lte: moment(to, 'MM/DD/YYYY').toDate()},
    client: client,
    campaign: campaign,
    }
  },
  {$project: {
    date: 1,
    shiftStartTime: 1,
    shiftEndTime: 1,
  }},
  {
    $group: {
      _id: '$date',
      ...countByInterval
    }
  },
  {$sort: {_id: 1}},
]).allowDiskUse(true).exec((err, doc) => {
  if(err) res.status(400).json({error: err});
  else res.status(200).json(doc);
})
});


function matrixQueryBuilder(intervalInMinutes){
  let intervalObj = {};
  let start = 0
  const end = 1440;
  const loop = parseInt(end/intervalInMinutes, 10)
  for (let i = 0; i < loop; i++) {
    if(i*intervalInMinutes <= end) {
      let currEnd = start + parseInt(intervalInMinutes, 10);
      intervalObj[start + '-' + currEnd] =
         {
          $sum: {
            $switch: {
              branches: [
                {
                  case: {
                    $and:[{$gte: ['$shiftStartTime', start]}, {$lt: ['$shiftStartTime', currEnd]}]
                  },
                  then: 1
                },
                {
                  case: {
                    $and:[{$gt: ['$shiftEndTime', start]}, {$lte: ['$shiftEndTime', currEnd]}]                  },
                  then: 1
                },
                {
                  case: {
                    $and: [{$lt: ['$shiftStartTime', '$shiftEndTime']},{$lte: ['$shiftStartTime', start]}, {$gt: ['$shiftEndTime', currEnd]}]
                  },
                  then: 1
                },
                {
                  case: {
                    $and: [{$gt: ['$shiftStartTime', '$shiftEndTime']},{$gte: ['$shiftEndTime', start]}, {$gt: ['$shiftEndTime', currEnd]}]
                  },
                  then: 1
                },
                {
                  case: {
                    $and: [{$gt: ['$shiftStartTime', '$shiftEndTime']},{$lte: ['$shiftStartTime', start]}, {$lt: ['$shiftStartTime', currEnd]}]
                  },
                  then: 1
                },

              ],
              default: 0
            }
          }
        };

    start = start + parseInt(intervalInMinutes, 10);
    }else {
      break;
    }
  }
  return intervalObj;
}
function rangeToDates(start, end) {
  let dates = [];
    let currDate = moment(start,'MM/DD/YYYY').startOf('day');
    let lastDate = moment(end, 'MM/DD/YYYY').startOf('day');
        dates.push(moment(start,'MM/DD/YYYY').clone().toDate());
    while(currDate.add(1, 'days').diff(lastDate) < 0) {
        dates.push(currDate.clone().toDate());
    }
      dates.push(lastDate.clone().toDate());
    return dates;
}
module.exports = router;
