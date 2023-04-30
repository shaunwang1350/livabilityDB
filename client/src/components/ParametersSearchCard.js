import { useState, useEffect } from "react";
import { Modal, Box, Typography, Grid, Divider, Button } from "@mui/material";
import { nonNullVal, asianDataCheck } from "../helpers/formatter";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LabelList,
} from "recharts";

const config = require("../config.json");

export default function ParametersSearchCard({ zipcode, handleClose }) {
  const [zipcodeInfo, setZipcodeInfo] = useState([]);

  const housingData1 = zipcodeInfo
    ? [
        { name: "Total House Units", value: zipcodeInfo.total_house_units },
        {
          name: "Occupied House Units",
          value: zipcodeInfo.occupied_house_units,
        },
        {
          name: "Owner Occupied Units",
          value: zipcodeInfo.owner_occupied_units,
        },
        {
          name: "Renter Occupied Units",
          value: zipcodeInfo.renter_occupied_units,
        },
      ]
    : [];

  const housingData2 = zipcodeInfo
    ? [
        { name: "Median Home Value", value: zipcodeInfo.median_home_value },
        { name: "Median Rent value", value: zipcodeInfo.median_rent_value },
      ]
    : [];

  const ageData = zipcodeInfo
    ? [
        { name: "Under 5", value: zipcodeInfo.age_under_5 },
        { name: "5 to 9", value: zipcodeInfo.age_5_to_9 },
        { name: "10 to 14", value: zipcodeInfo.age_10_to_14 },
        { name: "15 to 19", value: zipcodeInfo.age_15_to_19 },
        { name: "20 to 24", value: zipcodeInfo.age_20_to_24 },
        { name: "25 to 34", value: zipcodeInfo.age_25_to_34 },
        { name: "35 to 44", value: zipcodeInfo.age_35_to_44 },
        { name: "45 to 54", value: zipcodeInfo.age_45_to_54 },
        { name: "55 to 59", value: zipcodeInfo.age_55_to_59 },
        { name: "60 to 64", value: zipcodeInfo.age_60_to_64 },
        { name: "65 to 74", value: zipcodeInfo.age_65_to_74 },
        { name: "75 to 84", value: zipcodeInfo.age_75_to_84 },
        { name: "Over 85", value: zipcodeInfo.age_over_85 },
      ]
    : [];

    const raceData = zipcodeInfo
    ? [
        { name: "White", value: zipcodeInfo.race_white },
        { name: "Black", value: zipcodeInfo.race_black },
        { name: "Native American", value: zipcodeInfo.race_native_american },
        { name: "Asian", value: zipcodeInfo.race_asian },
        { name: "Other", value: zipcodeInfo.race_other },
        { name: "Hispanic (any race)", value: zipcodeInfo.hispanic_any_race },
        { name: "2+ or Unknown", value: zipcodeInfo.race_two_or_more_or_unknown },
      ]
    : [];

    const asianData = zipcodeInfo
    ? [
        { name: "Indian", value: zipcodeInfo.race_asian_indian },
        { name: "Chinese", value: zipcodeInfo.race_asian_chinese },
        { name: "Japanese", value: zipcodeInfo.race_asian_japanese },
        { name: "Korean", value: zipcodeInfo.race_asian_korean },
        { name: "Vietnamese", value: zipcodeInfo.race_asian_vietnamese },
        { name: "Filipino", value: zipcodeInfo.race_asian_filipino },
        { name: "Pacific Islander", value: zipcodeInfo.race_asian_pacific_islander },
      ]
    : [];

    const eduData = zipcodeInfo
    ? [
        {
          name: "Average Bachelor Grad Rate",
          value: zipcodeInfo.bachelor_grad_rate,
        },
        {
          name: "Average High School Grad Rate",
          value: zipcodeInfo.hs_grad_rate,
        },
        {
          name: "Average Bachelor and High School Grad Rate",
          value: zipcodeInfo.combined_bachelor_hs_rate,
        },
      ]
    : [];

    const sexData = zipcodeInfo
    ? [
        {
          name: "Male To 100 Females Ratio",
          value: zipcodeInfo.male_female_sex_ratio,
        },
        {
          name: "Male to 100 Females Ratio (over 18 years old)",
          value: zipcodeInfo.male_female_sex_ratio_over_18,
        },
      ]
    : [];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#FF00FF",
    "#FF5733",
    "#00FF00",
    "#F08080",
    "#FF1493",
    "#D2B48C",
    "#D8BFD8",
    "#808000",
    "#B0C4DE",
    "#FFF8DC",
    "#FAFAD2",
    "#FFEFD5",
    "#ADD8E6",
    "#DA70D6",
    "#87CEFA",
  ];

  useEffect(() => {
    console.log("Calling card useEffect" + zipcode);
    fetch(
      `http://${config.server_host}:${config.server_port}/zipcode/${zipcode}`
    )
      .then((res) => res.json())
      .then((resJson) => setZipcodeInfo(resJson));

    console.log(zipcode);
    console.log(zipcodeInfo);
  }, []);

  const style = {
    background: "black",
    borderRadius: "16px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, 0%)",
    width: 1200,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal open={true} sx={{ overflow: "scroll" }} onClose={handleClose}>
      <Box mt={3} mb={3} p={3} sx={style}>
        <Button
          onClick={handleClose}
          style={{ left: "98.5%", transform: "translateX(-50%)" }}
        >
          Close
        </Button>
        <Typography variant="h4" fontWeight={800} mt={2}>
          Your Zipcheck Report
        </Typography>
        <Grid sx={{ flexGrow: 1 }} container spacing={6} mb={2}>
          <Grid item xs={6} md={6}>
            <Typography variant="body1">
              {nonNullVal(zipcodeInfo.zipcode)}
            </Typography>
            <Typography variant="body1">
              {nonNullVal(zipcodeInfo.city)},{" "}
              {nonNullVal(zipcodeInfo.state)}
            </Typography>
            <Typography variant="body1">
              {nonNullVal(zipcodeInfo.country)}
            </Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography variant="body1" align="right">
              Timezone:{" "}{nonNullVal(zipcodeInfo.timezone)}
            </Typography>
            <Typography variant="body1" align="right">
              Latitude:{" "}{nonNullVal(zipcodeInfo.latitude)}
            </Typography>
            <Typography variant="body1" align="right">
              Longitude:{" "}{nonNullVal(zipcodeInfo.longitude)}
            </Typography>
          </Grid>
        </Grid>

        <Divider />
        <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
          General
        </Typography>
        <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
          <Grid item xs={3} md={2}>
            <Typography variant="h3" mb={1}>
              {nonNullVal(zipcodeInfo.total_population)}
            </Typography>
            <Typography variant="h6">Total Population</Typography>
            <Typography variant="body2" mb={2}>
              The total population in the zip code
            </Typography>
          </Grid>

          <Grid item xs={3} md={2}>
            <Typography variant="h3" mb={1}>
              {nonNullVal(zipcodeInfo.labor_force_participation_rate)}%
            </Typography>
            <Typography variant="h6">Labor Force Participation Rate</Typography>
            <Typography variant="body2" mb={2}>
              The labor force participation rate of the workers in the zip code
            </Typography>
          </Grid>

          <Grid item xs={3} md={2}>
            <Typography variant="h3" mb={1}>
              {nonNullVal(zipcodeInfo.poverty_rate)}%
            </Typography>
            <Typography variant="h6">Poverty Rate</Typography>
            <Typography variant="body2" mb={2}>
              The percentage of people living in poverty in the zip code
            </Typography>
          </Grid>

          <Grid item xs={3} md={2}>
            <Typography variant="h3" mb={1}>
              {nonNullVal(zipcodeInfo.unemployment_rate)}%
            </Typography>
            <Typography variant="h6">Unemployment Rate</Typography>
            <Typography variant="body2" mb={2}>
              The unemployment rate of the workers in the zip code
            </Typography>
          </Grid>

          <Grid item xs={3} md={2}>
            <Typography variant="h3" mb={1}>
              ${nonNullVal(zipcodeInfo.average_household_income)}
            </Typography>
            <Typography variant="h6">Average Household Income</Typography>
            <Typography variant="body2" mb={2}>
              The average household income in the zip code
            </Typography>
          </Grid>

          <Grid item xs={3} md={2}>
            <Typography variant="h3" mb={1}>
              {nonNullVal(zipcodeInfo.working_age_pop_over_16)}
            </Typography>
            <Typography variant="h6">Working age pop over 16</Typography>
            <Typography variant="body2" mb={2}>
              The population of people above 16 years old in the zip code
            </Typography>
          </Grid>

          <Grid item xs={3} md={2}>
            <Typography variant="h3" mb={1}>
              {nonNullVal(zipcodeInfo.rate_of_civilian_with_insurance)}%
            </Typography>
            <Typography variant="h6">Rate of civilian w/ Insurance</Typography>
            <Typography variant="body2" mb={2}>
              The percentage of civilian with health insurance in the zip code
            </Typography>
          </Grid>
        </Grid>

        {/* Housing Data */}
              <Divider />
              <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
                Housing
              </Typography>
              { 
              
              housingData1.length > 0 && <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2} mt={2}>
                                <Grid item xs={6} md={6}>
                  <Typography variant="h6">
                    Total House Units broken down into categories
                  </Typography>
                  <Typography variant="body2" mb={2}>
                    The following barchart inclues the total house units broken down into occupied house units, owner occupied units, and renter occupied units.
                  </Typography>
                </Grid>
                <BarChart
                  width={700 + housingData1.length * 100}
                  height={300}
                  data={housingData1}
                  margin={{ top: 5, right: 30, left: 20, bottom: 10}}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9 }}
                  />
                  <YAxis
                    domain={[
                      0,
                      Math.ceil(
                        Math.max(...housingData1.map((d) => d.value)) * 1.1
                      ),
                    ]}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    name="Housing 1"
                    fill="#8884d8"
                    barSize={80}
                  >
                    {housingData1.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                    <LabelList dataKey="value" position="top" />
                  </Bar>
                </BarChart>
              </Grid>}

              { housingData2.length > 0 && <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
                
              <Grid item xs={6} md={6}>
                  <Typography variant="h6">
                      Value of homes
                  </Typography>
                  <Typography variant="body2" mb={2}>
                    This bar char compares the value of rental units to that of home values.
                  </Typography>
                </Grid>
                <BarChart
                  width={900 + housingData2.length * 100}
                  height={300}
                  data={housingData2}
                  margin={{ top: 5, right: 30, left: 20, bottom: 10 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9 }}
                  />
                  <YAxis
                    domain={[
                      0,
                      Math.ceil(
                        Math.max(...housingData2.map((d) => d.value)) * 1.1
                      ),
                    ]}
                  />{" "}
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    name="Housing 2"
                    fill="#8884d8"
                    barSize={80}
                  >
                    {housingData2.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                    <LabelList dataKey="value" position="top" />
                  </Bar>
                </BarChart>
              </Grid>}
        {/* Housing Data */}

        {/* Education Demographics */}
        <Divider />
        <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
          Education Demographics
        </Typography>
        { eduData.length > 0 && <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <Grid item xs={6} md={6}>
                  <Typography variant="body2" mb={2}>
                    This bar chart compares the number of HS graduates, bachelor graduates, and its combined score.
                  </Typography>
                </Grid>
                  <BarChart
                    width={800 + eduData.length * 100}
                    height={300}
                    data={eduData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 10 }}
                  >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9 }}
              />
              <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
              <Tooltip />
              <Bar
                dataKey="value"
                name="Education"
                fill="#8884d8"
                barSize={80}
              >
                {eduData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                <LabelList dataKey="value" position="top" />
              </Bar>
            </BarChart>
          </Grid>
        </Box>}
        {/* Education Demographics */}

        {/* Sex Demographics */}
        <Divider />
        <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
          Sex Demographics
        </Typography>
        { sexData.length > 0 && <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
                        <Grid item xs={6} md={6}>
                  <Typography variant="body2" mb={2}>
                    This bar char compares the distribution of male to female within the zipcode.
                  </Typography>
                </Grid>
                <BarChart
                  width={800 + eduData.length * 100}
                  height={300}
                  data={sexData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 10 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9}}
                  />
            <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />{" "}
            <Tooltip />
            <Bar dataKey="value" name="Sex Ratio" fill="#8884d8" barSize={80}>
              {sexData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              <LabelList dataKey="value" position="top" />
            </Bar>
          </BarChart>
        </Grid>}
        {/* Sex Demographics */}

        {/* Race Demographics */}
        <Divider />
        <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
          Race Demographics
        </Typography>
                      <Grid item xs={6} md={6}>
                  <Typography variant="body2" mb={2}>
                    This pie chart breaks down all of the races into categories.
                  </Typography>
                </Grid>
        { raceData.length > 0 && <Grid
          container
          spacing={8}
          sx={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item>
            <Box margin={4}>
              {" "}
              {/* Adjust the value 2 to change the margin */}
                    <PieChart width={400} height={400}>
                      <Tooltip />
                      <Pie
                        data={raceData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        label
                      >
                  {raceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </Box>
          </Grid>
        </Grid>}

        {asianDataCheck(asianData) && <Grid>
        <Divider />
        <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
          Breakdown of the Asian Demographics
        </Typography>
                      <Grid item xs={6} md={6}>
                  <Typography variant="body2" mb={2}>
                    This pie chart breaks down the category of asians.
                  </Typography>
                </Grid>
          <Grid container spacing={8} sx={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }} >
          <Grid item>
            <Box margin={4}>
              {" "}
              {/* Adjust the value 2 to change the margin */}
                    <PieChart width={400} height={400}>
                      <Tooltip />
                      <Pie
                        data={asianData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        label
                      >
                  {asianData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </Box>
          </Grid>
        </Grid>
        </Grid>}
        {/* Race Demographics */}

        {/* Age Demographics */}
        <Divider />
        <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
          Age Demographics
        </Typography>
        <Grid item xs={6} md={6}>
                  <Typography variant="body2" mb={2}>
                    This pie chart breaksdown all of the age groups within this zipcode.
                  </Typography>
                </Grid>
        { ageData.length > 0 && <Grid
          container
          spacing={8}
          sx={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item>
            <Box margin={4}>
              {" "}
              {/* Adjust the value 2 to change the margin */}
                    <PieChart width={500} height={500}>
                      <Tooltip />
                      <Pie
                        data={ageData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={200}
                        fill="#8884d8"
                        label
                      >
                  {ageData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </Box>
          </Grid>
        </Grid>}
        {/* Age Demographics */}
      </Box>
    </Modal>
  );
}
