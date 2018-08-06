/**
 *
 *  Authentication middleware is supposed to check and verify the authentication bearer token sent
 *  on the authentication header
 * @param {*} req request made by the server, to be checked for authentication header
 * @param {*} res response made by the function, cant be made on middleware as it will cut the chain
 * @param {*} next next middleware function needs to be instatiated if this is not the last function call
 */
//TODO: finish authentication function according to spec
function authentication ( req, res, next) {

}
