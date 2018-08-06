let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let mongooseUniqueValidator = require('mongoose-unique-validator');

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
    shift: { type: [mongoose.Schema.Types.ObjectId], ref: 'Employee-Shift'},
    position: { type: [mongoose.Schema.Types.ObjectId] , ref: 'Employee-Position' , required: false },
    payroll: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee-Payroll' , required: false },
    personal: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee-Personal' , required: false },
    family: { type: [mongoose.Schema.Types.ObjectId], ref: 'Employee-Family' , required: false },
    education: { type: [mongoose.Schema.Types.ObjectId], ref: 'Employee-Education' , required: false },
    comments: { type: [mongoose.Schema.Types.ObjectId], ref: 'Employee-Comment' , required: false },
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

EmployeeSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('employee-main', EmployeeSchema);
