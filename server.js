
//Require all imports
var fs = require('fs');
const express = require('express');
const path = require('path');
var debug = require('debug')('node-rest:server');
const http = require('http');
// var https = require('https');
var privateKey  = fs.readFileSync('./certs/key.pem', 'utf8');
var certificate = fs.readFileSync('./certs/cert.pem', 'utf8');
var credentials = {passphrase: "1vg246vg4g", key: privateKey, cert: certificate};
var logger = require('morgan');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var mongoose = require('mongoose');
// Configure de upload with multer

// Get our API routes
const appRoutes = require('./routes/app');
const userRoutes = require('./routes/user');
const menuRoutes = require('./routes/menu');
const uploadRoutes = require('./routes/upload');
const templateRoutes = require('./routes/template');
const employeeRoutes = require('./routes/employee');
// DB connection through Mongoose
const app = express();
const HOST = 'mongodb://localhost:';
const DB_PORT= '27017';
const COLLECTION= '/mongo-blink';
const TEST_URI = HOST + DB_PORT + COLLECTION;
const PROD_URI = process.env.MONGODB_URI;

const TEST_URL = "https://localhost:8443";
const PROD_URL = "https://blink-test.herokuapp.com";
mongoose.connect(PROD_URI, {
  useMongoClient: true,
 });
 app.set('dist', path.join(__dirname, 'dist'));
 app.engine('html', require('ejs').renderFile);
// Parsers for POST data
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());


// ...
// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));
 app.use(function(req, res, next) {
   if(!req.secure) {
     return res.redirect(PROD_URL);
  }
  next();
 });
app.use(function(req, res, next) { //allow cross origin requests
          res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
          res.header("Access-Control-Allow-Origin", PROD_URL);
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
          res.header("Access-Control-Allow-Credentials", true);
          next();
  
      });
// Set our api routes
app.use('/user', userRoutes);
app.use('/menu', menuRoutes);
app.use('/upload', uploadRoutes);
app.use('/template', templateRoutes);
app.use('/employee', employeeRoutes);
app.use('/', appRoutes);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
// var httpsServer = https.createServer(credentials, app);
var server = http.createServer(app);


/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
server.on('error', onError);
server.on('listening', onListening);

// httpsServer.listen(port, () => console.log(`API running on localhost:${port}`));
// httpsServer.on('error', onError);
// httpsServer.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  
  /**
   * Event listener for HTTP server "listening" event.
   */
  
  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on' + bind);
  }
  