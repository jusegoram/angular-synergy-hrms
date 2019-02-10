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


 authentication = ( req, res, next) => {
   let token = req.headers.authorization;
  if(!token){
    res.status(401).json({message: 'unauthorized user'});
  }else if(token === 'JWT null'){
    res.status(401).json({message: 'unauthorized user'});
  }else {
    let token = req.headers.authorization;
    next();
  }

}

module.exports = {authentication}
