let mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');

let Schema = mongoose.Schema;


let schema = new Schema({
    user: {type: Object},
    apiPath: {type: String},
    fileName: {type: String},
    fileId: {type: mongoose.Schema.Types.ObjectId},
    date: {type: Date},
});

schema.index({date: -1});
schema.plugin(mongoosePaginate);

module.exports = mongoose.model('file-upload', schema);
