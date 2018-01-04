var express = require('express');
var router = express.Router();
var Employee = require('../models/employee/employee');
var jwt = require('jsonwebtoken');
var positions = [
    { id: '1001', name:'ED 1' },
    { id: '1002', name:'Rep 2: A' },
    { id: '1003', name:'Rep 3: Silver' },
    { id: '1004', name:'Rep 4: Gold' },
    { id: '1005', name:'Rep 5: Platinum' },
    { id: '1006', name:'Rep 6: Emerald' },
    { id: '1007', name:'Rep 7: ' },
    { id: '1008', name:'Rep 8' },
    { id: '1009', name:'Cleaner I' },
    { id: '1010', name:'Security' },
    { id: '1011', name:'Trainee' },
    { id: '1002', name:'ED 1 - old' },
    { id: '1002', name:'Rep 2: A - old' },
    { id: '1003', name:'Rep 3: Silver - old' },
    { id: '1004', name:'Rep 4: Gold - old' },
    { id: '1005', name:'Rep 5: Platinum - old' },
    { id: '1006', name:'Rep 6: Emerald - old' },
    { id: '1007', name:'Rep 7:  - old' },
    { id: '1008', name:'Rep 8 - old' },
    { id: '1122', name:'Cleaner I - old' },
    { id: '1010', name:'Security - old' },
    { id: '1011', name:'Trainee - old' }

];
router.get('/getall', function(req, res, next) {
    var token = jwt.decode(req.query.token);
    Employee.find(
        function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }if (req.query.token === '') {
            return res.status(500).json({
                title: 'Employees',
                message: 'Employees not found'
            });
        }if (result === null) {
            return res.status(500).json({
                title: 'Employees',
                message: 'Employees are empty or not found'
            });
        }
        res.status(200).json({
            message: 'Employee request succesfull',
            obj: result
        });
    });
});
router.get('/getDetail', function(req, res, next){
    Employee.findById(req.query.id, function(err, result){
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(200).json({
            message: 'Employee request succesfull',
            obj: result
        });
    });
});

module.exports = router;