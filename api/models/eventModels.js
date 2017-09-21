
var testICalURL = "https://calendar.google.com/calendar/ical/matthewbierman.com_qmsnneuuh1k6btlqli2ina82s4%40group.calendar.google.com/public/basic.ics"
var testICalLocalPath = ".\\data\\testCalendar.ics"

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

var getTestEventList = function (callback)
{
    var eventList = [];

    var testEvent1 = event("Test Event 1", "Test Location 1", '01/01/2017 14:00', '01/01/2017 16:00');

    eventList.push(testEvent1);

    var testEvent2 = event("Test Event 2", "Test Location 2", '01/15/2017 14:00', '01/15/2017 16:00');

    eventList.push(testEvent2);

    callback(null, eventList);

};

var iCalToEvents = function (iCalData)
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

var getEventListFromLocalTestICal = function (callback)
{
    var fs = require('fs');

    var iCalendarData = fs.readFile(
        testICalLocalPath,
        'utf8',
        function (error, data)
        {
            if (error)
            {
                callback(error, null);
            }
            else
            {
                var eventList = iCalToEvents(data);

                callback(null, eventList);
            }
        }
    );
};

var getEventListRemoteTestICal = function (callback)
{
    var request = require('request');
    request.get(testICalURL, function (error, response, body)
    {
        if (error)
        {
            callback(error, null);
        }
        else if (response.statusCode != 200)
        {
            callback("yeah, I don't know, jp?", null);
        }
        else
        {
            var eventList = iCalToEvents(body);

            callback(null, eventList);
        }
    });
};

var getEventList = function (callback)
{
    var async = require('async');

    var asyncTasks = [];

    asyncTasks.push(getTestEventList);
    asyncTasks.push(getEventListFromLocalTestICal);
    asyncTasks.push(getEventListRemoteTestICal);

    async.parallel(asyncTasks, function (error, data)
    {
        var eventList = [].concat.apply([], data); //flatten arrays
        callback(eventList);
    });

}

module.exports = getEventList;


