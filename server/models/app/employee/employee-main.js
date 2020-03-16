let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let mongooseUniqueValidator = require('mongoose-unique-validator');
let mongooseAutopopulate = require("mongoose-autopopulate")

var companySchema = new Schema({
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
  bilingual: {type: Boolean, required: false},
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main', required: false },
  updatedAt: {type: Date, required: false },
  createdAt: {type: Date, required: false, default: Date.now},
  createdBy: {type: Object, required: false},
  updatedBy: {type: Object, required: false},
});

var hobbySchema = new Schema({
  hobbyTitle: {type: String, required: false},
  hobbyComment: {type: String, required: false},
  updatedAt: {type: Date, required: false },
  createdAt: {type: Date, required: false, default: Date.now},
  createdBy: {type: Object, required: false},
  updatedBy: {type: Object, required: false},
});

var personalSchema = new Schema({
  employeeId: { type: String, required: true},
  maritalStatus:{ type: String, required: false },
  amountOfChildren: {type: Number, required: false}, // NEW
  address: { type: String, required: false },
  town: { type: String, required: false },
  district: { type: String, required: false },
  addressDate: { type: Date, required: false },
  celNumber: { type: String, required: false },
  telNumber: { type: String, required: false },
  birthDate: {type: Date, required: false},
  birthPlaceDis: { type: String, required: false },
  birthPlaceTow: { type: String, required: false },
  emailAddress: { type: String, required: false },
  emailDate: {type: Date, required: false },
  hobbies: { type: [hobbySchema], required: false},
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main', required: false },
  updatedAt: {type: Date, required: false },
  createdAt: {type: Date, required: false, default: Date.now},
  createdBy: {type: Object, required: false},
  updatedBy: {type: Object, required: false},
});

let payrollSchema = new Schema({
  employeeId: { type: String, required: true },
  TIN: {type: String, required: true },
  payrollType: {type: String, required: true },
  bankName: {type: String, required: false },
  bankAccount: {type: String, required: false },
  billable: {type: Boolean, required: false},
  paymentType: {type: String, required: false},
  lastVacation:{type: Object, required: false},
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main', required: false },
  updatedAt: {type: Date, required: false },
  createdAt: {type: Date, required: false, default: Date.now},
  createdBy: {type: Object, required: false},
  updatedBy: {type: Object, required: false},
});

var commentsSchema = new Schema({
  employeeId: {type: String, required: true},
  reason: {type: String, required: false},
  comment: {type: String, required: true },
  commentDate: {type: Date, required: true},
  submittedBy: {type: Object, required: true},
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee-Main', required: false },
  updatedAt: {type: Date, required: false },
  createdAt: {type: Date, required: false, default: Date.now},
  createdBy: {type: Object, required: false},
  updatedBy: {type: Object, required: false},
});

var attritionSchema = new Schema({
  employeeId: {type: String, required: true},
  reason1: {type: String, required: true },
  reason2: {type: String, required: false },
  comment: {type: String, required: true },
  commentDate: {type: Date, required: true},
  submittedBy: {type: Object, required: true},
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main', required: false },
  updatedAt: {type: Date, required: false },
  createdAt: {type: Date, required: false, default: Date.now},
  createdBy: {type: Object, required: false},
  updatedBy: {type: Object, required: false},
});

var familySchema = new Schema({
  employeeId: {type: String, required: true },
  referenceName: { type: String, required: true },
  age: {type: Number, required: true },
  relationship: { type: String, required: true },
  celNumber: { type: String, required: false },
  telNumber: { type: String, required: false },
  emailAddress: { type: String, required: false },
  address: { type: String, required: false },
  comment: {type: String, required: false},
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee-Main', required: false },
  updatedAt: {type: Date, required: false },
  createdAt: {type: Date, required: false, default: Date.now},
  createdBy: {type: Object, required: false},
  updatedBy: {type: Object, required: false},
});

var educationSchema = new Schema({
  employeeId: { type: String, required: true },
  institution: { type: String, required: true },
  levelOfEducation: { type: String, required: true },
  numberOfYears: { type: String, required: true },
  mayor: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee-Main', required: false },
  updatedAt: {type: Date, required: false },
  createdAt: {type: Date, required: false, default: Date.now},
  createdBy: {type: Object, required: false},
  updatedBy: {type: Object, required: false},
});

let daySchema = new Schema({
  day: { type: Number },
  onShift: { type: Boolean },
  startTime: {type: Number},
  endTime: { type: Number },
  scheduledHours: {type: Number},
});

let shiftSchema = new Schema({
  shiftId: {type: String},
  name: {type: String},
  totalHours: {type: Number },
  daysonShift: {type: Number },
  shift: { type: [daySchema] }
});

let EmployeeShiftSchema = new Schema({
  employeeId: { type: String, required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee-main', required: false },
  createdDate: { type: Date, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false },
  shift: { type: shiftSchema },
  updatedAt: {type: Date, required: false },
  createdAt: {type: Date, required: false, default: Date.now},
  createdBy: {type: Object, required: false},
  updatedBy: {type: Object, required: false},
});

let EmployeeSchema = new Schema({
    onFinalPayment: { type: Boolean, default: false},
    payedFinalPayment: { type: Boolean, default: false},
    onVacations: { type: Boolean, default: false},
    onMaternity: { type: Boolean, default: false},
    onCSL: { type: Boolean, default: false},
    employeeId: { type: Number, required: true, unique: true},
    dialerId:{ type: Number, required: true, unique: true},
    firstName: {type: String, required: true},
    middleName:{ type: String, required: false },
    lastName: {type: String, required: true},
    gender: { type: String, required: true },
    socialSecurity: { type: String, required: true },
    status: { type: String, required: true },
    currentPosition: {type: Object, required: false}, //only position name
    currentShift: { type: shiftSchema, required: false}, //only shift name
    //company: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee-Company' , required: false, autopopulate: true},
    //companyNew: {type: companySchema, required: false},
    company: {type: companySchema, required: false},

    //personal: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee-Personal' , required: false, autopopulate: { maxDepth: 2 }},
    //personalNew: {type: personalSchema, required: false},
    personal: {type: personalSchema, required: false},

    //payroll: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee-Payroll' , required: false, autopopulate: true},
    //payrollNew: { type: payrollSchema, required:false},
    payroll: { type: payrollSchema, required:false},

    //comments: { type: [mongoose.Schema.Types.ObjectId], ref: 'Employee-Comment' , required: false, autopopulate: true},
    //commentsNew: {type: [commentsSchema], required: false},
    comments: {type: [commentsSchema], required: false},

    //attrition: { type: [mongoose.Schema.Types.ObjectId], ref: 'Employee-Attrition' , required: false, autopopulate: true},
    //attritionNew: {type: [attritionSchema], required: false},
    attrition: {type: [attritionSchema], required: false},

    //family: { type: [mongoose.Schema.Types.ObjectId], ref: 'Employee-Family' , required: false, autopopulate: { maxDepth: 2 }},
    //familyNew: {type: [familySchema], required: false},
    family: {type: [familySchema], required: false},

    //education: { type: [mongoose.Schema.Types.ObjectId], ref: 'Employee-Education' , required: false},
    //educationNew: {type: [educationSchema], required: false},
    education: {type: [educationSchema], required: false},

    // TODO: THESE ARE THE ONLY ONES THAT NEED POPULATION DUE TO NORMALIZATION OF DOCUMENTS
    shift: { type: [EmployeeShiftSchema], required: false },
    position: { type: [mongoose.Schema.Types.ObjectId] , ref: 'Employee-Position' , required: false, autopopulate: true},
    updatedAt: {type: Date, required: false },
    createdAt: {type: Date, required: false, default: Date.now},
    createdBy: {type: Object, required: false},
    updatedBy: {type: Object, required: false},
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
EmployeeSchema.index({status: 1, employeeId: -1, onFinalPayment: -1, "payroll.payrollType": 1});
module.exports = mongoose.model('employee-main', EmployeeSchema);
