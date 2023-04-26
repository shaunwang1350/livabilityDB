import { useEffect, useState } from 'react';
import { Container, TextField, Box, Button } from '@mui/material';
import ZipcodeSearchCard from '../components/ZipcodeSearchCard';
const config = require('../config.json');

export default function ParametersSearchPage() {
  const [zipcodeInfo, setZipcodeInfo] = useState(null);

  const [medianHomeValue, setMedianHomeValue] = useState([10000, 2000000]);
  const [medianRentValue, setMedianRentValue] = useState([3500, 100]);
  const [avgHouseholdIncome, setAvgHouseholdIncome] = useState([250000, 2500]);
  const [ageUnder18, setAgeUnder18] = useState([100, 0]);
  const [ageRange20_34, setAgeRange20_34] = useState([100, 0]);
  const [ageRange35_64, setAgeRange35_64] = useState([100, 0]);
  const [ageOver65, setAgeOver65] = useState([100, 0]);
  const [bachelorGradRate, setBachelorGradRate] = useState([100, 0]);
  const [hsGradRate, setHsGradRate] = useState([100, 0]);

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

  return (
    <Container>
      <Box mt={10} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px'}} >
        <h2>Search for Zip Codes based on Livability Parameters</h2>
        <p>Enter the following parameters and search:</p>
        <TextField id="outlined-basic" label="Zipcode" variant="outlined" required inputProps={{maxLength: 5}} onChange={(e) => setZipcode(e.target.value)}/>

        <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
          <Button variant="outlined" onClick={() => search() } sx={{ height: 40 }}> Search </Button>
        </Box>
      </Box>
    </Container>
  );
};