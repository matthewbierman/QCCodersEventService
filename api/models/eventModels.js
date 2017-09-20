
var event = function (title, startDate, endDate)
{
    return { title: title, startDate: startDate, endDate: endDate };
};


var getEventList = function ()
{
    var eventList = [];

    var testEvent1 = event("Test Event 1", '01/01/2017 14:00', '01/01/2017 16:00');

    eventList.push(testEvent1);

    var testEvent2 = event("Test Event 2", '01/15/2017 14:00', '01/15/2017 16:00');

    eventList.push(testEvent2);

    return eventList;

};

module.exports = getEventList;
