let mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');

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
schema.plugin(mongoosePaginate);

module.exports = mongoose.model('backend-log', schema);
