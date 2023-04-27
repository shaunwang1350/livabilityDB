import { useState, useEffect } from 'react';
import { Container, TextField, Box, Button, Typography, Divider, Autocomplete, Grid, Slider} from '@mui/material';
const config = require('../config.json');

export default function AnalysisPage() {

  const [zipcode, setZipcode] = useState(null);
  const [category, setCategory] = useState(null);

  const [fourPartSlider, setFourPartSlider] = useState([0.25, 0.5, 0.75]);
  const [businessScoreWeight, setBusinessScoreWeight] = useState(0.25);
  const [housingScoreWeight, setHousingScoreWeight] = useState(0.25);
  const [economicsScoreWeight, setEconomicsScoreWeight] = useState(0.25);
  const [demographicsScoreWeight, setDemographicsScoreWeight] = useState(0.25);

  const [reviewWeight, setReviewWeight] = useState(0.5);
  const [countWeight, setCountWeight] = useState(0.5);

  const [homeWeight, setHomeWeight] = useState(0.5);
  const [rentWeight, setRentWeight] = useState(0.5);
  const [homeValueHigh, setHomeValueHigh] = useState(true);
  const [rentValueHigh, setRentValueHigh] = useState(true);

  const [threePartSlider, setThreePartSlider] = useState([0.34, 0.67]);
  const [lFRateWeight, setLFRateWeight] = useState(0.34);
  const [householdIncomeWeight, setHouseholdIncomeWeight] = useState(0.33);
  const [povertyRateWeight, setPovertyRateWeight] = useState(0.33);

  const [educationWeight, setEducationWeight] = useState(0.5);
  const [ageWeight, setAgeWeight] = useState(0.5);
  const [highEducationalAttainment, setHighEducationalAttainment] = useState(3);
  const [agePreference, setAgePreference] = useState(2);

  const [allCategories, setAllCategories] = useState([]);

  const [businessScoreInfo, setBusinessScoreInfo] = useState(null);
  const [hedScoreInfo, setHedScoreInfo] = useState(null);

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
    `?home_weight=${homeWeight}&rent_weight=${rentWeight}&home_value_high=${homeValueHigh}&rent_value_high=${rentValueHigh}` +
    `&lf_rate_weight=${lFRateWeight}&household_income_weight=${householdIncomeWeight}&poverty_rate_weight=${povertyRateWeight}` +
    `&education_weight=${educationWeight}&age_weight=${ageWeight}&high_educational_attainment=${highEducationalAttainment}` +
    `&age_preference=${agePreference}`)
      .then(res => res.json())
      .then(resJson => setHedScoreInfo(resJson));

    console.log(zipcode);
    console.log(hedScoreInfo);
  };

  const defaultProps = {
    options: allCategories,
    getOptionLabel: (option) => option.name,
  };

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/business_category`)
      .then(res => res.json())
      .then(resJson => setAllCategories(resJson));
  }, []);


  return (
    <Container>
      <Box mt={10} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px'}} >
        <Typography variant="h5" fontWeight={800} mb={2}>Analyze a Zip Code by Finding the Weighted Quintile Score of the Zip Code's Livability Parameters</Typography>
        <Divider/>
        <Typography variant="body2" fontWeight={800} mb={2} mt={2} >Enter the following parameters and search:</Typography>
        <TextField id="outlined-basic" label="Zipcode" variant="outlined" required inputProps={{maxLength: 5}} onChange={(e) => setZipcode(e.target.value)}/>
        <Autocomplete
          {...defaultProps}
          value = {category}
          onInputChange={(event, newInputValue) => {
            setCategory(newInputValue);
            console.log(newInputValue);
          }}
          disablePortal
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Business Categories"/>}
        />

        <Typography variant="h6" fontWeight={400} mb={2} mt={2} >Preference Weight for Business Parameters</Typography>
        <Grid sx={{ flexGrow: 1 }} container spacing={6} mb={2}>
          <Grid item xs={6} md={6}>
            <Box sx={{ width: 400 }} pl={2}>
              <Slider
                value={reviewWeight}
                onChange={(event, newValue) => {setReviewWeight(newValue); setCountWeight(1 - newValue)}}
                step={0.01}
                valueLabelDisplay="auto"
                marks={[
                  { value: 0, label: '0%'},
                  { value: 0.5, label: 'Review Star / No. of Business'},
                  { value: 1, label: '100%'},
                ]}
                min={0}
                max={1}
              />
            </Box>
          </Grid>
        </Grid>

        <Grid item xs={6} md={6}>
          <Box sx={{ width: 400 }} pl={2}>
            <Slider
              value={homeWeight}
              onChange={(e, newValue) => {setHomeWeight(newValue); setRentWeight(1 - newValue)}}
              step={0.01}
              valueLabelDisplay="auto"
              marks={[
                { value: 0, label: '0%'},
                { value: 0.5, label: 'Home Price / Rent Price'},
                { value: 1, label: '100%'},
              ]}
              min={0}
              max={1}
            />
          </Box>
        </Grid>

        <Grid item xs={6} md={6}>
          <Box sx={{ width: 400 }} pl={2}>
            <Slider
              value={educationWeight}
              onChange={(e, newValue) => {setEducationWeight(newValue); setAgeWeight(1 - newValue)}}
              step={0.01}
              valueLabelDisplay="auto"
              marks={[
                { value: 0, label: '0%'},
                { value: 0.5, label: 'Educational Attainment / Age Distribution'},
                { value: 1, label: '100%'},
              ]}
              min={0}
              max={1}
            />
          </Box>
        </Grid>

        <Grid item xs={6} md={6}>
          <Box sx={{ width: 400 }} pl={2}>
            <Slider
              value={threePartSlider}
              onChange={(e, newValue) => {
                setThreePartSlider(newValue); 
                setLFRateWeight(newValue[0]); 
                setHouseholdIncomeWeight(newValue[1] - newValue[0]);
                setPovertyRateWeight(1 - newValue[1]);
              }}
              step={0.01}
              valueLabelDisplay="auto"
              marks={[
                { value: 0, label: '0%'},
                { value: 0.5, label: 'Labor Force / Household Income / Poverty Rate'},
                { value: 1, label: '100%'},
              ]}
              min={0}
              max={1}
              disableSwap
            />
          </Box>
        </Grid>

        <Grid item xs={6} md={6}>
          <Box sx={{ width: 400 }} pl={2}>
            <Slider
              value={fourPartSlider}
              onChange={(e, newValue) => {
                setFourPartSlider(newValue); 
                setBusinessScoreWeight(newValue[0]); 
                setHousingScoreWeight(newValue[1] - newValue[0]);
                setEconomicsScoreWeight(newValue[2] - newValue[1]);
                setDemographicsScoreWeight(1 - newValue[2]);
              }}
              step={0.01}
              valueLabelDisplay="auto"
              marks={[
                { value: 0, label: '0%'},
                { value: 0.5, label: 'Business / Housing / Economics / Demographics'},
                { value: 1, label: '100%'},
              ]}
              min={0}
              max={1}
              disableSwap
            />
          </Box>
        </Grid>

        <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
          <Button variant="outlined" onClick={() => {businessScore(); housingEconomicsDemographicsScore();}} sx={{ height: 40 }}> Search </Button>
        </Box>
      </Box>
    </Container>
  );
};