const fs = require('fs');
const iCal = require('ical.js')
const moment = require('moment')
const {testICalURL, testICalLocalPath, productionICalURL} = require('../../data/endpoints')

const event = (title = '', location = '', startDate, endDate) => (
  {
    title,
    location,
    startDate: moment(startDate).format(),
    endDate: moment(endDate).format()
  }
)

const getTestEventList =  (callback) => {
  
  const testEvent1 = event("Test Event 1", "Test Location 1", '01/01/2017 14:00', '01/01/2017 16:00')
  const testEvent2 = event("Test Event 2", "Test Location 2", '01/15/2017 14:00', '01/15/2017 16:00')

  callback(undefined, [testEvent1,testEvent2])
}

const iCalToEvents = (iCalData) => {

  const jCal = iCal.parse(iCalData);
  const {getAllSubcomponents} = new iCal.Component(jCal);
  const jCalEvents = getAllSubcomponents("vevent");

  const eventList = jCalEvents.map(jCalEvent => event(
    jCalEvent.getFirstPropertyValue("summary"),
    jCalEvent.getFirstPropertyValue("location"),
    jCalEvent.getFirstPropertyValue("dtstart"),
    jCalEvent.getFirstPropertyValue("dtend")
  ))
  
  return eventList
}

const getEventListFromLocalTestICal = (callback) => {
    
  fs.readFile(testICalLocalPath, 'utf8', (error, data) => {
    data ? callback(undefined, iCalToEvents(data)) : callback(error, undefined)
  })
  
}

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

            callback(undefined, eventList);
        }
    });
};

var getEventListRemoteProductionICal = function (callback)
{
    var request = require('request');
    request.get(productionICalURL, function (error, response, body)
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

            callback(undefined, eventList);
        }
    });
};

var getEventList = function (callback)
{
    var async = require('async');

    var asyncTasks = [];

    //asyncTasks.push(getTestEventList);
    //asyncTasks.push(getEventListFromLocalTestICal);
    //asyncTasks.push(getEventListRemoteTestICal);
    asyncTasks.push(getEventListRemoteProductionICal);


    async.parallel(asyncTasks, function (error, data)
    {
        var eventList = [].concat.apply([], data); //flatten arrays
        callback(eventList);
    });

}

module.exports = getEventList;


