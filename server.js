
//Require all imports
const express = require('express');
const path = require('path');
const debug = require('debug')('node-rest:server');
const http = require('http');
//const https = require("https");
const fs = require("fs");

//const options = {
//  passphrase: "1vg246vg4g",
//  key: fs.readFileSync("./ssl/key.pem"),
//  cert: fs.readFileSync("./ssl/cert.pem"),
//  dhparam: fs.readFileSync("./ssl/dh-strong.pem")
//};

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
const admUserRoutes = require('./server/routes/administration/user');
const admMenuRoutes = require('./server/routes/administration/menu');
const admPayrollRoutes = require('./server/routes/administration/payroll');
const admEmployeeRoutes= require('./server/routes/administration/employee');
//employee routes
const empUploadRoutes = require('./server/routes/app/employee/upload');
const empTemplateRoutes = require('./server/routes/app/employee/template');
const empRoutes = require('./server/routes/app/employee/employee');
const empReportRoutes = require('./server/routes/app/employee/reports');
const appUserRoutes = require('./server/routes/app/user/user');
const appPayrollRoutes = require('./server/routes/app/payroll/payroll');
// DB connection through Mongoose
const app = express();
const HOST = 'mongodb://localhost:';
const DB_PORT= '27017';
const COLLECTION= '/mongo-blink';
const TEST_URI = HOST + DB_PORT + COLLECTION;
//const TEST_URL = "http://192.168.100.4:3000";
const TEST_URL = "http://localhost:3000";
// const PROD_URI = process.env.MONGODB_URI;
// const PROD_URL = process.env.HEROKU_URL;

// app.configure('development', function(){
//   app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
// });

// app.configure('production', function(){
//   app.use(express.errorHandler());
// });

mongoose.connect(TEST_URI, {
  useMongoClient: true,
 });
 app.set('dist', path.join(__dirname, 'dist'));
 app.engine('html', require('ejs').renderFile);

 app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());
app.use(helmet());

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

app.use(cors({
  origin: [TEST_URL],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(compression());

/**
 * @description: Administration Module Express routes.
 * @author: Juan Sebastian Gomez
 */
app.use('/api/v1', admUserRoutes);
app.use('/api/v1/admin/menu', admMenuRoutes);
app.use('/api/v1/admin/employee', admEmployeeRoutes);
app.use('/api/v1/admin/payroll', admPayrollRoutes);
/**
 * @description: Employee Module Express routes.
 * @author: Juan Sebastian Gomez
 */
app.use('/api/v1/employee', empRoutes);
app.use('/api/v1/employee/upload', empUploadRoutes);
app.use('/api/v1/employee/report', empReportRoutes);
app.use('/api/v1/employee/template', empTemplateRoutes);

app.use('/api/v1/user', appUserRoutes);
app.use('/api/v1/payroll', appPayrollRoutes);
//TODO: Add mobile route managament for future android and ios app.
/**
 * @description: Mobile app Express api routes.
 * @author: Juan Sebastian Gomez
 */

/**
 * @description: App Module Express routes.
 * @author: Juan Sebastian Gomez
 */
app.use('/', appRoutes);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort('3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
// var httpsServer = https.createServer(options, app);
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
    debug('Listening on');
  }
