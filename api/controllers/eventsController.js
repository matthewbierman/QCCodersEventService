'use strict';

var eventList = require('../models/eventModels'); //importing model

exports.getRecentAndUpcomingEvents = function (request, response)
{
    response.json(eventList());
};