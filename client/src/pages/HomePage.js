import {Grid, Box, Button, Typography } from '@mui/material';
const config = require('../config.json');

export default function HomePage() {

  return (
    // <Container>
    //   <h2>Welcome to Zipcheck, (call to action)</h2>
    //   <p> Zipcode Report helps you to generate reports that include displaying housing, demographics, and economic information for a given zipcode, displaying business information for a given zipcode, and searching for a zipcode based on specific livability parameters. </p>
    //   <p> It can also find the top N zipcodes with the highest average review score and number of businesses for a specific business category, calculate the mean statistics of livability parameters across all US zip codes, and score zipcodes based on various factors such as home value/rent, age/education, economic indicators, and business review star/count.  </p>
    //   <p> These functions help users evaluate and compare different areas based on relevant factors to make informed decisions. </p>
    
    //   <p>Created by Golden Meekats</p>
    // </Container>

    <Box ml={7} display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh">
      <Grid container spacing={6} >
        <Grid item xs={12} md={7}>

          <Typography variant="h3" fontWeight={700} >
          Welcome to Zipcheck, (call to action)
          </Typography>

          <Typography variant="h6" >
          Zipcode Report helps you to generate reports that include displaying housing, demographics, and economic information for a given zipcode, displaying business information for a given zipcode, and searching for a zipcode based on specific livability parameters.
          It can also find the top N zipcodes with the highest average review score and number of businesses for a specific business category, calculate the mean statistics of livability parameters across all US zip codes, and score zipcodes based on various factors such as home value/rent, age/education, economic indicators, and business review star/count. 
          These functions help users evaluate and compare different areas based on relevant factors to make informed decisions.
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '200px', fontSize: '16px' }}
          >
            Search now
          </Button>

        </Grid>
        <Grid item xs={12} md={5}>
          <img alt="My Team"/>
        </Grid>
      </Grid>
    </Box>
  );
};