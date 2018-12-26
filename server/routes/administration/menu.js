var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Menus = require('../../models/administration/administration-menu');
var Users = require('../../models/administration/administration-user');
router.get('/', function(req, res, next) {
    var token = jwt.decode(req.headers.authorization.split(' ')[1]);
    Menus.find( { roles: { $all:[parseInt(token.role, 10)] } }).sort({position: 1}).exec(
      function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }if (req.query.token === '') {
            return res.status(500).json({
                title: 'pages',
                message: 'pages not found'
            });
        }if (result === null) {
            return res.status(500).json({
                title: 'pages',
                message: 'pages not found'
            });
        }
        res.status(200).json(result);
    });
});

router.post('/', function (req, res, next){
            var menu = new Menus({
                state: req.body.state,
                name: req.body.name,
                type: req.body.type,
                icon: req.body.icon,
                badge: req.body.badge,
                children: req.body.children,
                roles: req.body.roles,
                position: req.body.position
           });
            menu.save(function(err, result) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                });
            }
            res.status(200).json({
                message: 'saved menu',
                obj: result
            });
        });
    });

  router.put('/', function ( req, res, next) {
      Menus.findOne({name: req.query.name}, function(err, doc) {
          console.log(doc);
          doc.state= req.body.state;
          doc.name= req.body.name;
          doc.type= req.body.type;
          doc.icon= req.body.icon;
          doc.badge= req.body.badge;
          doc.children= req.body.children;
          doc.roles= req.body.roles;
          doc.position= req.body.position;
          doc.save();
          if (err) {
              return res.status(500).json({
                  title: 'An error occurred',
                  error: err
              });
          }
          res.status(200).json(doc);
      });
  });

  router.delete('/', (req, res) => {
    Menus.deleteOne({name: req.query.name}, function(err, doc){
      if(err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({
          message: 'delete success',
          doc: doc
        });
      }
    });
  });
module.exports = router;
