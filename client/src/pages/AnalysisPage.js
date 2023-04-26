import { useState } from 'react';
import { Container, TextField, Box, Button } from '@mui/material';
const config = require('../config.json');

export default function AnalysisPage() {

  const [zipcode, setZipcode] = useState(null);
  const [category, setCategory] = useState(null);
  const [businessScoreInfo, setBusinessScoreInfo] = useState(null);
  const [hedScoreInfo, setHedScoreInfo] = useState(null);

  const [reviewWeight, setReviewWeight] = useState(0.5);
  const [countWeight, setCountWeight] = useState(0.5);

  const [houseWeight, setHouseWeight] = useState(0.5);
  const [rentWeight, setRentWeight] = useState(0.5);
  const [homeValueHigh, setHomeValueHigh] = useState(true);
  const [rentValueHigh, setRentValueHigh] = useState(true);

  const [lFRateWeight, setLFRateWeight] = useState(0.33);
  const [householdIncomeWeight, setHouseholdIncomeWeight] = useState(0.33);
  const [povertyRateWeight, setPovertyRateWeight] = useState(0.33);

  const [educationWeight, setEducationWeight] = useState(0.33);
  const [ageWeight, setAgeWeight] = useState(0.33);
  const [highEducationalAttainment, setHighEducationalAttainment] = useState(3);
  const [agePreference, setAgePreference] = useState(2);


  const businessScore = () => {
    fetch(`http://${config.server_host}:${config.server_port}/business_score/${zipcode}/${category}` +
    `?review_weight=${reviewWeight}&count_weight=${countWeight}`)
      .then(res => res.json())
      .then(resJson => setBusinessScoreInfo(resJson));

    console.log(zipcode);
    console.log(category);
    console.log(businessScoreInfo)
  };

  const housingEconomicsDemographicsScore = () => {
    fetch(`http://${config.server_host}:${config.server_port}/housing_economics_demographics_Score/${zipcode}` +
    `?house_weight=${houseWeight}&rent_weight=${rentWeight}&home_value_high=${homeValueHigh}&rent_value_high=${rentValueHigh}` +
    `&lf_rate_weight=${lFRateWeight}&household_income_weight=${householdIncomeWeight}&poverty_rate_weight=${povertyRateWeight}` +
    `&education_weight=${educationWeight}&age_weight=${ageWeight}&high_educational_attainment=${highEducationalAttainment}` +
    `&age_preference=${agePreference}`)
      .then(res => res.json())
      .then(resJson => setHedScoreInfo(resJson));

    console.log(zipcode);
    console.log(hedScoreInfo);
  };

  return (
    <Container>
      <Box mt={10} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px'}} >
        <h2>Analyze a Zip Code by Finding the Weighted Quintile Score of the Zip Code's Livability Parameters</h2>
        <p>Enter the following parameters and search:</p>
        <TextField id="outlined-basic" label="Zipcode" variant="outlined" required inputProps={{maxLength: 5}} onChange={(e) => setZipcode(e.target.value)}/>
        {/* Change TextField to Autocomplete component */}
        <TextField id="outlined-basic" label="Category" variant="outlined" required inputProps={{maxLength: 99}} onChange={(e) => setCategory(e.target.value)}/>

        <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
          <Button variant="outlined" onClick={() => {businessScore(); housingEconomicsDemographicsScore();}} sx={{ height: 40 }}> Search </Button>
        </Box>
      </Box>
    </Container>
  );
};