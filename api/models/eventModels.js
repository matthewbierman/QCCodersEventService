const fs = require('fs');
const iCal = require('ical.js')
const moment = require('moment')
const axios = require('axios')
const { testICalURL, testICalLocalPath, productionICalURL, meetupsAPIFetchEventsURL, meetupsPast10EventsQueryString, meetupsUpcoming10EventsQueryString } = require('../../data/endpoints')

const event = (source = '', title = '', description = '', location = '', startDate, endDate) => {
  return {
    source,
    title,
    description,
    location,
    startDate: startDate.format(),
    endDate: endDate.format()
  }
}

const iCalToEvents = (source, iCalData) => {
  const jCalDateFormat = "YYYY-MM-DDTHH:mm:ssZ"
  const jCal = iCal.parse(iCalData)
  const comp = new iCal.Component(jCal)
  const jCalEvents = comp.getAllSubcomponents("vevent")

  const eventList = jCalEvents.map(jCalEvent => event(
    "ical: " + source,
    jCalEvent.getFirstPropertyValue("summary"),
    '',
    jCalEvent.getFirstPropertyValue("location"),
    moment(jCalEvent.getFirstPropertyValue("dtstart").toString(), jCalDateFormat),
    moment(jCalEvent.getFirstPropertyValue("dtend").toString(), jCalDateFormat)
  ))

  return eventList
}

const meetupVenueToEventLocation = (venue) => {
  var location = ''

  if (venue != null) {
    location = venue.name
      + '\n'
      + venue.address_1
      + '\n'
      + venue.city
  }

  return location
}

const millisecondsToHours = 360000
const meetupDateFormat = "YYYY-MM-DD HH:mm Z"

const meetupStartTimeToMoment = (meetup) => moment(meetup.local_date + " " + meetup.local_time + " " + meetup.utc_offset * millisecondsToHours, meetupDateFormat)

const meetupDataToEvents = (source, data) => {
  const meetupDurationFormat = "ms";

  const eventList = data.map(meetup => event(
    'meetups: ' + source,
    meetup.name,
    meetup.description,
    meetupVenueToEventLocation(meetup.venue),
    meetupStartTimeToMoment(meetup),
    meetupStartTimeToMoment(meetup).add(meetup.duration, meetupDurationFormat)
  ))

  return eventList
}

const getEventListFromLocalTestICal = () => {
  fs.readFile(testICalLocalPath, 'utf8', (error, data) => {
    data ? callback(undefined, iCalToEvents(data)) : callback(error, undefined)
  })
}

const getEventListRemoteTestICal = () => axios.get(testICalURL)

const getEventListRemoteProductionICal = () => axios.get(productionICalURL, { responseType: 'text' })

const getPastEventListFromMeetup = () => axios.get(meetupsAPIFetchEventsURL + "?" + meetupsPast10EventsQueryString)

const getUpcomingEventListFromMeetup = () => axios.get(meetupsAPIFetchEventsURL + "?" + meetupsUpcoming10EventsQueryString)

const flattenArrays = (arrays) => [].concat.apply([], arrays);

const getEventList = () =>
  Promise.all(
    [
      getEventListRemoteProductionICal()
        .then(res => iCalToEvents('google calendar', res.data))
        .catch(e => console.log(e)),
      getPastEventListFromMeetup()
        .then(res => meetupDataToEvents('past', res.data))
        .catch(e => console.log(e)),
      getUpcomingEventListFromMeetup()
        .then(res => meetupDataToEvents('upcoming', res.data))
        .catch(e => console.log(e))
    ]
  )
    .then(res => flattenArrays(res))

module.exports = getEventList;


