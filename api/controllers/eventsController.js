const eventList = require('../models/eventModels')

const getRecentAndUpcomingEvents = (request, response) => {
  eventList(
    function (data) {
      response.json(data);
    }
  )
}

module.exports = {getRecentAndUpcomingEvents}