let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let Department = require('../../models/administration/administration-department');
let mongoose = require('mongoose');


router.post('/department', function (req, res, next) {
  let _positions = [];
  if (req.body.positions){
    let reqArray = req.body.positions;
    for ( i=0; i < reqArray.length; i++){
      _positions.push(new mongoose.Types.ObjectId());
      Department.position.create(new Department.position({
        _id: _positions[i],
        positionId: reqArray[i].positionId,
        name: reqArray[i].name,
        baseWage: reqArray[i].baseWage,
      }));
    }
  }
  let department = new Department.department({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        positions: _positions
    });
        department.save(function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(200).json(result);
        });
});

router.post('/position', function (req, res, next) {
  let positions = req.body.positions;
  for (let i = 0; i < positions.length; i++) {
    if (!positions[i]._id) {
      let id = new mongoose.Types.ObjectId();
      let position = new Department.position({
        _id: id,
        positionId: positions[i].positionId,
        name: positions[i].name,
        baseWage: positions[i].baseWage
      });
      position.save(function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        Department.department.update({_id: req.body._id}, {$push: { positions: id }}, function(err) {
          if (err) console.log(err);
        });
        res.status(200).json(result);
      });
    }
  }
});

router.get('/department', function (req, res, next) {
    Department.department.find().populate({
      path: 'positions',
      model: 'Administration-Position'
    }).exec(function (err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      if (req.query.token === '') {
        return res.status(500).json({
          title: 'Not Found',
          message: 'authentication not found'
        });
      }
      if (result === null) {
        return res.status(500).json({
          title: 'Not found',
          message: 'Positions are empty or not found'
        });
      }
      res.status(200).json(result);
    });
});

router.get('/position', function (req, res, next) {
  Department.position.findById(req.query.id, function (err, result) {
    if(err) res.status(500).json(err);
    res.status(200).json(result);
  });
});

router.put('/department', function ( req, res, next) {
  // let positions = req.body.positions;
  // if (!positions){
  //   for(i=0; i < positions.length(); i++) {
  //     Department.position.findById(positions[i], function (err, result) {
  //       result.positionId = positions[i].positionId;
  //       result.name = positions[i].name;
  //       result.baseWage = positions[i].baseWage;
  //     });
  //   }
  // }
    Department.department.findById(req.query.id, function(err, result) {
      result.name = req.body.name;
      result.save();
        if (err) {
            return res.status(500).json(err);
        }
      res.status(200).json(result);
    });
});

router.put('/position', function (req, res, next) {
  let positions = req.body.positions;
  if (!positions){
    for( i=0; i < positions.length(); i++) {
      Department.position.findById(positions[i], function (err, result) {
        if (err) return res.status(500).json(err);
        result.positionId = positions[i].positionId;
        result.name = positions[i].name;
        result.baseWage = positions[i].baseWage;
      });

    }
  }
});

module.exports = router;
