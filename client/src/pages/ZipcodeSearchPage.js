import { useEffect, useState } from 'react';
import { Container, TextField, Box, Button, Typography, Grid, Divider } from '@mui/material';
import zipcodeSearchCard from '../components/ZipcodeSearchCard';
const config = require('../config.json');

export default function ZipcodeSearchPage() {

  const [selectedZipcode, setselectedZipcode] = useState(null);

  const zipcodeSearchRoute = () => {
    fetch(`http://${config.server_host}:${config.server_port}/zipcodeSearch?selectedZipcode=${selectedZipcode}`)
      .then(res => res.json())
      .then(resJson => setselectedZipcode(resJson));
  };

  return (
    <Container>
      <Box mt={3} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px'}} >
        <Typography variant="h5" fontWeight={800} mb={2}>Find all housing, demographics, and economic info for a particular zip code</Typography>
        <Divider/>
        <Typography variant="body2" fontWeight={800} mb={2} mt={2} >Enter the following parameters and search:</Typography>
        <TextField id="outlined-basic" label="Zipcode" variant="outlined" required inputProps={{maxLength: 5}} onChange={(e) => setselectedZipcode(e.target.value)}/>

        <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
          <Button variant="outlined" onClick={() => zipcodeSearchRoute() } sx={{ height: 40 }}> Search </Button>
        </Box>
      </Box>

      <Box mt={3} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px'}} >
      <Typography variant="h4" fontWeight={800} >Your Zipcheck Report</Typography>
        <Grid sx={{ flexGrow: 1 }} container spacing={6} mb={2}>
          <Grid item xs={6} md={6}>
            <Typography variant="body1">zipcode</Typography>
            <Typography variant="body1">city</Typography>
            <Typography variant="body1">state</Typography>
            <Typography variant="body1">country</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography variant="body1" align="right">timezone</Typography>
            <Typography variant="body1" align="right">latitude</Typography>
            <Typography variant="body1" align="right">longitutde</Typography>
          </Grid>
        </Grid>

        <Divider/>
        <Typography variant="h5" fontWeight={800} mt={2} mb={2}>General</Typography>
        <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Total population</Typography>
            <Typography variant="body2" mb={2}>The total population in the zip code</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Poverty Rate</Typography>
            <Typography variant="body2" mb={2}>The percentage of people living in poverty in the zip code</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Unemployment Rate</Typography>
            <Typography variant="body2" mb={2}>The unemployment rate of the workers in the zip code</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Average Household Income</Typography>
            <Typography variant="body2" mb={2}>The average household income in the zip code</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Working age pop over 16</Typography>
            <Typography variant="body2" mb={2}>The population of people above 16 years old in the zip code</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Rate of civilian w/ Insurance</Typography>
            <Typography variant="body2" mb={2}>The percentage of civilian with health insurance in the zip code</Typography>
          </Grid>
        </Grid>

        <Divider/>
        <Typography variant="h5" fontWeight={800} mt={2} mb={2}>Housing</Typography>
        <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Total house units</Typography>
            <Typography variant="body2" mb={2}>The total housing units available in the zip code</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Occupied house units</Typography>
            <Typography variant="body2" mb={2}>The number of housing units that are occupied in the zip code</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Owner occupied units</Typography>
            <Typography variant="body2" mb={2}>The number of housing units that are owner-occupied in the zip code</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Renter occupied units</Typography>
            <Typography variant="body2" mb={2}>The number of housing units that are renter-occupied in the zip code</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Median Home Value</Typography>
            <Typography variant="body2" mb={2}>The median home value in the zip code</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Median Rent Value</Typography>
            <Typography variant="body2" mb={2}>The median rent value in the zip code</Typography>
          </Grid>
        </Grid>

        <Divider/>
        <Typography variant="h5" fontWeight={800} mt={2} mb={2}>Education</Typography>
        <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Pop with high school</Typography>
            <Typography variant="body2" mb={2}>The population of high school grads in the zip code</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Pop with bachelor</Typography>
            <Typography variant="body2" mb={2}>The population of people with bachelor’s degrees in the zip code</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">HS grad rate</Typography>
            <Typography variant="body2" mb={2}>The percentage of people only graduated from high school in the zip code</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Bachelor grad rate</Typography>
            <Typography variant="body2" mb={2}>The percentage of people with bachelor’s degrees in the zip code</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Combined bachelor hs rate</Typography>
            <Typography variant="body2" mb={2}>The percentage of people with bachelor’s degrees and only graduated from high school in the zip code</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Labor force participation rate</Typography>
            <Typography variant="body2" mb={2}>The labor force participation rate of the workers in the zip code</Typography>
          </Grid>
        </Grid>

        <Divider/>
        <Typography variant="h5" fontWeight={800} mt={2} mb={2}>Sex Demographics</Typography>
        <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Male female sex ratio</Typography>
            <Typography variant="body2" mb={2}>The males to 100 females ratio in the zip code</Typography>
          </Grid>

          <Grid item xs={6} md={6}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Male female sex ratio over 18</Typography>
            <Typography variant="body2" mb={2}>The males to 100 females ratio for people over 18 years old in the zip code</Typography>
          </Grid>
        </Grid>

        <Divider/>
        <Typography variant="h5" fontWeight={800} mt={2} mb={2}>Age Demographics</Typography>
        <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age under 5</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age 5 to 9</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age 10 to 14</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age 15 to 19</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age 20 to 24</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age 25 to 34</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age 35 to 44</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age 45 to 54</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age 55 to 59</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age 60 to 64</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age 65 to 74</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age 75 to 84</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age over 85</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age over 16</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age over 18</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age under 18</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age over 21</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age range 20 34</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age range 35 64</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Age over 65</Typography>
          </Grid>
        </Grid>

        <Divider/>
        <Typography variant="h5" fontWeight={800} mt={2} mb={2}>Race Demographics</Typography>
        <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Race white</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Race black</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Race native american</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Race asian</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Race asian indian</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Race asian chinese</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Race asian japanese</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Race asian korean</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Race asian vietnamese</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Race asian filipino</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Race asian pacific islander</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Race other</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Hispanic any race</Typography>
          </Grid>

          <Grid item xs={3} md={3}>
            <Typography variant="h3" mb={1}>10</Typography>
            <Typography variant="h6">Race two or more or unknown</Typography>
          </Grid>
        </Grid>

      </Box>

      <zipcodeSearchCard zipcode={selectedZipcode} handleClose={() => setselectedZipcode(null)}/>
  
    </Container>
  );
};