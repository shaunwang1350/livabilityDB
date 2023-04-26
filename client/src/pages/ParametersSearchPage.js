import { useEffect, useState } from 'react';
import { Container, Box, Button, Typography, Divider, Grid, Slider} from '@mui/material';
const config = require('../config.json');

export default function ParametersSearchPage() {

  const [zipcodeInfo, setZipcodeInfo] = useState(null);

  const [medianHomeValue, setMedianHomeValue] = useState([380000 , 1550000]);
  const [medianRentValue, setMedianRentValue] = useState([800, 2800]);
  const [avgHouseholdIncome, setAvgHouseholdIncome] = useState([50000, 200000]);
  const [ageUnder18, setAgeUnder18] = useState([20, 80]);
  const [ageRange20_34, setAgeRange20_34] = useState([20, 80]);
  const [ageRange35_64, setAgeRange35_64] = useState([20, 80]);
  const [ageOver65, setAgeOver65] = useState([20, 80]);
  const [bachelorGradRate, setBachelorGradRate] = useState([20, 80]);
  const [hsGradRate, setHsGradRate] = useState([20, 80]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search`)
      .then(res => res.json())
      .then(resJson => setZipcodeInfo(resJson));
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search` + 
    `?median_home_value_low=${medianHomeValue[0]}&median_home_value_high=${medianHomeValue[1]}` +
    `&median_rent_value_low=${medianRentValue[0]}&median_rent_value_high=${medianRentValue[1]}` +
    `&avg_household_income_low=${avgHouseholdIncome[0]}&avg_household_income_high=${avgHouseholdIncome[1]}` +
    `&age_under_18_low=${ageUnder18[0]}&age_under_18_high=${ageUnder18[1]}` +
    `&age_range_20_34_low=${ageRange20_34[0]}&age_range_20_34_high=${ageRange20_34[1]}` +
    `&age_range_35_64_low=${ageRange35_64[0]}&age_range_35_64_high=${ageRange35_64[1]}` +
    `&age_over_65_low=${ageOver65[0]}&age_over_65_high=${ageOver65[1]}` +
    `&bachelor_grad_rate_low=${bachelorGradRate[0]}&bachelor_grad_rate_high=${bachelorGradRate[1]}` +
    `&hs_grad_rate_low=${hsGradRate[0]}&hs_grad_rate_high=${hsGradRate[1]}`)
      .then(res => res.json())
      .then(resJson => setZipcodeInfo(resJson));

    console.log(medianHomeValue);
    console.log(medianRentValue);
    console.log(avgHouseholdIncome);
    console.log(ageUnder18);
    console.log(ageRange20_34);
    console.log(ageRange35_64);
    console.log(ageOver65);
    console.log(bachelorGradRate);
    console.log(hsGradRate);
    console.log(zipcodeInfo);
  }

  const marksMedianHomeValue = [
    { value: 1000, label: '$10000'},
    { value: 1005000, label: 'Median Home Value'},
    { value: 2000000, label: '$2000000'},
  ];

  const marksMedianRentValue = [
    { value: 100, label: '$100'},
    { value: 1800, label: 'Median Rent Value'},
    { value: 3500, label: '$3500'},
  ];

  const marksAvgHouseholdIncome = [
    { value: 2500, label: '$2500'},
    { value: 126250, label: 'Avg Household Income'},
    { value: 250000, label: '$250000'},
  ];

  const marksAgeUnder18 = [
    { value: 0, label: '0%'},
    { value: 50, label: 'Age Under 18'},
    { value: 100, label: '100%'},
  ];

  const marksAgeRange20_34 = [
    { value: 0, label: '0%'},
    { value: 50, label: 'Age 20-34'},
    { value: 100, label: '100%'},
  ];

  const marksAgeRange35_64 = [
    { value: 0, label: '0%'},
    { value: 50, label: 'Age 35-64'},
    { value: 100, label: '100%'},
  ];

  const marksAgeOver65 = [
    { value: 0, label: '0%'},
    { value: 50, label: 'Age Over 65'},
    { value: 100, label: '100%'},
  ];

  const marksBachelorGradRate = [
    { value: 0, label: '0%'},
    { value: 50, label: 'Bachelor Grad Rate'},
    { value: 100, label: '100%'},
  ];

  const marksHsGradRate = [
    { value: 0, label: '0%'},
    { value: 50, label: 'High School Grad Rate'},
    { value: 100, label: '100%'},
  ];


  return (
    <Container>
      <Box mt={10} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px'}} >
        <Typography variant="h5" fontWeight={800} mb={2}>Search for Zip Codes based on Livability Parameters</Typography>
        <Divider/>
        <Typography variant="body2" fontWeight={800} mb={2} mt={2} >Enter the following parameters and search:</Typography>
        
        <Grid sx={{ flexGrow: 1 }} container spacing={6} mb={2}>
          <Grid item xs={6} md={6}>
            <Box sx={{ width: 400 }} pl={2}>
              <Slider
                value={medianHomeValue}
                onChange={(e, newValue) => setMedianHomeValue(newValue)}
                valueLabelDisplay="auto"
                marks={marksMedianHomeValue}
                min={1000}
                max={2000000}
              />
            </Box>
          </Grid>

          <Grid item xs={6} md={6}>
            <Box sx={{ width: 400 }} pl={2}>
              <Slider
                value={medianRentValue}
                onChange={(e, newValue) => setMedianRentValue(newValue)}
                step={1}
                valueLabelDisplay="auto"
                marks={marksMedianRentValue}
                min={100}
                max={3500}
              />
            </Box>
          </Grid>

    
          <Grid item xs={6} md={6}>
            <Box sx={{ width: 400 }} pl={2}>
              <Slider
                value={avgHouseholdIncome}
                onChange={(e, newValue) => setAvgHouseholdIncome(newValue)}
                step={1}
                valueLabelDisplay="auto"
                marks={marksAvgHouseholdIncome}
                min={2500}
                max={250000}
              />
            </Box>
          </Grid>

          <Grid item xs={6} md={6}>
            <Box sx={{ width: 400 }} pl={2}>
              <Slider
                value={ageUnder18}
                onChange={(e, newValue) => setAgeUnder18(newValue)}
                step={1}
                valueLabelDisplay="auto"
                marks={marksAgeUnder18}
              />
            </Box>
          </Grid>

          <Grid item xs={6} md={6}>
            <Box sx={{ width: 400 }} pl={2}>
              <Slider
                value={ageRange20_34}
                onChange={(e, newValue) => setAgeRange20_34(newValue)}
                step={1}
                valueLabelDisplay="auto"
                marks={marksAgeRange20_34}
              />
            </Box>
          </Grid>

          <Grid item xs={6} md={6}>
            <Box sx={{ width: 400 }} pl={2}>
              <Slider
                value={ageRange35_64}
                onChange={(e, newValue) => setAgeRange35_64(newValue)}
                step={1}
                valueLabelDisplay="auto"
                marks={marksAgeRange35_64}
              />
            </Box>
          </Grid>

          <Grid item xs={6} md={6}>
            <Box sx={{ width: 400 }} pl={2}>
              <Slider
                value={ageOver65}
                onChange={(e, newValue) => setAgeOver65(newValue)}
                step={1}
                valueLabelDisplay="auto"
                marks={marksAgeOver65}
              />
            </Box>
          </Grid>

          <Grid item xs={6} md={6}>
            <Box sx={{ width: 400 }} pl={2}>
              <Slider
                value={bachelorGradRate}
                onChange={(e, newValue) => setBachelorGradRate(newValue)}
                step={1}
                valueLabelDisplay="auto"
                marks={marksBachelorGradRate}
              />
            </Box>
          </Grid>

          <Grid item xs={6} md={6}>
            <Box sx={{ width: 400 }} pl={2}>
              <Slider
                value={hsGradRate}
                onChange={(e, newValue) => setHsGradRate(newValue)}
                step={1}
                valueLabelDisplay="auto"
                marks={marksHsGradRate}
              />
            </Box>
          </Grid>
        </Grid>

        <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
          <Button variant="outlined" onClick={() => search() } sx={{ height: 40 }}> Search </Button>
        </Box>
      </Box>

      {zipcodeInfo && <Box mt={10} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px'}} >

        

      </Box>}

    </Container>
  );
};