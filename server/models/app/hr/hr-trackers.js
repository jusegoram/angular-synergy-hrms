var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var trackerSchema = new Schema({
    statusChange: {
        newStatus: { type: String },
        effectiveDate: { type: Date },
        absenteeism: {
            firstChance: {
                date: { type: Date },
                time: { type: String },
                reason: {type: String },
            },
            secondChance: {
                date: { type: Date},
                time: { type: String },
                reason: {type: String },
            },
            thirdChance: {
                date: { type: Date},
                time: { type: String },
                reason: {type: String },
            }
        },
        supervisorSignature: { type: mongoose.Schema.Types.Buffer},
        managerSignature: { type: mongoose.Schema.Types.Buffer},
        employeeSignature: { type: mongoose.Schema.Types.Buffer},
    },
    transfer: {
        effectiveDate: { type: Date },
        oldClient: {type: String },
        oldCampaign: {type: String },
        newClient: {type: String },
        newCampaign: {type: String },
        reason: {type: String },
        managerSignature: { type: mongoose.Schema.Types.Buffer },
    },
    certifyTraining: {
        certificationDate: {type: Date},
        client: {type: String },
        campaign: {type: String},
        reason: { type: String },
        managerSignature: { type: mongoose.Schema.Types.Buffer },
    },
    infoChangeRequest: {
        mainInfo: {type: Boolean},
        companyInfo: {type: Boolean},
        personalInfo: {type: Boolean},
        positionInfo: {type: Boolean},
        reason: {type: String},
    }
})

var schema = new Schema({
    employeeId: {type: String},
    employee: { type: mongoose.Schema.Types.ObjectId},
    requestDate: {type: Date},
    createdDate: { type: Date, default: Date.now },
    state: {type: Number, default: 0},
    tracker: {type: trackerSchema},
    creationFingerprint: { type: mongoose.Schema.Types.ObjectId},
    verificationFingerprint: { type: mongoose.Schema.Types.ObjectId},
});

module.exports = mongoose.model('hr-tracker', schema);

