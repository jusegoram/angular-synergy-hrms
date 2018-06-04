var mongoose = require('mongoose');
var Schema = mongoose.Schema;


  var Position = new Schema ({
    positionid: { type: String, required: false },
    name: { type: String, required: false },
    baseWage: { type: Number, required: false}
  });

  var AdministrationDepartment = new Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    positions: { type: [Position], required: false },
  });

module.exports = mongoose.model('Administration-Department', AdministrationDepartment);
