let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let positionSchema = new Schema ({
    positionId: { type: String, required: false },
    name: { type: String, required: false },
    baseWage: { type: Number, required: false}
  });
const position = mongoose.model('Administration-Position', positionSchema);

let departmentSchema = new Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    positions: {  type: [mongoose.Schema.Types.ObjectId], ref: 'Administration-Position', required: false},
  });
const department = mongoose.model('Administration-Department', departmentSchema);
module.exports = {position, department};
