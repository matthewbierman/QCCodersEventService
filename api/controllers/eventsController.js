'use strict';

var eventList = require('../models/eventModels'); //importing model

exports.getRecentAndUpcomingEvents = function (request, response)
{
    eventList(
        function (data)
        {
            response.json(data);
        }
    );
};