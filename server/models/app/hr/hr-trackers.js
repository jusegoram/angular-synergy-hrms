var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var trackerSchema = new Schema({
    statusChange: {
        newStatus: { type: String },
        effectiveDate: { type: Date },
        absenteeism: {
            firstChance: {
                date: { type: Date},
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
        supervisorSignature: { type: mongoose.Types.BinData},
        managerSignature: { type: mongoose.Types.BinData},
        employeeSignature: { type: mongoose.Types.BinData},
    },
    transfer: {
        effectiveDate: { type: Date },
        oldClient: {type: String },
        oldCampaign: {type: String },
        newClient: {type: String },
        newCampaign: {type: String },
        reason: {type: String },
        managerSignature: { type: mongoose.Types.BinData },
    },
    certifyTraining: {
        certificationDate: {type: Date},
        client: {type: String },
        campaign: {type: String},
        reason: { type: String },
        managerSignature: { type: mongoose.Types.BinData },
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
    employee: { type: mongoose.Types.ObjectId},
    requestDate: {type: Date},
    createdDate: { type: Date, default: Date.now },
    state: {type: Number, default: 0},
    tracker: {type: trackerSchema},
    creationFingerprint: { type: mongoose.Types.ObjectId},
    verificationFingerprint: { type: mongoose.Types.ObjectId},
});

module.exports = mongoose.model('hr-tracker', schema);

