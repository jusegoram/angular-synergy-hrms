var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var fastcsv = require('fast-csv');


router.get('/position', function(req, res, next){
 var from = req.query.fromDate;
 var to = req.query.toDate
});
router.get('/personal', function(req, res, next){
    
});
router.get('/payroll', function(req, res, next){
    
});
router.get('/family', function(req, res, next){
    
});
router.get('/education', function(req, res, next){
    
});
router.get('/company', function(req, res, next){
    
});
router.get('/comment', function(req, res, next){
    
});
module.exports = router;