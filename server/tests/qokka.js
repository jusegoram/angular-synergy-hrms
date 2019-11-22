function calculateTimeDifference(startTime, endTime) {
  if (startTime < endTime) return (endTime - startTime);
  if (startTime > endTime) return (1440 - startTime + endTime);
}





var item =
    [
        { day: 0, onShift: true, scheduledHours: 5},
        { day: 1, onShift: true , scheduledHours: 5},
        { day: 2, onShift: true , scheduledHours: 5},
        { day: 3, onShift: true , scheduledHours: 5},
        { day: 4, onShift: true , scheduledHours: 5},
        { day: 5, onShift: true , scheduledHours: 0},
        { day: 6, onShift: true , scheduledHours: 0},
    ]

var shifts = [
    {shift:1 , startDate: new Date('10/10/2019')},
    {shift:2 , startDate: new Date('11/10/2019')},
    {shift:3 , startDate: new Date('12/10/2019')},
    {shift:4 , startDate: new Date('09/10/2019')},
    {shift:5 , startDate: new Date('08/10/2019')},
    {shift:6 , startDate: new Date('07/10/2019')},
    {shift:7 , startDate: new Date('06/10/2019')},
]

var current;
var sortedShifts = shifts.sort((a, b) => a.startDate < b.startDate);

var result = sortedShifts.forEach((i, index) => {
    if (i.startDate > new Date()) current = sortedShifts[index === sortedShifts.length - 1 ? index : index + 1];
  })





let stringTest = 'Day Off'
console.log(0 > 0);

console.log(item);