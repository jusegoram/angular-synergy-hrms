let express = require("express");
let router = express.Router();
let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");
let fs = require("fs");
let path = require("path");

let RSA_KEY;
RSA_KEY = fs.readFileSync(path.join(__dirname, "./priv.key"));

let User = require("../models/administration/administration-user");

router.get("/", function (req, res, next) {
//    res.render("index.html");
  res.status(404).send("WOOPS, this is not a valid route");
});


router.post("/api/login", function(req, res, next) {
  User.findOneAndUpdate({username: req.body.user}, {"$set": {lastLogin: new Date()}}, {new: true}).select("+password").exec(function(err, user) {
    if (err) {
        return res.status(500).json({
            title: "An error occurred",
            error: err
        });
    }else if (!user) {
        return res.status(401).json({
            title: "Login failed",
            error: {message: "Invalid login credentials"}
        });
    }else if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({
            title: "Login failed",
            error: {message: "Invalid login credentials"}
        });
    }else {
      let token = jwt.sign({
        userId: user._id.toString(),
        name: user.firstName + (user.middleName ? " " + user.middleName : "") + " " + user.lastName,
        role: user.role,
        pages: user.pages,
        clients: user.clients,
        rights: user.rights,
      }, RSA_KEY, {
        algorithm: "RS256",
        expiresIn: "3h",
      });
      res.status(200).json({
          idToken: token,
      });
    }
});
  function setRights(){

  }
});
module.exports = router;
