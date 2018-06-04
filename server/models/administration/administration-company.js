var mongoose = require('mongoose');
var Schema = mongoose.Schema;


  var Campaign = new Schema ({
    name: { type: String, required: true }
  });

  var Client = new Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    campaigns: { type: [Campaign], required: false },
  });

module.exports = mongoose.model('Administration-Client', Client);
