const fs = require('fs');
const iCal = require('ical.js')
const moment = require('moment')
const axios = require('axios');
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
  const comp = new iCal.Component(jCal);
  const jCalEvents = comp.getAllSubcomponents("vevent");

  const eventList = jCalEvents.map(jCalEvent => event(
    jCalEvent.getFirstPropertyValue("summary"),
    jCalEvent.getFirstPropertyValue("location"),
    jCalEvent.getFirstPropertyValue("dtstart"),
    jCalEvent.getFirstPropertyValue("dtend")
  ))
  
  return eventList
}

const getEventListFromLocalTestICal = () => {
    
  fs.readFile(testICalLocalPath, 'utf8', (error, data) => {
    data ? callback(undefined, iCalToEvents(data)) : callback(error, undefined)
  })

}

const getEventListRemoteTestICal = () => {
    
  return axios.get(testICalURL)

}

const getEventListRemoteProductionICal = () => {

  return axios.get(productionICalURL, {responseType: 'text'})

}

const getEventList = () => {
   
    //getTestEventList()
    //getEventListFromLocalTestICal()
    //getEventListRemoteTestICal()
    return getEventListRemoteProductionICal()
    .then(res => iCalToEvents(res.data))
    .catch(e => console.log(e))

}

module.exports = getEventList;


