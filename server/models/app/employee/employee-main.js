let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let mongooseUniqueValidator = require('mongoose-unique-validator');
let mongooseAutopopulate = require("mongoose-autopopulate")

var companySchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  employeeId: { type: String, required: true},
  client: { type: String, required: false}, //reports index
  campaign: { type: String, required: false }, //reports index
  supervisor: { type: String , required: false}, //reports index
  manager: {type: String, required: false},
  trainer: { type: String, required: false},
  trainingGroupRef: { type: String, required: false }, //reports index
  trainingGroupNum: { type: Number, required: false },
  hireDate:{ type: Date, required: false }, //reports index
  terminationDate:{ type: Date, required: false },
  reapplicant: { type: Boolean, required: false},
  reapplicantTimes: {type: Number, required: false},
});

var personalSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  employeeId: { type: String, required: true},
  maritalStatus:{ type: String, required: false },
  address: { type: String, required: false },
  town: { type: String, required: false },
  district: { type: String, required: false },
  addressDate: { type: Date, required: false },
  celNumber: { type: String, required: false },
  telNumber: { type: String, required: false },
  birthDate: {type: Date, required: false},
  birthPlace: { type: String, required: false },
  birthPlaceDis: { type: String, required: false },
  birthPlaceTow: { type: String, required: false },
  emailAddress: { type: String, required: false },
  emailDate: {type: Date, required: false },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main', required: false },
});

let EmployeeSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employeeId: { type: Number, required: true, unique: true },
    firstName: {type: String, required: true},
    middleName:{ type: String, required: false },
    lastName: {type: String, required: true},
    gender: { type: String, required: true },
    socialSecurity: { type: String, required: true },
    status: { type: String, required: true },
    company: {type: companySchema, required: false},
  // personal: {type: personalSchema, required: false},
  // personal: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee-Personal' , required: false, autopopulate: { maxDepth: 2 }},
    comments: { type: [mongoose.Schema.Types.ObjectId], ref: 'Employee-Comment' , required: false, autopopulate: true},
    attrition: { type: [mongoose.Schema.Types.ObjectId], ref: 'Employee-Attrition' , required: false, autopopulate: true},
    family: { type: [mongoose.Schema.Types.ObjectId], ref: 'Employee-Family' , required: false, autopopulate: { maxDepth: 2 }},
    education: { type: [mongoose.Schema.Types.ObjectId], ref: 'Employee-Education' , required: false},
    // TODO: THESE ARE THE ONLY ONES THAT NEED POPULATION DUE TO NORMALIZATION OF DOCUMENTS
    payroll: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee-Payroll' , required: false, autopopulate: true},
    shift: { type: [mongoose.Schema.Types.ObjectId], ref: 'Employee-Shift', autopopulate: true},
    position: { type: [mongoose.Schema.Types.ObjectId] , ref: 'Employee-Position' , required: false, autopopulate: true},
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
