const events = require('../controllers/eventsController')

module.exports = (app) => app.route('/events').get(events.getRecentAndUpcomingEvents)
