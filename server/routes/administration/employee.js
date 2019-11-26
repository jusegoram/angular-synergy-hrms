var express = require("express");
var router = express.Router();
var Client = require("../../models/administration/administration-company");
var mongoose = require("mongoose");
var Shift = require("../../models/app/employee/employee-shift");
var Employee = require("../../models/app/employee/employee-main");
let EmployeePosition = require("../../models/app/employee/employee-position");


router.post("/client", function(req, res, next) {
  let campaigns = req.body.campaigns;
  for (let i = 0; i < campaigns.length; i++) {
    campaigns[i]._id = new mongoose.Types.ObjectId();
  }
  var client = new Client({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    campaigns: req.body.campaigns
  });
  client.save(function(err, result) {
    if (err) {
      return res.status(500).json({
        title: "An error occurred",
        error: err
      });
    }
    res.status(200).json(result);
  });
});

router.get("/client", function(req, res, next) {
  let clients = [];
  let cursor = Client.find()
    .lean()
    .cursor();
  cursor.on("data", item => clients.push(item));
  cursor.on("end", () => res.status(200).json(clients));
});

router.put("/client", function(req, res, next) {
  let campaigns = req.body.campaigns;
  for (let i = 0; i < campaigns.length; i++) {
    if (!campaigns[i]._id) {
      campaigns[i]._id = new mongoose.Types.ObjectId();
    }
  }
  Client.findById(req.query.id, function(err, doc) {
    doc.name = req.body.name;
    doc.campaigns = req.body.campaigns;
    doc.save();
    if (err) {
      return res.status(500).json({
        title: "An error occurred",
        error: err
      });
    }
    res.status(200).json(doc);
  });
});

router.post("/shift", function(req, res, next) {
  let shift = req.body;
  shift._id = new mongoose.Types.ObjectId();
  let newShift = new Shift.shift(shift);
  newShift.save((err, doc) => {
    if (err) res.status(500).json(err);
    else res.status(200).json(doc);
  });
});

router.get("/shift", function(req, res, next) {
  let shifts = [];
  const cursor = Shift.shift
    .find()
    .sort({name: 1})
    .lean()
    .cursor();
  cursor.on("data", item => shifts.push(item));
  cursor.on("end", () => {
    res.status(200).json(shifts);
  });
});

router.put("/shift", function(req, res, next) {
  let edit = req.body;
  Shift.shift.findById(req.query.id, function(err, doc) {
    doc.name = edit.name;
    doc.shift = edit.shift;
    doc.save();
    if (err) {
      return res.status(500).json({
        title: "An error occurred",
        error: err
      });
    }
    res.status(200).json(doc);
  });
});

router.delete("/shift", (req, res, next) => {
  Shift.shift.deleteOne(
    {
      _id: req.query._id
    },
    (err, doc) => {
      if (err) res.status(500).json(err);
      else res.status(200).json(doc);
    }
  );
});

router.get("/employee", function(req, res, next) {
  Employee.find({
    status: "active"
  })
    .select(
      "-personal -company -payroll -comments -education -family -position -shift"
    )
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({
          title: "An error occurred",
          error: err
        });
      }
      if (result === null) {
        return res.status(500).json({
          title: "Not found",
          message: "Employees are not active or not found"
        });
      }
      res.status(200).json(result);
    });
});

router.put("/update", (req, res) => {
  Employee.findByIdAndUpdate(
    {
      _id: req.query._id
    },
    {
      $set: {
        employeeId: req.body.employeeId,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        socialSecurity: req.body.socialSecurity
      }
    },
    {
      new: true
    },
    (err, doc) => {
      if (err) {
        return res.status(500).json({
          title: "An error occurred",
          error: err
        });
      }
      if (doc) res.status(200).json(doc);
    }
  );
});

router.delete("/delete", (req, res) => {
  let employeeId = req.query.employeeId + "";
  Shift.employeeShift.deleteMany({ employeeId: employeeId }, (err, resp) => {
      if (err) {
        res.status(500);
      } else {
        EmployeePosition.deleteMany({ employeeId: employeeId},(err, resp) => {
            if (err) {
              res.status(500);
            } else {
              Employee.deleteOne({_id: req.query._id},(err, resp) => {
                  if (err) {
                    res.status(500);
                  } else {
                    res.status(200).json({
                      res: resp
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

module.exports = router;
