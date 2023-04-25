import {Grid, Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const config = require('../config.json');

export default function HomePage() {
  const navigate = useNavigate();
  const handleClick = (url) => {
    navigate(url);
  };

  return (
    <Box ml={7} display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
    >
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>

          <Typography variant="h3" fontWeight={700} mb={4}>
          Find out more than you know about your zipcode.
          </Typography>

          <Typography variant="h6" mb={1}>
          Zipcode Report helps you to generate reports that include displaying housing, demographics, and economic information for a given zipcode, displaying business information for a given zipcode, and searching for a zipcode based on specific livability parameters.
          </Typography>

          <Typography variant="h6" mb={4}>
          It can also find the top N zipcodes with the highest average review score and number of businesses for a specific business category, calculate the mean statistics of livability parameters across all US zip codes, and score zipcodes based on various factors such as home value/rent, age/education, economic indicators, and business review star/count. 
          These functions help users evaluate and compare different areas based on relevant factors to make informed decisions.
          </Typography>
          
          <Button
            variant="outlined"
            color="primary"
            sx={{ width: '200px', fontSize: '16px' }}
            onClick={() => handleClick("/zipcodeSearch")}
          >
            Search now
          </Button>

        </Grid>
        <Grid item xs={12} md={6}>
        </Grid>
      </Grid>
    </Box>
  );
};