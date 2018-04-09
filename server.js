var express = require('express'),
    cors = require('cors'),
    app = express(),
    port = process.env.PORT || 3000;

app.use(cors())

var routes = require('./api/routes/eventRoutes'); //importing route
routes(app); //register the route


app.listen(port);

console.log('server started on: ' + port);