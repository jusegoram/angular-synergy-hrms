let moment = require('moment');

function rangeToDateList(start, end) {
  let parsedStart = moment(start, 'MM/DD/YYYY');
  let parsedEnd = moment(end, 'MM/DD/YYYY');
  const dates = [];
  let currentDate = moment(start, 'MM/DD/YYYY');
  while (parsedStart.isBefore(parsedEnd)) {
    dates.push(currentDate.toDate());
    currentDate.add(1, 'days');
  }
  return dates;
}

console.log(rangeToDateList('02/01/2020', '02/10/2020'))
