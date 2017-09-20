'use strict';

module.exports = function (app)
{
    var events = require('../controllers/eventsController');

    // events Routes
    app.route('/events')
        .get(events.getRecentAndUpcomingEvents)
 
};
