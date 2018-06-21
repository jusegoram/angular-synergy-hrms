
//Require all imports
const express = require('express');
const path = require('path');
const debug = require('debug')('node-rest:server');
const http = require('http');
// var https = require('https');
// var privateKey  = fs.readFileSync('./certs/key.pem', 'utf8');
// var certificate = fs.readFileSync('./certs/cert.pem', 'utf8');
// var credentials = {passphrase: "1vg246vg4g", key: privateKey, cert: certificate};
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const compression = require("compression");
const cors = require("cors");
var helmet = require("helmet");
// Configure de upload with multer

// Get our API routes
const appRoutes = require('./server/routes/app');
// administration routes
const userRoutes = require('./server/routes/administration/user');
const menuRoutes = require('./server/routes/administration/menu');
const payrollRoutes = require('./server/routes/administration/payroll');
const admEmployeeRoutes= require('./server/routes/administration/employee');
//employee routes
const uploadRoutes = require('./server/routes/app/employee/upload');
const templateRoutes = require('./server/routes/app/employee/template');
const employeeRoutes = require('./server/routes/app/employee/employee');
const empReportRoutes = require('./server/routes/app/employee/reports');
// DB connection through Mongoose
const app = express();
const HOST = 'mongodb://localhost:';
const DB_PORT= '27017';
const COLLECTION= '/mongo-blink';
const TEST_URI = HOST + DB_PORT + COLLECTION;
const PROD_URI = process.env.MONGODB_URI;

const TEST_URL = "http://localhost:3000";
const PROD_URL = process.env.HEROKU_URL;
mongoose.connect(TEST_URI, {
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
app.use(helmet());

// ...
// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));
//  app.use(function(req, res, next) {
 //   if(!req.secure) {
 //     return res.redirect(PROD_URL);
 //  }
//   next();
//  });
// app.use(function(req, res, next) { //allow cross origin requests
//           res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
//           res.header("Access-Control-Allow-Origin", "*");
//           res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//           res.header("Access-Control-Allow-Credentials", true);
//           next();

//       });

app.use(cors({
  origin: ["*"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(compression());

//TODO: future move all api calls to a /api/v1/ url structure.
// Set our api routes
app.use('/user', userRoutes);
app.use('/menu', menuRoutes);
//
app.use('/payroll', payrollRoutes);
//
app.use('/upload', uploadRoutes);
app.use('/report', empReportRoutes);
app.use('/template', templateRoutes);
app.use('/employee', employeeRoutes);
//
app.use('/admEmp', admEmployeeRoutes);
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
server.listen(port, () => console.log(`API running on ${TEST_URL}`));
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
