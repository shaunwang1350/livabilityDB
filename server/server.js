const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/zipcode/:zipcode', routes.zipcode);
app.get('/business/:zipcode', routes.business);
app.get('/search', routes.search);
app.get('/top_business_zipcode/:category', routes.top_business_zipcode);
app.get('/us_statistics', routes.us_statistics);
app.get('/business_score/:category', routes.business_score);
app.get('/housing_score', routes.housing_score);
app.get('/economics_score', routes.economics_score);
app.get('/socio_demographics_score', routes.socio_demographics_score);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
