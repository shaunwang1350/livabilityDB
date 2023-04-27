import { useEffect, useState } from 'react';
import {Grid, Box, Button, Typography, Divider, Fade} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { nonNullVal } from '../helpers/formatter';
import bgimg from '../images/bkvector.png';

const config = require('../config.json');

export default function HomePage() {
  
  const navigate = useNavigate();
  const handleClick = (url) => { navigate(url);};

  const [stats, setStats] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/us_statistics`)
      .then(res => res.json())
      .then(resJson => setStats(resJson));
  }, []);

  return (
    <Fade in={show}>
    <Grid>
      <Box m={7} display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="70vh"
      >
        <Grid container spacing={8}>
          <Grid item xs={12} md={6}>

            <Typography variant="h3" fontWeight={800} mb={4}>
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
          <Grid item xs={12} md={4}>
            <img src={bgimg} alt="My Team" width="650" sx={{'border-radius' : '2%'}}/>
          </Grid>
        </Grid>
      </Box>

      
      <Box mt={3} mb={3} ml={5} mr={5} p={5} sx={{ background: 'black', borderRadius: '16px', boxShadow: 24}} >
        <Typography variant="h5" fontWeight={800} mb={2}>Statistics across all US Zip Codes</Typography>

        <Divider/>
        <Typography variant="h5" fontWeight={800} mt={2} mb={2}>Housing</Typography>
        <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_home_value)}</Typography>
          <Typography variant="h6">Average US home value</Typography>
          <Typography variant="body2" mb={2}>Mean home value across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_house_occupancy_rate)}</Typography>
          <Typography variant="h6">Average US house occupancy rate</Typography>
          <Typography variant="body2" mb={2}>Mean house occupancy rate across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_household_income)}</Typography>
          <Typography variant="h6">Average US household income</Typography>
          <Typography variant="body2" mb={2}>Mean household income across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_owner_occupancy_rate)}</Typography>
          <Typography variant="h6">Average US owner occupancy rate</Typography>
          <Typography variant="body2" mb={2}>Mean owner occupancy rate across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_renter_occupancy_rate)}</Typography>
          <Typography variant="h6">Average US renter occupancy rate</Typography>
          <Typography variant="body2" mb={2}>Mean renter occupancy rate across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_rent_value)}</Typography>
          <Typography variant="h6">Average US rent value</Typography>
          <Typography variant="body2" mb={2}>Mean rent value across all US zip codes</Typography>
          </Grid>
        </Grid>

        <Divider/>
        <Typography variant="h5" fontWeight={800} mt={2} mb={2}>Education</Typography>
        <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_bachelor_grad_percentage)}</Typography>
          <Typography variant="h6">Average US bachelor grad percentage</Typography>
          <Typography variant="body2" mb={2}>Mean bachelor’s degree grad percentage across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_hs_grad_percentage)}</Typography>
          <Typography variant="h6">Average US hs grad percentage</Typography>
          <Typography variant="body2" mb={2}>Mean high school grad percentage across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_combined_bachelor_hs_percentage)}</Typography>
          <Typography variant="h6">Average US combined bachelor hs percentage</Typography>
          <Typography variant="body2" mb={2}>Average US combined bachelor percentage across all US zip codes</Typography>
          </Grid>
        </Grid>

        <Divider/>
        <Typography variant="h5" fontWeight={800} mt={2} mb={2}>Age Demographics</Typography>
        <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_children_percentage)}</Typography>
          <Typography variant="h6">Average US children percentage</Typography>
          <Typography variant="body2" mb={2}>Mean children percentage across all US zip codes</Typography>
          </Grid> 

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_young_adults_percentage)}</Typography>
          <Typography variant="h6">Average US young adults percentage</Typography>
          <Typography variant="body2" mb={2}>Mean young adult percentage across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_middle_age_percentage)}</Typography>
          <Typography variant="h6">Average US middle age percentage</Typography>
          <Typography variant="body2" mb={2}>Mean middle age adult percentage across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_seniors_percentage)}</Typography>
          <Typography variant="h6">Average US seniors percentage</Typography>
          <Typography variant="body2" mb={2}>Mean senior percentage across all US zip codes</Typography>
          </Grid>
        </Grid>

        <Divider/>
        <Typography variant="h5" fontWeight={800} mt={2} mb={2}>Race Demographics</Typography>
        <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_asian_percentage)}</Typography>
          <Typography variant="h6">Average US asian percentage</Typography>
          <Typography variant="body2" mb={2}>Mean asian percentage across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_black_percentage)}</Typography>
          <Typography variant="h6">Average US black percentage</Typography>
          <Typography variant="body2" mb={2}>Mean black percentage across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_chinese_percentage)}</Typography>
          <Typography variant="h6">Average US chinese percentage</Typography>
          <Typography variant="body2" mb={2}>Mean chinese percentage across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_filipino_percentage)}</Typography>
          <Typography variant="h6">Average US filipino percentage</Typography>
          <Typography variant="body2" mb={2}>Mean filipino percentage across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_hispanic_any_race_percentage)}</Typography>
          <Typography variant="h6">Average US hispanic any race percentage</Typography>
          <Typography variant="body2" mb={2}>Mean hispanic (any race) percentage across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_indian_percentage)}</Typography>
          <Typography variant="h6">Average US indian percentage</Typography>
          <Typography variant="body2" mb={2}>Mean indian percentage across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_japanese_percentage)}</Typography>
          <Typography variant="h6">Average US japanese percentage</Typography>
          <Typography variant="body2" mb={2}>Mean japanese percentage across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_korean_percentage)}</Typography>
          <Typography variant="h6">Average US korean percentage</Typography>
          <Typography variant="body2" mb={2}>Mean korean percentage across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_native_american_percentage)}</Typography>
          <Typography variant="h6">Average US native american percentage</Typography>
          <Typography variant="body2" mb={2}>Mean native american percentage across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_other_percentage)}</Typography>
          <Typography variant="h6">Average US other percentage</Typography>
          <Typography variant="body2" mb={2}>Mean other race percentage across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_white_percentag)}</Typography>
            <Typography variant="h6">Average US white percentage</Typography>
            <Typography variant="body2" mb={2}>Mean white percentage across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_pacific_islander_percentage)}</Typography>
          <Typography variant="h6">Average US pacific islander percentage</Typography>
          <Typography variant="body2" mb={2}>Mean pacific islander percentage across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us_vietnamese_percentage)}</Typography>
          <Typography variant="h6">Average US vietnamese percentage</Typography>
          <Typography variant="body2" mb={2}>Mean vietnamese percentage across all US zip codes</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
          <Typography variant="h3" mb={1}>{nonNullVal(stats.avg_us__or_more_or_unknown_percentage)}</Typography>
          <Typography variant="h6">Average US race two or more or unknown percentage</Typography>
          <Typography variant="body2" mb={2}>Mean two or more or unknown race percentage across all US zip codes</Typography>
          </Grid>
        </Grid>
      </Box>
    </Grid>
      </Fade>
  );
};