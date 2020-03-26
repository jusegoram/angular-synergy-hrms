const express = require("express");
const router = express.Router();
let mongoose = require("mongoose");
const HrTracker = require("../../../models/app/hr/hr-trackers");

// TODO: feat/hr-module
router.get("/", async (req, res) => {
  const hrTrackers = await HrTracker.find();
  try {
    return res.status(200).json(hrTrackers);
  } catch (error) {
    return res.status(500).json({ message: error.toString() });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const hrTracker = await HrTracker.findOne({ employeeId });
    return res.status(200).json(hrTracker);
  } catch (error) {
    return res.status(500).json({ message: error.toString() });
  }
});

router.post("/", async (req, res) => {
  const { employeeId, requestDate, state, tracker } = req.body;
  try {
    const employee = new mongoose.Types.ObjectId(req.body.employee);
    const creationFingerprint = new mongoose.Types.ObjectId(
      req.body.creationFingerprint
    );
    const hrTracker = new HrTracker({
      employeeId,
      employee,
      requestDate,
      state,
      tracker,
      creationFingerprint
    });

    if (!(await HrTracker.exists({ $or: [{ employeeId }, { employee }] }))) {
      let response = await hrTracker.save();
      return res.status(200).json(response || {});
    } else {
      console.log("Hr Tracker already exists!");
      throw new Error("Hr Tracker already exists!");
    }
  } catch (error) {
    return res.status(500).json({ message: error.toString() });
  }
});

router.put("/:id", async (req, res) => {
  const employeeId = req.params.id;
  try {
    let hrTracker = await HrTracker.findOne({ employeeId });
    if (!hrTracker) {
      throw new Error("Hr Tracker doesn't exists!");
    }
    const response = await hrTracker.update({
      ...req.body
    });
    return res.status(200).json(response || {});
  } catch (error) {
    return res.status(500).json({ message: error.toString() });
  }
});

router.delete("/:id", async (req, res) => {
  const employeeId = req.params.id;
  try {
    const response = await HrTracker.findOneAndDelete({ employeeId });
    return res.status(200).json(response || {});
  } catch (error) {
    return res.status(500).json({ message: error.toString() });
  }
});

module.exports = router;
