
var event = function (title, location, startDate, endDate)
{
    var moment = require('moment');

    return {
        title: title,
        location: location,
        startDate: moment(startDate).format(),
        endDate: moment(endDate).format(),
    };
};

var getTestEventList = function ()
{
    var eventList = [];

    var testEvent1 = event("Test Event 1", "Test Location 1", '01/01/2017 14:00', '01/01/2017 16:00');

    eventList.push(testEvent1);

    var testEvent2 = event("Test Event 2", "Test Location 2", '01/15/2017 14:00', '01/15/2017 16:00');

    eventList.push(testEvent2);

    return eventList;

};

var iCalToEvents = function(iCalData)
{
    var iCal = require('ical.js');

    var eventList = [];

    var jCal = iCal.parse(iCalData);

    var jCalComponent = new iCal.Component(jCal);

    var jCalEvents = jCalComponent.getAllSubcomponents("vevent");

    for (var i = 0; i < jCalEvents.length; i++)
    {
        var jCalEvent = jCalEvents[i];
        var eventData = event(
            jCalEvent.getFirstPropertyValue("summary"),
            jCalEvent.getFirstPropertyValue("location"),
            jCalEvent.getFirstPropertyValue("dtstart"),
            jCalEvent.getFirstPropertyValue("dtend")
        );
        eventList.push(eventData);
    }

    return eventList;
};

var getEventListFromLocalTestICal = function ()
{
    var fs = require('fs');

    var testICalPath = ".\\data\\testCalendar.ics"

    var iCalendarData = fs.readFileSync(testICalPath, 'utf8');

    return iCalToEvents(iCalendarData);
};

var getEventList = function ()
{
    var eventList = [];

    eventList.push(getTestEventList());

    eventList.push(getEventListFromLocalTestICal());

    return eventList;
}

module.exports = getEventList;
