let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let mongooseUniqueValidator = require('mongoose-unique-validator');
let mongooseAutopopulate = require("mongoose-autopopulate")

let EmployeeSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employeeId: { type: Number, required: true, unique: true },
    firstName: {type: String, required: true},
    middleName:{ type: String, required: false },
    lastName: {type: String, required: true},
    gender: { type: String, required: true },
    socialSecurity: { type: String, required: true },
    status: { type: String, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee-Company' , required: false },
    shift: { type: [mongoose.Schema.Types.ObjectId], ref: 'Employee-Shift', autopopulate: true},
    position: { type: [mongoose.Schema.Types.ObjectId] , ref: 'Employee-Position' , required: false, autopopulate: true},
    payroll: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee-Payroll' , required: false, autopopulate: true},
    personal: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee-Personal' , required: false, autopopulate: { maxDepth: 2 }},
    family: { type: [mongoose.Schema.Types.ObjectId], ref: 'Employee-Family' , required: false, autopopulate: { maxDepth: 2 }},
    education: { type: [mongoose.Schema.Types.ObjectId], ref: 'Employee-Education' , required: false, autopopulate: { maxDepth: 2 }},
    comments: { type: [mongoose.Schema.Types.ObjectId], ref: 'Employee-Comment' , required: false, autopopulate: { maxDepth: 2 }},
});

EmployeeSchema.statics.findMax = function (callback) {

    this.find() // 'this' now refers to the Member class
      .sort({employeeId: -1})
      .limit(1)
      .exec(callback);
}

EmployeeSchema.statics.getId = function (employeeid) {

        this.find({employeeId: employeeid}, function(err, result){
            if(err){
                return err;
            }
            return result._id;
        });

}

EmployeeSchema.plugin(mongooseAutopopulate);
EmployeeSchema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('employee-main', EmployeeSchema);
