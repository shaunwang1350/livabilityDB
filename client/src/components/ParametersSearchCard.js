import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Grid, Divider, Button } from '@mui/material';
import { nonNullVal } from '../helpers/formatter';

const config = require('../config.json');

export default function ParametersSearchCard({zipcode, handleClose}) {

    const [zipcodeInfo, setZipcodeInfo] = useState([]);

    useEffect(() => {
        console.log("Calling card useEffect" + zipcode);
        fetch(`http://${config.server_host}:${config.server_port}/zipcode/${zipcode}`)
          .then(res => res.json())
          .then(resJson => setZipcodeInfo(resJson));
    
        console.log(zipcode);
        console.log(zipcodeInfo);
      },[]);

    const style = {
    background: 'black', 
    borderRadius: '16px', 
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, 0%)', 
    width: 1600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    };
  
    return (
      <Modal
        open={true}
        sx={{overflow:'scroll'}}
        onClose={handleClose}
      >
        <Box mt={3} mb={3} p={3} sx={style} >
        <Button onClick={handleClose} style={{ left: '98.5%', transform: 'translateX(-50%)' }}>
          Close
        </Button>
        <Typography variant="h4" fontWeight={800} mt={2} >Your Zipcheck Report</Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={6} mb={2}>
            <Grid item xs={6} md={6}>
              <Typography variant="body1">{nonNullVal(zipcodeInfo.zipcode)}</Typography>
              <Typography variant="body1">{nonNullVal(zipcodeInfo.city)}</Typography>
              <Typography variant="body1">{nonNullVal(zipcodeInfo.state)}</Typography>
              <Typography variant="body1">{nonNullVal(zipcodeInfo.country)}</Typography>
            </Grid>
            <Grid item xs={6} md={6}>
              <Typography variant="body1" align="right">{nonNullVal(zipcodeInfo.timezone)}</Typography>
              <Typography variant="body1" align="right">{nonNullVal(zipcodeInfo.latitude)}</Typography>
              <Typography variant="body1" align="right">{nonNullVal(zipcodeInfo.longitutde)}</Typography>
            </Grid>
          </Grid>
  
          <Divider/>
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>General</Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.total_population)}</Typography>
              <Typography variant="h6">Total population</Typography>
              <Typography variant="body2" mb={2}>The total population in the zip code</Typography>
            </Grid>
  
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.poverty_rate)}</Typography>
              <Typography variant="h6">Poverty Rate</Typography>
              <Typography variant="body2" mb={2}>The percentage of people living in poverty in the zip code</Typography>
            </Grid>
  
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.unemployment_rate)}</Typography>
              <Typography variant="h6">Unemployment Rate</Typography>
              <Typography variant="body2" mb={2}>The unemployment rate of the workers in the zip code</Typography>
            </Grid>
  
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.average_household_income)}</Typography>
              <Typography variant="h6">Average Household Income</Typography>
              <Typography variant="body2" mb={2}>The average household income in the zip code</Typography>
            </Grid>
  
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.working_age_pop_over_16)}</Typography>
              <Typography variant="h6">Working age pop over 16</Typography>
              <Typography variant="body2" mb={2}>The population of people above 16 years old in the zip code</Typography>
            </Grid>
  
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.rate_of_civilian_with_insurance)}</Typography>
              <Typography variant="h6">Rate of civilian w/ Insurance</Typography>
              <Typography variant="body2" mb={2}>The percentage of civilian with health insurance in the zip code</Typography>
            </Grid>
          </Grid>
  
          <Divider/>
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>Housing</Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={1} mb={2}>
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.total_house_units)}</Typography>
              <Typography variant="h6">Total house units</Typography>
              <Typography variant="body2" mb={2}>The total housing units available in the zip code</Typography>
            </Grid>
  
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.occupied_house_units)}</Typography>
              <Typography variant="h6">Occupied house units</Typography>
              <Typography variant="body2" mb={2}>The number of housing units that are occupied in the zip code</Typography>
            </Grid>
  
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.owner_occupied_units)}</Typography>
              <Typography variant="h6">Owner occupied units</Typography>
              <Typography variant="body2" mb={2}>The number of housing units that are owner-occupied in the zip code</Typography>
            </Grid>
  
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.renter_occupied_units)}</Typography>
              <Typography variant="h6">Renter occupied units</Typography>
              <Typography variant="body2" mb={2}>The number of housing units that are renter-occupied in the zip code</Typography>
            </Grid>
  
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.median_home_value)}</Typography>
              <Typography variant="h6">Median Home Value</Typography>
              <Typography variant="body2" mb={2}>The median home value in the zip code</Typography>
            </Grid>
  
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.median_rent_value)}</Typography>
              <Typography variant="h6">Median Rent Value</Typography>
              <Typography variant="body2" mb={2}>The median rent value in the zip code</Typography>
            </Grid>
          </Grid>
  
          <Divider/>
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>Education</Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.pop_with_high_school)}</Typography>
              <Typography variant="h6">Pop with high school</Typography>
              <Typography variant="body2" mb={2}>The population of high school grads in the zip code</Typography>
            </Grid>
  
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.pop_with_bachelor)}</Typography>
              <Typography variant="h6">Pop with bachelor</Typography>
              <Typography variant="body2" mb={2}>The population of people with bachelor’s degrees in the zip code</Typography>
            </Grid>
  
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.hs_grad_rate)}</Typography>
              <Typography variant="h6">HS grad rate</Typography>
              <Typography variant="body2" mb={2}>The percentage of people only graduated from high school in the zip code</Typography>
            </Grid>
  
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.bachelor_grad_rate)}</Typography>
              <Typography variant="h6">Bachelor grad rate</Typography>
              <Typography variant="body2" mb={2}>The percentage of people with bachelor’s degrees in the zip code</Typography>
            </Grid>
  
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.combined_bachelor_hs_rate)}</Typography>
              <Typography variant="h6">Combined bachelor hs rate</Typography>
              <Typography variant="body2" mb={2}>The percentage of people with bachelor’s degrees and only graduated from high school in the zip code</Typography>
            </Grid>
  
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.labor_force_participation_rate)}</Typography>
              <Typography variant="h6">Labor force participation rate</Typography>
              <Typography variant="body2" mb={2}>The labor force participation rate of the workers in the zip code</Typography>
            </Grid>
          </Grid>
  
          <Divider/>
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>Sex Demographics</Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.male_female_sex_ratio)}</Typography>
              <Typography variant="h6">Male female sex ratio</Typography>
              <Typography variant="body2" mb={2}>The males to 100 females ratio in the zip code</Typography>
            </Grid>
  
            <Grid item xs={3} md={2}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.male_female_sex_ratio_over_18)}</Typography>
              <Typography variant="h6">Male female sex ratio over 18</Typography>
              <Typography variant="body2" mb={2}>The males to 100 females ratio for people over 18 years old in the zip code</Typography>
            </Grid>
          </Grid>
  
          <Divider/>
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>Age Demographics</Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_under_5)}</Typography>
              <Typography variant="h6">Age under 5</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_5_to_9)}</Typography>
              <Typography variant="h6">Age 5 to 9</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_10_to_14)}</Typography>
              <Typography variant="h6">Age 10 to 14</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_15_to_19)}</Typography>
              <Typography variant="h6">Age 15 to 19</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_20_to_24)}</Typography>
              <Typography variant="h6">Age 20 to 24</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_25_to_34)}</Typography>
              <Typography variant="h6">Age 25 to 34</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_35_to_44)}</Typography>
              <Typography variant="h6">Age 35 to 44</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_45_to_54)}</Typography>
              <Typography variant="h6">Age 45 to 54</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_55_to_59)}</Typography>
              <Typography variant="h6">Age 55 to 59</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_60_to_64)}</Typography>
              <Typography variant="h6">Age 60 to 64</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_65_to_74)}</Typography>
              <Typography variant="h6">Age 65 to 74</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_75_to_84)}</Typography>
              <Typography variant="h6">Age 75 to 84</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_over_85)}</Typography>
              <Typography variant="h6">Age over 85</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_over_16)}</Typography>
              <Typography variant="h6">Age over 16</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_over_18)}</Typography>
              <Typography variant="h6">Age over 18</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_under_16)}</Typography>
              <Typography variant="h6">Age under 18</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_over_21)}</Typography>
              <Typography variant="h6">Age over 21</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_range_20_34)}</Typography>
              <Typography variant="h6">Age 20 to 34</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_range_35_64)}</Typography>
              <Typography variant="h6">Age 35 to 64</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.age_over_65)}</Typography>
              <Typography variant="h6">Age over 65</Typography>
            </Grid>
          </Grid>
  
          <Divider/>
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>Race Demographics</Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.race_white)}</Typography>
              <Typography variant="h6">Race white</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.race_black)}</Typography>
              <Typography variant="h6">Race black</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.race_native_american)}</Typography>
              <Typography variant="h6">Race native american</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.race_asian)}</Typography>
              <Typography variant="h6">Race asian</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.race_asian)}</Typography>
              <Typography variant="h6">Race asian indian</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.race_asian_chinese)}</Typography>
              <Typography variant="h6">Race asian chinese</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.race_asian_japanese)}</Typography>
              <Typography variant="h6">Race asian japanese</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.race_asian_korean)}</Typography>
              <Typography variant="h6">Race asian korean</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.race_asian_vietnamese)}</Typography>
              <Typography variant="h6">Race asian vietnamese</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.race_asian_filipino)}</Typography>
              <Typography variant="h6">Race asian filipino</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.race_asian_pacific_islander)}</Typography>
              <Typography variant="h6">Race asian pacific islander</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.race_other)}</Typography>
              <Typography variant="h6">Race other</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.hispanic_any_race)}</Typography>
              <Typography variant="h6">Hispanic any race</Typography>
            </Grid>
  
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>{nonNullVal(zipcodeInfo.race_two_or_more_or_unknown)}</Typography>
              <Typography variant="h6">Race two or more or unknown</Typography>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    );
}