let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let schema = new Schema({
    user: {type: Object},
    method: {type: String},
    apiPath: {type: String},
    query:{type: Object},
    ip: {type: String},
    date: {type: Date},
});

schema.index({date: -1});
module.exports = mongoose.model('backend-log', schema);
