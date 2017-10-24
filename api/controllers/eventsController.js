const getEventList = require('../models/eventModels')

const getRecentAndUpcomingEvents = (request, response) => {

  getEventList().then(data => response.json(data))

}

module.exports = {getRecentAndUpcomingEvents}