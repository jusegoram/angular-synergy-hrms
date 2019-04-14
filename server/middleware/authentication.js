/**
 *
 *  Authentication middleware is supposed to check and verify the authentication bearer token sent
 *  on the authentication header
 * @param {*} req request made by the server, to be checked for authentication header
 * @param {*} res response made by the function, cant be made on middleware as it will cut the chain
 * @param {*} next next middleware function needs to be instatiated if this is not the last function call
 */
//TODO: finish authentication function according to spec

let jwt = require('jsonwebtoken');
let fs = require('fs');
let path = require('path');
const RSA_KEY = fs.readFileSync(path.join(__dirname, '../routes/pub.key'));


authentication = (req, res, next) => {
  const header = req.headers.authorization;
  let token;
  if (header) {
    token = header.split(' ');
    token = token[1];
  }
  if (!header) {
    res.status(401).json({
      message: 'unauthorized user'
    });
  } else if (!token) {
    res.status(401).json({
      message: 'unauthorized user'
    });
  } else if (token === 'null') {
    res.status(401).json({
      message: 'unauthorized user'
    });
  } else {
    jwt.verify(token, RSA_KEY, {
      algorithm: 'RS256',
      expiresIn: 60 * 30
    }, (err, dec) => {
      if (err) res.status(401).json({
        message: 'unauthorized user'
      });
      else {
        next();
      }
    });
  }

}

module.exports = {
  authentication
}
