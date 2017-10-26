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

const getEventListRemoteTestICal = () => axios.get(testICalURL)

const getEventListRemoteProductionICal = () => axios.get(productionICalURL, {responseType: 'text'})

const getEventList = () =>
   
    //getEventListFromLocalTestICal()
    //getEventListRemoteTestICal()
    getEventListRemoteProductionICal()
    .then(res => iCalToEvents(res.data))
    .catch(e => console.log(e))

module.exports = getEventList;


