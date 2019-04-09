let Employee = require('../models/app/employee/employee-main');


function getEmployeeDistribution(data) {
    console.log(CalculateEmployeeStats());
    this.socket.emit('employeeDistribution', [{
      "label": "CCS",
      "value": "192"
    }, {
      "label": "AIP",
      "value": "230"
    }, {
      "label": "RADIAL",
      "value": "50"
    }, {
      "label": "PPP",
      "value": "27"
    }, {
      "label": "FALCON",
      "value": "20"
    }]);
}

function getActiveEmployeeCount(data) {
    console.log('event 2');
    this.socket.emit('employeeCount', {message: 'test'});
}


CalculateEmployeeStats = () => {
  stats = {};
  employees = [];
  ActiveClients = [];
  Employee.find({status: 'active'}).lean().exec((err, res) => {
    stats.count = res.length;
    employees = res;
    console.log(stats);
  });
  ActiveClients = getUnique(employees, 'client');
  console.log(ActiveClients);
  return stats;
}

function getUnique(arr){
  const unique = arr.map(e => e = e.company['client']);
  return unique;
// const unique =  arr.map(element=> element.company[comp]).
// map((element,index,final) =>final.indexOf(element) === index && index)
// .filter((element)=> arr[element]).map(element => arr[element]);
// return unique;
}

module.exports = {
  getActiveEmployeeCount, getEmployeeDistribution
}
