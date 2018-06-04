var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employeeId: { type: String, required: true, unique: true },
    idasnum: {type: Number, required: true, unique: true},
    firstName: {type: String, required: true},
    middleName:{ type: String, required: false },
    lastName: {type: String, required: true},
    gender: { type: String, required: true },
    socialSecurity: { type: String, required: true },
    status: { type: String, required: true },// active, resignation, dissmisal, termination, undefined, trainee
});

schema.statics.findMax = function (callback) {

    this.find() // 'this' now refers to the Member class
      .sort({idasnum: -1})
      .limit(1)
      .exec(callback);
  }

schema.statics.getId = function (employeeid) {

        this.find({employeeId: employeeid}, function(err, result){
            if(err){
                return err;
            }
            return result._id;
        });

}

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('employee-main', schema);
