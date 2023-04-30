import { useState, useEffect } from 'react';
import { Container, TextField, Box, Button, Typography, Divider, Autocomplete, 
  Grid, Slider, Switch, InputLabel, Select, MenuItem, FormControl, Fade} from '@mui/material';
import { isInvalidZipCodeInput, isInvalidBusinessCategory, roundDecimals, formatBoolean, formatScore, 
  nonNullVal, calcCombinedScore } from '../helpers/formatter';
const config = require('../config.json');

export default function AnalysisPage() {

  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  const [allCategories, setAllCategories] = useState([]);

  const [showResult, setShowResult] = useState(false);
  const [showResultSecond, setShowResultSecond] = useState(false);
  const [invalidZipCodeInput, setInvalidZipCodeInput] = useState(false);
  const [invalidBusinessCategory, setInvalidBusinessCategory] = useState(false);

  const [zipcode, setZipcode] = useState(null);
  const [category, setCategory] = useState();

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

  const [businessScoreInfo, setBusinessScoreInfo] = useState(null);
  const [hedScoreInfo, setHedScoreInfo] = useState(null);

  const businessScore = () => {
    const invalidZC = isInvalidZipCodeInput(zipcode)
    const invalidBC = isInvalidBusinessCategory(category)
    setInvalidZipCodeInput(invalidZC);
    setInvalidBusinessCategory(invalidBC);

    if (invalidZC || invalidBC) {
      return;
    }

    fetch(`http://${config.server_host}:${config.server_port}/business_score/${zipcode}/${category}` +
    `?review_weight=${reviewWeight}&count_weight=${countWeight}`)
      .then(res => res.json())
      .then(resJson => setBusinessScoreInfo(resJson));

      setShowResultSecond(true);
    console.log(zipcode);
    console.log(category);
    console.log(businessScoreInfo)
  };

  const housingEconomicsDemographicsScore = () => {
    const invalidZC = isInvalidZipCodeInput(zipcode)
    const invalidBC = isInvalidBusinessCategory(category)
    setInvalidZipCodeInput(invalidZC);
    setInvalidBusinessCategory(invalidBC);

    if (invalidZC || invalidBC) {
      return;
    }

    fetch(`http://${config.server_host}:${config.server_port}/housing_economics_demographics_Score/${zipcode}` +
    `?home_weight=${homeWeight}&rent_weight=${rentWeight}&home_value_high=${homeValueHigh}&rent_value_high=${rentValueHigh}` +
    `&lf_rate_weight=${lFRateWeight}&household_income_weight=${householdIncomeWeight}&poverty_rate_weight=${povertyRateWeight}` +
    `&education_weight=${educationWeight}&age_weight=${ageWeight}&high_educational_attainment=${highEducationalAttainment}` +
    `&age_preference=${agePreference}`)
      .then(res => res.json())
      .then(resJson => setHedScoreInfo(resJson));

      setShowResult(true);
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
    <Fade in={show}>
    <Container>
      <Box mt={5} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px', boxShadow: 24}} >
        <Typography variant="h5" fontWeight={800} mb={2}>Analyze a Zip Code by Finding the Weighted Quintile Score of the Zip Code's Livability Parameters</Typography>
        <Divider/>
        <Typography variant="body2" fontWeight={800} mb={8} mt={2} >Enter the following parameters and search:</Typography>
        
        <Grid sx={{ flexGrow: 1 }} container spacing={6} mb={5}>
          <Box sx={{ width: 400 }} pl={6}>
            <TextField id="outlined-basic" label="Zipcode" variant="outlined" required inputProps={{maxLength: 5}} onChange={(e) => setZipcode(e.target.value)}/>
            {invalidZipCodeInput && <Box><Typography variant="p" fontWeight={100} mb={2} mt={2}>Missing/Invalid Input for Zip Code</Typography></Box>}
          </Box>
          <Box sx={{ width: 400 }} pl={28}>
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
            {invalidBusinessCategory && <Box><Typography variant="p" fontWeight={100} mb={2} mt={2}>Missing Input for Business Category</Typography></Box>}
          </Box>
        </Grid>

        <Grid sx={{ flexGrow: 1 }} container spacing={6} mb={2}>
          <Grid item xs={6} md={6} align='left'>
            <Box sx={{ width: 500 }}>
              <Typography variant="body1" fontWeight={600} mb={2}>Preference Weight for Housing Parameters</Typography>
              <Grid sx={{ flexGrow: 1 }} container spacing={6} mb={2}>
                <Grid item xs={6} md={7} align='right' >
                  <Box sx={{ width: 320 }} pl={2}>
                    <Slider
                      value={homeWeight}
                      onChange={(e, newValue) => {setHomeWeight(newValue); setRentWeight(roundDecimals(1 - newValue))}}
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
                <Grid item xs={3} md={4} align='right' >
                  <Box sx={{ width: 400 }} pl={7} align='left'>
                  <Typography variant='caption'>Home Weight: {homeWeight}</Typography>
                  </Box>
                  <Box sx={{ width: 400 }} pl={7} align='left'>
                  <Typography variant='caption'>Rent Weight: {rentWeight}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={6} md={6} align='left' >
            <Box sx={{ width: 500 }}>
              <Typography variant="body1" fontWeight={600} mb={2}>Preference Weight for Business Parameters</Typography>
              <Grid sx={{ flexGrow: 1 }} container spacing={6} mb={2}>
                <Grid item xs={6} md={7} align='right' >
                  <Box sx={{ width: 320 }} pl={2}>
                    <Slider
                      value={reviewWeight}
                      onChange={(event, newValue) => {setReviewWeight(newValue); setCountWeight(roundDecimals(1 - newValue))}}
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
                <Grid item xs={3} md={4} align='right' >
                  <Box sx={{ width: 400 }} pl={7} align='left'>
                  <Typography variant='caption'>Review Weight: {reviewWeight}</Typography>
                  </Box>
                  <Box sx={{ width: 400 }} pl={7} align='left'>
                  <Typography variant='caption'>Count Weight: {countWeight}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

        </Grid>

        <Grid sx={{ flexGrow: 1 }} container spacing={6} mb={2}>
          <Grid item xs={6} md={6} align='left'>
            <Box sx={{ width: 400 }}>
              <Typography variant="body1" fontWeight={600} mb={2} mt={2}>Preference for High Home Values</Typography>
              <Box sx={{ width: 400 }} align='center' pl={6}>
                <Switch
                  checked={homeValueHigh}
                  onChange={(event) => {setHomeValueHigh(event.target.checked)}}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
                <Typography variant="p" mb={2}>{formatBoolean(homeValueHigh)}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={3} md={3} align='left' >
            <Box sx={{ width: 400 }}>
              <Typography variant="body1" fontWeight={600} mb={2} mt={2} >Preference for High Rent Values</Typography>
              <Box sx={{ width: 400 }} align='center' pl={6}> 
                <Switch
                  checked={rentValueHigh}
                  onChange={(event) => {setRentValueHigh(event.target.checked)}}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
                <Typography variant="p" mb={2}>{formatBoolean(rentValueHigh)}</Typography>
              </Box> 
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body1" fontWeight={600} mb={2} mt={2} align='left' >Preference Weight for Demographics Parameters</Typography>
        <Grid sx={{ flexGrow: 1 }} container spacing={6} mb={2}>
          <Grid item xs={6} md={6} align='left' >
            <Box sx={{ width: 400 }} pl={2}>
              <Slider
                value={educationWeight}
                onChange={(e, newValue) => {setEducationWeight(newValue); setAgeWeight(roundDecimals(1 - newValue))}}
                step={0.01}
                valueLabelDisplay="auto"
                marks={[
                  { value: 0, label: '0%'},
                  { value: 0.5, label: 'Educational Attainment / Age Demographics'},
                  { value: 1, label: '100%'},
                ]}
                min={0}
                max={1}
              />
            </Box>
          </Grid>
          <Grid item xs={4} md={3} align='left' >
            <Box sx={{ width: 400 }}>
              <Typography variant='caption'>Education Weight: {educationWeight}</Typography>
            </Box>
            <Box sx={{ width: 400 }}>
              <Typography variant='caption'>Age Weight: {ageWeight}</Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid sx={{ flexGrow: 1 }} container spacing={6} mb={2}>
          <Grid item xs={6} md={6} align='left' >
            <Box sx={{ width: 400 }}>
              <Typography variant="body1" fontWeight={600} mb={2} mt={2} >Preference for Educational Attainment</Typography>
              <FormControl fullWidth>
                <InputLabel id="education">Educational Attainment</InputLabel>
                <Select
                  labelId="education"
                  value={highEducationalAttainment}
                  label="Educational Attainment"
                  onChange={(event) => {setHighEducationalAttainment(event.target.value)}}
                >
                  <MenuItem value={1}>Bachelor's Degree Grads</MenuItem>
                  <MenuItem value={2}>High School Grads</MenuItem>
                  <MenuItem value={3}>Combination</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={3} md={3} align='left' >
            <Box sx={{ width: 400 }}>
              <Typography variant="body1" fontWeight={600} mb={2} mt={2} >Preference for Age Demographics</Typography>
              <FormControl fullWidth>
                <InputLabel id="age">Age Demographics</InputLabel>
                <Select
                  labelId="age"
                  value={agePreference}
                  label="Age Demographics"
                  onChange={(event) => {setAgePreference(event.target.value)}}
                >
                  <MenuItem value={1}>Child Friendly</MenuItem>
                  <MenuItem value={2}>Young Adults</MenuItem>
                  <MenuItem value={3}>Middle Age Adults</MenuItem>
                  <MenuItem value={4}>Senior Adults</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body1" fontWeight={600} mb={2} mt={2} align='left' >Preference Weight for Economics Parameters</Typography>
        <Grid sx={{ flexGrow: 1 }} container spacing={6} mb={2}>
          <Grid item xs={6} md={6} align='left' >
            <Box sx={{ width: 400 }} pl={2}>
              <Slider
                value={threePartSlider}
                onChange={(e, newValue) => {
                  setThreePartSlider(newValue); 
                  setLFRateWeight(newValue[0]); 
                  setHouseholdIncomeWeight(roundDecimals(newValue[1] - newValue[0]));
                  setPovertyRateWeight(roundDecimals(1 - newValue[1]));
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
          <Grid item xs={6} md={6} align='left' >
            <Box sx={{ width: 400 }}>
              <Typography variant="caption" >Labor Force Weight: {lFRateWeight}</Typography>
              <Typography variant="caption" pl={7}>
              Household Income Weight: {householdIncomeWeight}
              </Typography>
            </Box>
            <Box sx={{ width: 400 }}>
              <Typography variant="caption" >
              Poverty Rate Weight: {povertyRateWeight}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body1" fontWeight={600} mb={2} mt={2} align='left' >Preference Weight for the Scores</Typography>
        <Grid sx={{ flexGrow: 1 }} container spacing={6} mb={2}>
          <Grid item xs={6} md={6} align='left' >
            <Box sx={{ width: 400 }} display="flex" pl={2} >
              <Slider
                value={fourPartSlider}
                onChange={(e, newValue) => {
                  setFourPartSlider(newValue); 
                  setBusinessScoreWeight(newValue[0]); 
                  setHousingScoreWeight(roundDecimals(newValue[1] - newValue[0]));
                  setEconomicsScoreWeight(roundDecimals(newValue[2] - newValue[1]));
                  setDemographicsScoreWeight(roundDecimals(1 - newValue[2]));
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
          <Grid item xs={3} md={3} align='left' >
            <Box sx={{ width: 500 }}>
            <Typography variant='caption'>Business Score Weight: {businessScoreWeight}</Typography>
            <Typography variant='caption' pl={4.5}>Housing Score Weight: {housingScoreWeight}</Typography>
            </Box>
            <Box sx={{ width: 500 }}>
            <Typography variant='caption'>Economics Score Weight: {economicsScoreWeight}</Typography>
            <Typography variant='caption' pl={3}>Demographics Score Weight: {demographicsScoreWeight}</Typography>
            </Box>

          </Grid>
        </Grid>

        <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
          <Button variant="outlined" onClick={() => {businessScore(); housingEconomicsDemographicsScore();}} sx={{ height: 40 }}> Search </Button>
        </Box>
      </Box>

      {hedScoreInfo && businessScoreInfo && <Fade in={showResultSecond}>
      <Box mt={3} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px', boxShadow: 24}} >
          <Typography variant="h4" fontWeight={800} >Your Zipcheck Report</Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={6} mb={2}>
            <Grid item xs={6} md={6}>
              <Typography variant="body1">{nonNullVal(hedScoreInfo.zipcode)}</Typography>
              <Typography variant="body1">{nonNullVal(hedScoreInfo.city)}</Typography>
              <Typography variant="body1">{nonNullVal(hedScoreInfo.state)}</Typography>
            </Grid>
          </Grid>
        
        <Divider/>
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>Combined Analysis & Scores</Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {formatScore(calcCombinedScore(
                  businessScoreWeight, businessScoreInfo.final_weighted_score,
                  housingScoreWeight, hedScoreInfo.final_weighted_housing_score,
                  economicsScoreWeight, hedScoreInfo.final_economic_weighted_score,
                  demographicsScoreWeight, hedScoreInfo.final_weighted_socio_demographic_score))}
              </Typography>
              <Typography variant="h6">Final Weighted Combined Score</Typography>
              <Typography variant="body2" mb={2}>Final aggregate score after applying weights to across all housing, economics, socio-demographic scores for your zipcode, scale: 1-5</Typography>
            </Grid>
          </Grid>
        </Box>
      </Fade>}

      {hedScoreInfo && <Fade in={showResult}>
        <Box mt={3} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px', boxShadow: 24}} >
          <Divider/>
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>Housing Analysis & Scores</Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>{formatScore(hedScoreInfo.final_weighted_housing_score)}</Typography>
              <Typography variant="h6">Final Weighted Housing Score</Typography>
              <Typography variant="body2" mb={2}>Final housing score after applying weights to home_value_score and rent_value_score, scale: 1-5</Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>${nonNullVal(hedScoreInfo.median_home_value)}</Typography>
              <Typography variant="h6">Median Home Value</Typography>
              <Typography variant="body2" mb={2}>Median home value for a zip code</Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>${nonNullVal(hedScoreInfo.median_rent_value)}</Typography>
              <Typography variant="h6">Median Rent Value</Typography>
              <Typography variant="body2" mb={2}>The quintile score for monthly rent value which is the quintile of median_rent_value of the zip code, scale: 1-5</Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>{nonNullVal(hedScoreInfo.home_value_score)}</Typography>
              <Typography variant="h6">Home Value Score</Typography>
              <Typography variant="body2" mb={2}>The quintile score for home value which is the quintile of median_home_value of the zip code, scale: 1-5</Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>{nonNullVal(hedScoreInfo.rent_value_score)}</Typography>
              <Typography variant="h6">Rent Value Score</Typography>
              <Typography variant="body2" mb={2}>Median rent value for a zip code</Typography>
            </Grid>
          </Grid>
        </Box>
      </Fade>}
      
      {hedScoreInfo && <Fade in={showResult}>
        <Box mt={3} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px', boxShadow: 24}} >
          <Divider/>
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>Economics Analysis & Scores</Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>{formatScore(hedScoreInfo.final_economic_weighted_score)}</Typography>
              <Typography variant="h6">Final Economic Weighted Score</Typography>
              <Typography variant="body2" mb={2}>Final Economic score after applying weights to labor_force_score, household_income_score and poverty_rate_score, scale: 1-5</Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>{nonNullVal(hedScoreInfo.labor_force_participation_rate)}</Typography>
              <Typography variant="h6">Labor Force Participation Rate</Typography>
              <Typography variant="body2" mb={2}>Labor force participation rate for a zip code</Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>${nonNullVal(hedScoreInfo.average_household_income)}</Typography>
              <Typography variant="h6">Average Household Income</Typography>
              <Typography variant="body2" mb={2}>Average household income for a zip code</Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>{nonNullVal(hedScoreInfo.poverty_rate)}</Typography>
              <Typography variant="h6">Poverty Rate</Typography>
              <Typography variant="body2" mb={2}>Poverty rate for a zip code</Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>{nonNullVal(hedScoreInfo.labor_force_score)}</Typography>
              <Typography variant="h6">Labor Force Score</Typography>
              <Typography variant="body2" mb={2}>Quintile score for labor force participation rate which is the quintile of labor_force_participation_rate of the zip code, scale: 1-5</Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>{nonNullVal(hedScoreInfo.household_income_score)}</Typography>
              <Typography variant="h6">Household Income Score</Typography>
              <Typography variant="body2" mb={2}>Quintile score for household income which is the quintile of average_household_income of the zip code, scale: 1-5</Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>{nonNullVal(hedScoreInfo.poverty_rate_score)}</Typography>
              <Typography variant="h6">Poverty Rate Score</Typography>
              <Typography variant="body2" mb={2}>Quintile score for poverty rate which is the quintile of poverty_rate of the zip code, scale: 1-5</Typography>
            </Grid>
          </Grid>
        </Box>
      </Fade>}

      {hedScoreInfo && <Fade in={showResult}>
        <Box mt={3} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px', boxShadow: 24}} >
          <Divider/>
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>Socio-Demographics Analysis & Scores</Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>{formatScore(hedScoreInfo.final_weighted_socio_demographic_score)}</Typography>
              <Typography variant="h6">Final Weighted Socio Demographic Score</Typography>
              <Typography variant="body2" mb={2}>Final Socio-Demographic score after applying weights to education_score and age_score, scale: 1-5</Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>{nonNullVal(hedScoreInfo.education_rate)}</Typography>
              <Typography variant="h6">Education Rate</Typography>
              <Typography variant="body2" mb={2}>Education completion rate for a zip code depending on user selection: 1: High School, 2: Bachelor’s, 3: High School and Bachelor’s</Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>{nonNullVal(hedScoreInfo.age_range_rate)}</Typography>
              <Typography variant="h6">Age Range Rate</Typography>
              <Typography variant="body2" mb={2}>Age range percentage for a zip code depending on user selection: 1 - Young: 0-18, 2 - Young Adults: 20-34, 3 - Middle-Aged Adults: 35-64 and 4 - Older People: over 65)</Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>{nonNullVal(hedScoreInfo.education_score)}</Typography>
              <Typography variant="h6">Education Score</Typography>
              <Typography variant="body2" mb={2}>Quintile score for user-selected education level of the zip code, scale: 1-5</Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>{nonNullVal(hedScoreInfo.age_score)}</Typography>
              <Typography variant="h6">Age Score</Typography>
              <Typography variant="body2" mb={2}>Quintile score for user-selected age range of the zip code, scale: 1-5</Typography>
            </Grid>
          </Grid>
        </Box>
      </Fade>}

      {businessScoreInfo && <Fade in={showResultSecond}>
        <Box mt={3} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px', boxShadow: 24}} >
        <Divider/>
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>Business Analysis & Scores</Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>{formatScore(businessScoreInfo.final_weighted_score)}</Typography>
              <Typography variant="h6">Final Weighted Business Score</Typography>
              <Typography variant="body2" mb={2}>The final weighted score represents the livability score (out of 5) for the zip code based on the weight that users have on the average review star of the business and/or number of businesses for a particular category. 1 is the lowest and 5 is the highest.</Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>{nonNullVal(businessScoreInfo.cat_avg_stars)}</Typography>
              <Typography variant="h6">Cat Average Stars</Typography>
              <Typography variant="body2" mb={2}>The average review stars of businesses in a particular category in the zip code</Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>{nonNullVal(businessScoreInfo.category_count)}</Typography>
              <Typography variant="h6">Category Count</Typography>
              <Typography variant="body2" mb={2}>The number of business in a particular category in the zip code</Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>{nonNullVal(businessScoreInfo.review_score)}</Typography>
              <Typography variant="h6">Reviews Score</Typography>
              <Typography variant="body2" mb={2}>The quintile score of the average review stars for businesses in a particular category within the zip code. This quintile score represents how average review stars of this category of businesses rank compared to that of all zip codes. Higher average review stars will result in higher quintile scores. 1 is the lowest and 5 is the highest. </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>{nonNullVal(businessScoreInfo.cat_count_score)}</Typography>
              <Typography variant="h6">Category Count Score</Typography>
              <Typography variant="body2" mb={2}>The quintile score of the number of businesses in a particular category within the zip code. This quintile score represents how the number of businesses in this category rank compared to that of all zip codes. Higher number of businesses will result in higher quintile scores. 1 is the lowest and 5 is the highest.</Typography>
            </Grid>
          </Grid>
        </Box>
      </Fade>}
    </Container>
    </Fade>
  );
};