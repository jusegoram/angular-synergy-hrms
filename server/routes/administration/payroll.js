let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let Department = require('../../models/administration/administration-department');
let AdminPayroll = require('../../models/administration/administration-payroll');
let SocialSecurity = AdminPayroll.SocialTable;
let IncomeTax = AdminPayroll.IncomeTaxTable;
let Holidays = AdminPayroll.HolidayTable;
let mongoose = require('mongoose');


router.post('/department', (req, res ) => {
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
        department.save((err, result) => {
        if (err) res.status(500).json(err);
        else res.status(200).json(result);
        });
});
router.get('/department', (req, res ) => {
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
router.put('/department', ( req, res ) => {
  Department.department.findById(req.query.id, (err, result) => {
    result.name = req.body.name;
    result.save();
      if (err) return res.status(500).json(err);
      else res.status(200).json(result);
  });
});
router.delete('/department', (req, res) => {
  Department.department.findOneAndRemove({_id: req.query._id}, (err, doc) => {
    Department.position.remove({_id:{$in: doc.positions}}, (err, raw) => {
      if(err) res.status(500).json(err);
      else res.status(200).json(raw);
    });
  });
});

router.post('/position', (req, res ) => {
  const position = req.body
  const id = req.query.id
  const _id = new mongoose.Types.ObjectId();
  Department.position.create(new Department.position({
    _id: _id,
    positionId: position.positionId,
    name: position.name,
    baseWage: position.baseWage,
  }));
  Department.department.findByIdAndUpdate({_id: id}, {$push: {positions: _id}}, {new: true})
  .populate({path: 'positions', model: 'Administration-Position'})
  .exec((err, doc) => {
    if(err) res.status(500).json(err);
    else  res.json(200, doc);
  })
});

router.get('/position', (req, res ) => {
  Department.position.findById(req.query.id, function (err, result) {
    if(err) res.status(500).json(err);
    res.status(200).json(result);
  });
});

router.put('/position', (req, res ) => {
  let positions = req.body;
  if (positions){
    positions.forEach(position => {
      Department.position.findOneAndUpdate({_id: position._id},{
        $set: {
          positionId: position.positionId,
          name: position.name,
          baseWage: position.baseWage,
        },
      }, {new: true},(err, result) => {
        if (err) res.status(500).json(err);
        else {
          res.status(200).json(result);
        }
      });
    });
  }else {
    res.status(500).json({message: 'no positions where sent'});
  }
});
router.delete('/position', (req, res) => {
  Department.position.deleteOne({_id: req.query._id}, (err, doc) => {
    if(err) res.status(500).json(err);
    else res.status(200).json(doc);
  })
});

router.get('/socialsecurity/:id', (req, res) => {
  let {page, limit} = req.query;
  const options = {
    page: parseInt(page, 10) + 1,
    limit: parseInt(limit, 10),
     sort: {earnings: 1},
  };
  SocialSecurity.paginate({}, options, (err, docs) => {
    if(err) res.status(400).json(err);
    else if(docs) res.status(200).json(docs);
  })
});
router.get('/holidays/:id', (req, res) => {
  let {page, limit} = req.query;
  const options = {
    page: parseInt(page, 10) + 1,
    limit: parseInt(limit, 10),
     sort: {date: 1},
  };
  Holidays.paginate({}, options, (err, docs) => {
    if(err) res.status(400).json(err);
    else if(docs) res.status(200).json(docs);
  })
});
router.get('/incomeTax/:id', (req, res) => {
  let {page, limit} = req.query;
  const options = {
    page: parseInt(page, 10) + 1,
    limit: parseInt(limit, 10),
     sort: {fromAmount: 1},
  };
  IncomeTax.paginate({}, options, (err, docs) => {
    if(err) res.status(400).json(err);
    else if(docs) res.status(200).json(docs);
  })
});

module.exports = router;
