var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var schema = new Schema({
  action: {type: String, required: true},
  log: {type: String, required: true},
  date: {type: Date, required: true},
  user: {type: String, required: true},
  fullName: {type: String, required: true},
  ip: {type: String, required: true},
});



module.exports = mongoose.model('Administration-User-Log', schema);
