var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BadgeItem = new Schema ({
    type: {type: String, required: true},
    value: {type: String, required: true}
  });
  
  var ChildrenItems = new Schema ({
    state: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: false }
  });
  
  var Menu = new Schema ({
    state: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    icon: { type: String, required: true },
    badge: { type: BadgeItem, required: false },
    children: { type: [ChildrenItems], required: false },
    roles: { type: [Number] , required: false },
  });
  
module.exports = mongoose.model('Menu', Menu);