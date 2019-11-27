let express = require("express");
let router = express.Router();

let jwt = require("jsonwebtoken");
let fs = require("fs");
let mongoose = require("mongoose");

let Employee = require("../../../models/app/employee/employee-main");
let EmployeePosition = require("../../../models/app/employee/employee-position");
let EmployeeShift = require("../../../models/app/employee/employee-shift");

router.get("/populateTable", function(req, res, next) {
  var token = jwt.decode(req.query.token);
  let employees = [];
  let cursor = Employee.find(
    {},
    "_id employeeId firstName middleName lastName socialSecurity status company"
  )
    .lean()
    .sort({ status: 1, employeeId: -1 })
    .cursor();
  cursor.on("data", item => employees.push(item));
  cursor.on("end", () => {
    if (!employees) {
      res.status(404).json({ message: "Error in the query" });
    } else {
      res.status(200).json(employees);
    }
  });
});

router.get("/main", function(req, res) {
  Employee.findById(req.query.id)
    .limit(1)
    .exec((err, result) => {
      if (err) res.status(500);
      else res.status(200).json(result);
    });
});

router.put("/main", function(req, res, next) {
  let id = req.query.id;
  let newStatus = req.body.status.toLowerCase();

  Employee.findByIdAndUpdate(
    id,
    { $set: { status: newStatus } },
    { new: true },
    (err, result) => {
      if (!result) return next(new Error("Could not load Document"));
      else {
        if (err) {
          return res.status(500).json({
            title: "An error occurred",
            error: err
          });
        }
      }
      res.status(200).json(result);
    }
  );
});

router.put("/shift", function(req, res, next) {
  Employee.findById(req.query.id, function(err, result) {
    if (!result) {
      return next(new Error("could not load doc"));
    } else {
      //TODO: finish update for shifts
    }
  });
});

router.put("/company", function(req, res) {
  let companyInfo = req.body;
  let employee = req.body.employee;
  if (employee) {
    Employee.findByIdAndUpdate(
      companyInfo.employee,
      { $set: { company: companyInfo } },
      (err, result) => {
        if (err) res.status(500).json(err);
        else res.status(200).json(result);
      }
    );
  }
});
router.put("/position", function(req, res) {
  EmployeePosition.findById(req.query.id, function(err, result) {
    if (!result) return next(new Error("Could not load Document"));
    else {
      result.endDate = req.body.endDate;

      result.save(function(err, doc) {});
      if (err) {
        return res.status(500).json({
          title: "An error occurred",
          error: err
        });
      }
    }
    res.status(200).json(result);
  });
});
router.put("/personal", function(req, res, next) {
  let personalInfo = req.body;
  let employee = req.body.employee;
  if (employee) {
    Employee.findByIdAndUpdate(
      personalInfo.employee,
      { $set: { personal: personalInfo } },
      (err, result) => {
        if (err) res.status(500).json(err);
        else res.status(200).json(result);
      }
    );
  }
});
router.put("/family", function(req, res, next) {
  let familyInfo = req.body;
  let employee = req.body.employee;
  if (employee) {
    Employee.findByIdAndUpdate(
      familyInfo.employee,
      { $set: { family: familyInfo } },
      (err, result) => {
        if (err) res.status(500).json(err);
        else res.status(200).json(result);
      }
    );
  }
});
router.put("/education", function(req, res, next) {
  let educationInfo = req.body;
  let employee = req.body.employee;
  if (employee) {
    Employee.findByIdAndUpdate(
      educationInfo.employee,
      { $set: { education: educationInfo } },
      (err, result) => {
        if (err) res.status(500).json(err);
        else res.status(200).json(result);
      }
    );
  }
});
router.put("/payroll", (req, res) => {
  let payrollInfo = req.body;
  let employee = req.body.employee;
  Employee.findByIdAndUpdate(
    employee,
    { $set: { payroll: payrollInfo } },
    (err, doc) => {
      if (err) res.status(500).json(err);
      else res.status(200).json(doc);
    }
  );
});

//TODO: Update put function for Array type properties
// router.put('/comment', function(req, res, next) {
//   let payrollInfo = req.body;
//   let employee = req.body.employee
//   Employee.findByIdAndUpdate(employee, {$set: {payroll: payrollInfo}}, (err, doc) => {
//     if(err) res.status(500).json(err);
//     else res.status(200).json(doc);
//   });
// });
router.post("/main", function(req, res) {
  var employee = new Employee({
    _id: new mongoose.Types.ObjectId(),
    employeeId: this.generateId() + "",
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    gender: req.body.gender,
    socialSecurity: req.body.socialSecurity,
    status: req.body.status.toLowerCase()
  });

  employee.save(function(err, result) {
    if (err) {
      return res.status(500).json({
        title: "An error occurred",
        error: err
      });
    }
    return res.status(201).json(result);
  });
});

router.post("/shift", function(req, res) {
  let shift = req.body;
  shift.shift.shift.map(item => {
    item.scheduledHours = calculateTimeDifference(item.startTime, item.endTime);
    return item;
  });
  shift.shift.totalHours = JSON.parse(JSON.stringify(shift.shift.shift))
    .map(i => i.scheduledHours)
    .reduce((a, b) => a + b);
  shift.shift.daysonShift = shift.shift.shift.filter(
    item => item.onShift
  ).length;
  let startDate = shift.startDate;
  let updateOptions = shift.current && !shift.first;

  Employee.updateOne(
    { _id: new mongoose.Types.ObjectId(req.body.employee) },
    {
      $set: { currentShift: shift.shift },
      $push: { shift: { $each: [shift], $sort: { startDate: -1 } } }
    },
    (err, raw) => {
      if (err) res.status(400).json(err);
      else if (updateOptions) {
        Employee.findByIdAndUpdate(
          req.body.employee,
          {
            $set: { "shift.1.endDate": startDate }
          },
          { new: true },
          (err, raw) => {
            if (err) res.status(400).json(err);
            else {
              raw.currentShift = currentShift(raw.shift);
              raw.save().then(result => {
                res.status(200).json(shift);
              });
            }
          }
        );
      } else {
        res.status(200).json(shift);
      }
    }
  );
});

function currentShift(shifts) {
  let current;
  var sortedShifts = shifts.sort((a, b) => a.startDate < b.startDate);
  sortedShifts.forEach((i, index) => {
    if (i.startDate > new Date())
      current =
        sortedShifts[index === sortedShifts.length - 1 ? index : index + 1];
  });
  return current;
}

function calculateTimeDifference(startTime, endTime) {
  if (
    startTime === null &&
    startTime === undefined &&
    !startTime.includes(':')
  )return 0;
  if (startTime < endTime) return endTime - startTime;
  if (startTime > endTime) return 1440 - startTime + endTime;
  return 0;
}

function currentShift(shifts) {
  if (shifts.length === 0) return null;
  let current;
  var sortedShifts = shifts.sort((a, b) => a.startDate < b.startDate);
  sortedShifts.forEach((i, index) => {
    if (i.startDate > new Date())
      current =
        sortedShifts[index === sortedShifts.length - 1 ? index : index + 1];
  });
  return current;
}


router.post("/company", function(req, res) {
  let id = new mongoose.Types.ObjectId();
  let current = {
    _id: id,
    employeeId: req.body.employeeId,
    client: req.body.client,
    campaign: req.body.campaign,
    supervisor: req.body.supervisor,
    trainer: req.body.trainer,
    trainingGroupRef: req.body.trainingGroupRef,
    trainingGroupNum: req.body.trainingGroupNum,
    hireDate: req.body.hireDate,
    terminationDate: req.body.terminationDate,
    reapplicant: req.body.reapplicant,
    reapplicantTimes: req.body.reapplicantTimes,
    employee: req.body.employee
  };
  Employee.findByIdAndUpdate(
    req.body.employee,
    { $set: { company: current } },
    (error, result) => {
      if (error) res.status(500).json(error);
      else res.status(200).json({});
    }
  );
});
router.post("/position", function(req, res) {
  if (req.body.employeeId) {
    let id = new mongoose.Types.ObjectId();
    let newPosition = new EmployeePosition({
      _id: id,
      employeeId: req.body.employeeId,
      client: req.body.client,
      department: req.body.department,
      position: req.body.position,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      employee: req.body.employee
    });
    newPosition.save(function(err, result) {
      if (err) {
        return res.status(500).json({
          title: "An error occurred",
          error: err
        });
      }
      Employee.update(
        { _id: newPosition.employee },
        { $push: { position: newPosition } },
        function(err) {}
      );
      result.populate(
        { path: "position", model: "Administration-Position" },
        function(err, pop) {
          return res.status(201).json(pop);
        }
      );
    });
  } else {
    return res
      .status(400)
      .message("sorry, the request was either empty or invalid");
  }
});

router.post("/personal", (req, res) => {
  let id = new mongoose.Types.ObjectId();
  let personal = {
    _id: id,
    employeeId: req.body.employeeId,
    maritalStatus: req.body.maritalStatus,
    address: req.body.address,
    town: req.body.town,
    district: req.body.district,
    birthPlaceDis: req.body.birthPlaceDis,
    birthPlaceTow: req.body.birthPlaceTow,
    addressDate: req.body.addressDate,
    celNumber: req.body.celNumber,
    telNumber: req.body.telNumber,
    birthDate: req.body.birthDate,
    emailAddress: req.body.emailAddress,
    emailDate: req.body.emailDate,
    hobbies: req.body.hobbies,
    employee: req.body.employee
  };
  Employee.findByIdAndUpdate(
    req.body.employee,
    { $set: { personal: personal } },
    (err, doc) => {
      if (err) res.status(500).json(err);
      else res.status(200).json({});
    }
  );
});

router.post("/family", (req, res) => {
  if (req.body.employeeId) {
    let id = new mongoose.Types.ObjectId();
    let newFamily = {
      _id: id,
      employeeId: req.body.employeeId,
      referenceName: req.body.referenceName,
      relationship: req.body.relationship,
      celNumber: req.body.celNumber,
      telNumber: req.body.telNumber,
      emailAddress: req.body.emailAddress,
      address: req.body.address,
      comment: req.body.comment,
      employee: req.body.employee
    };
    Employee.findByIdAndUpdate(
      newFamily.employee,
      { $push: { family: newFamily } },
      (err, doc) => {
        if (err) res.status(500).json(err);
        else res.status(200).json(newFamily);
      }
    );
  } else res.status(500);
});

router.post("/education", (req, res) => {
  if (req.body.employeeId) {
    let id = new mongoose.Types.ObjectId();
    let newEducation = {
      _id: id,
      employeeId: req.body.employeeId,
      institution: req.body.institution,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      employee: req.body.employee
    };
    Employee.findOneAndUpdate(
      newEducation.employee,
      { $push: { education: newEducation } },
      (err, doc) => {
        if (err) res.status(500).json(err);
        else res.status(200).json({});
      }
    );
  } else res.status(500);
});

router.post("/payroll", (req, res) => {
  let id = new mongoose.Types.ObjectId();
  var payroll = {
    _id: id,
    employeeId: req.body.employeeId,
    TIN: req.body.TIN,
    payrollType: req.body.payrollType,
    baseWage: req.body.baseWage,
    bankName: req.body.bankName,
    bankAccount: req.body.bankAccount,
    billable: req.body.billable,
    paymentType: req.body.paymentType,
    employee: req.body.employee
  };
  Employee.findByIdAndUpdate(
    req.body.employee,
    { $set: { payroll: payroll } },
    (err, employee) => {
      if (err) res.status(500).json(err);
      else res.status(200).json({});
    }
  );
});

router.post("/comment", (req, res) => {
  if (req.body.employeeId) {
    let id = new mongoose.Types.ObjectId();
    let newComment = {
      _id: id,
      employeeId: req.body.employeeId,
      reason: req.body.reason,
      comment: req.body.comment,
      commentDate: req.body.commentDate,
      submittedBy: req.body.submittedBy,
      employee: req.body.employee
    };
    Employee.findByIdAndUpdate(
      req.body.employee,
      { $push: { comments: newComment } },
      (err, doc) => {
        if (err) res.status(500).json(err);
        else res.status(200).json(newComment);
      }
    );
  } else res.status(500);
});

router.post("/attrition", function(req, res, next) {
  if (req.body.employeeId) {
    let id = new mongoose.Types.ObjectId();
    let newAttrition = {
      _id: id,
      employeeId: req.body.employeeId,
      reason1: req.body.reason1,
      reason2: req.body.reason2,
      comment: req.body.comment,
      commentDate: req.body.commentDate,
      submittedBy: req.body.submittedBy,
      employee: req.body.employee
    };
    Employee.findByIdAndUpdate(
      req.body.employee,
      { $push: { attrition: newAttrition } },
      (err, doc) => {
        if (err) res.status(500).json(err);
        else res.status(200).json(newAttrition);
      }
    );
  } else res.status(500);
});

router.get("/latestPosition", function(req, response) {
  let latest = EmployeePosition.latestPosition(req.query.id, function(
    err,
    res
  ) {
    if (err) {
      response.status(400).send(err);
      return;
    }
    response.status(200).json(res);
    return;
  });
});
router.get("/avatar", function(req, res, next) {
  var avatar = req.query.id + ".jpg";
  fs.readFile("uploads/avatars/" + avatar, function(err, content) {
    if (err) {
      res.sendStatus(200);
    } else {
      //specify the content type in the response will be an image
      res.writeHead(200, { "Content-type": "image/jpg" });
      res.end(content);
    }
  });
});
router.post("/new", function(req, res, next) {
  let newEmployeeId = null;
  Employee.findMax(function(err, doc) {
    if (err) {
      res.status(400);
    } else {
      newEmployeeId = req.body.employeeId
        ? req.body.employeeId
        : doc[0].employeeId + 1;
      let newEmployee = new Employee({
        _id: new mongoose.Types.ObjectId(),
        employeeId: newEmployeeId,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        socialSecurity: req.body.socialSecurity,
        gender: req.body.gender,
        status: req.body.status.toLowerCase()
      });
      newEmployee.save(function(err, result) {
        if (err) {
          return res.status(500).json({
            title: "An error occurred",
            error: err
          });
        } else {
          res.status(200).json(result);
        }
      });
    }
  });
});

router.delete("/position", (req, res) => {
  let id = req.query.id;
  let employee = req.query.employee;

  Employee.findByIdAndUpdate(
    employee,
    { $pull: { position: id } },
    { new: true },
    (err, doc) => {
      if (err) res.status(500).json(err);
      else {
        EmployeePosition.findOneAndDelete({ _id: id }, (er, re) => {
          if (er) res.status(500).json(er);
          else res.status(200).json(re);
        });
      }
    }
  );
});

router.delete("/shift", (req, res) => {
  let id = req.query.id;
  employee = req.query.employee;

  Employee.findByIdAndUpdate(
    employee,
    { $pull: { shift: { _id: id } } },
    { new: true },
    (err, doc) => {
      if (err) res.status(500).json(err);
      else res.status(200).json(doc);
    }
  );
});

router.get("/shift/updates", (req, res) => {
  const { employeeId, fromDate, toDate } = req.query;
  EmployeeShift.approvedShiftUpdates
  .find({
    employeeId: employeeId,
    effectiveDate: { $gte: fromDate, $lte: toDate }
  })
  .lean()
  .exec((err, doc) => {
    if(err) res.status(400).json(err);
    else res.status(200).json(doc);
  });
  
});

router.post("/shift/updates", (req, res) => {
    let update = req.body;
    EmployeeShift.approvedShiftUpdates.update({employeeId: update.employeeId, effectiveDate: update.effectiveDate}, { $set : update }, { upsert: true}, (err, doc) => {
      if(err) res.status(400).json(err);
      else {
        let {employeeId} = update;
        let [fromDate, toDate] = getWeekDates();
        EmployeeShift.approvedShiftUpdates.find({
          employeeId: employeeId,
          effectiveDate: { $gte: fromDate, $lte: toDate }
        })
        .lean()
        .exec((err, doc) => {
          if(err) res.status(400).json(err);
          else res.status(200).json(doc);
        });
      }
    })
});

function getWeekDates() {
  const now = new Date();
  const dayOfWeek = now.getDay(); //0-6
  const numDay = now.getDate();

  const start = new Date(now); //copy
  start.setDate(numDay - dayOfWeek);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now); //copy
  end.setDate(numDay + (7 - dayOfWeek));
  end.setHours(0, 0, 0, 0);

  return [start, end];
}

module.exports = router;
