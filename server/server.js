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
app.get('/business_score/:zipcode/:category', routes.business_score);
app.get('/housing_economics_demographics_score/:zipcode', routes.housing_economics_demographics_score);
app.get('/business_category', routes.business_category);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
