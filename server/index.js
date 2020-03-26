
//Require all imports
const express = require('express');
const authentication = require('./middleware/authentication');
const path = require('path');
const debug = require('debug')('node-rest:server');
const http = require('http');
const fs = require("fs");

const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");

// Get our API routes
const appRoutes = require('./routes');
// administration routes
const admUserRoutes = require('./routes/administration/user');
const admMenuRoutes = require('./routes/administration/menu');
const admPayrollRoutes = require('./routes/administration/payroll');
const admEmployeeRoutes= require('./routes/administration/employee');
//employee routes
const empUploadRoutes = require('./routes/app/employee/upload');
const empTemplateRoutes = require('./routes/app/employee/template');
const empRoutes = require('./routes/app/employee/employee');
const empReportRoutes = require('./routes/app/employee/reports');

const appUserRoutes = require('./routes/app/user/user');
const appPayrollRoutes = require('./routes/app/payroll/payroll');
const appOpsRoutes = require('./routes/app/operations/operations');
const appOpsUploadRoutes = require('./routes/app/operations/upload');
const appHrTrackersRoutes = require('./routes/app/hr/trackers');

// DB connection through Mongoose
const app = express();
const HOST = 'mongodb://localhost:';
const DB_PORT= '27017';
const COLLECTION= '/mongo-blink';
const DB = HOST + DB_PORT + COLLECTION;
const URL = "http://localhost:3000";


mongoose.connect(DB);
 app.set('dist', path.join(__dirname, '../dist'));
 app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json({limit: '10mb', type:'application/json'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(cookieParser());
app.use(helmet());
app.use(logger('combined'));
// Point static path to dist
app.use(express.static(path.join(__dirname, '../dist')));

app.use(cors({
  origin: [URL],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(compression());

/**
 * @description: Administration Module Express routes.
 * @author: Juan Sebastian Gomez
 */
app.use('/api/v1', authentication.authentication, admUserRoutes);
app.use('/api/v1/admin/menu', authentication.authentication, admMenuRoutes);
app.use('/api/v1/admin/employee', authentication.authentication, admEmployeeRoutes);
app.use('/api/v1/admin/payroll', authentication.authentication, admPayrollRoutes);
/**
 * @description: Employee Module Express routes.
 * @author: Juan Sebastian Gomez
 */
app.use('/api/v1/employee', authentication.authentication, empRoutes);
app.use('/api/v1/employee/upload', authentication.authentication, empUploadRoutes);
app.use('/api/v1/employee/report', authentication.authentication, empReportRoutes);
app.use('/api/v1/employee/template', authentication.authentication, empTemplateRoutes);

app.use('/api/v1/user', authentication.authentication, appUserRoutes);
app.use('/api/v1/payroll', authentication.authentication, appPayrollRoutes);

app.use('/api/v1/operations', authentication.authentication, appOpsRoutes);
app.use('/api/v1/operations/upload', authentication.authentication, appOpsUploadRoutes);

app.use('/api/test/hr/trackers', appHrTrackersRoutes);

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
  res.sendFile(path.join(__dirname, '../dist/index.html'));
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
 * Initiate Socket
 */

var appDashboard = require('./sockets/dashboard');

var io = require('socket.io')(server);
io.of('/api/v1/dashboard').on('connection', socket => {
  console.log('connected');
  socket.on('getEmployeeDistribution',  appDashboard.getEmployeeDistribution.bind({socket, io}));
  socket.on('getActiveEmployeeCount', appDashboard.getActiveEmployeeCount.bind({socket, io}));
});

/**
 * Listen on provided port, on all network interfaces.
 */
 server.listen(port, () => console.log(`API running on ${URL}`));
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
