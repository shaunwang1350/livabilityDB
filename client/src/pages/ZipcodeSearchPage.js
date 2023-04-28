import React, { useRef, useEffect, useState } from "react";
import ReactMapGL from "react-map-gl";

import {
  Container,
  TextField,
  Box,
  Button,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
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

import { nonNullVal } from "../helpers/formatter";
const config = require("../config.json");

export default function ZipcodeSearchPage() {
  const [zipcode, setZipcode] = useState(null);
  const [zipcodeInfo, setZipcodeInfo] = useState(null);
  const [location, setLocation] = useState(null);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  const housingData1 = zipcodeInfo
    ? [
        { name: "Total house units", value: zipcodeInfo.total_house_units },
        {
          name: "Occupied house units",
          value: zipcodeInfo.occupied_house_units,
        },
        {
          name: "Owner occupied units",
          value: zipcodeInfo.owner_occupied_units,
        },
        {
          name: "Renter occupied units",
          value: zipcodeInfo.renter_occupied_units,
        },
      ]
    : [];

  const housingData2 = zipcodeInfo
    ? [
        { name: "Median Home Value", value: zipcodeInfo.median_home_value },
        {
          name: "Median Rent value",
          value: zipcodeInfo.median_home_value,
        },
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
        { name: "Race white", value: zipcodeInfo.race_white },
        { name: "Race black", value: zipcodeInfo.race_black },
        {
          name: "Race native american",
          value: zipcodeInfo.race_native_american,
        },
        { name: "Race asian", value: zipcodeInfo.race_asian },
        { name: "Race asian indian", value: zipcodeInfo.race_asian_indian },
        { name: "Race asian chinese", value: zipcodeInfo.race_asian_chinese },
        { name: "Race asian japanese", value: zipcodeInfo.race_asian_japanese },
        { name: "Race asian korean", value: zipcodeInfo.race_asian_korean },
        {
          name: "Race asian vietnamese",
          value: zipcodeInfo.race_asian_vietnamese,
        },
        { name: "Race asian filipino", value: zipcodeInfo.race_asian_filipino },
        {
          name: "Race asian pacific islander",
          value: zipcodeInfo.race_asian_pacific_islander,
        },
        { name: "Race other", value: zipcodeInfo.race_other },
        { name: "Hispanic any race", value: zipcodeInfo.hispanic_any_race },
        {
          name: "Race two or more or unknown",
          value: zipcodeInfo.race_two_or_more_or_unknown,
        },
      ]
    : [];

  const eduData = zipcodeInfo
    ? [
        {
          name: "Average US bachelor grad percantage",
          value: zipcodeInfo.bachelor_grad_rate,
        },
        {
          name: "Average US hs grad percentage",
          value: zipcodeInfo.hs_grad_rate,
        },
        {
          name: "Average US combined bachelor hs percentage",
          value: zipcodeInfo.combined_bachelor_hs_rate,
        },
        {
          name: "Labor force participation rate",
          value: zipcodeInfo.labor_force_participation_rate,
        },
      ]
    : [];

  const edu2Data = zipcodeInfo
    ? [
        {
          name: "Population with bachelor Degree",
          value: zipcodeInfo.pop_with_bachelor,
        },
        {
          name: "Population with High School Diploma",
          value: zipcodeInfo.pop_with_high_school,
        },
      ]
    : [];

  const sexData = zipcodeInfo
    ? [
        {
          name: "Male female sex ratio",
          value: zipcodeInfo.male_female_sex_ratio,
        },
        {
          name: "Male female sex ratio over 18",
          value: zipcodeInfo.male_female_sex_ratio_over_18,
        },
      ]
    : [];

  // const COLORS = ["#8884d8", "#82ca9d"];
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

  const zipcodeSearchRoute = () => {
    fetch(
      `http://${config.server_host}:${config.server_port}/zipcode/${zipcode}`
    )
      .then((res) => res.json())
      .then((resJson) => setZipcodeInfo(resJson));

    console.log(zipcode);
    console.log(zipcodeInfo);
  };

  // useEffect(() => {
  //   if (map.current) return; // initialize map only once
  //   map.current = new mapboxgl.Map({
  //     container: mapContainer.current,
  //     style: "mapbox://styles/mapbox/streets-v12",
  //     center: [lng, lat],
  //     zoom: zoom,
  //   });
  // });

  return (
    <Container>
      <Box
        mt={10}
        mb={3}
        p={3}
        sx={{ background: "black", borderRadius: "16px" }}
      >
        <Typography variant="h5" fontWeight={800} mb={2}>
          Find all housing, demographics, and economic info for a particular zip
          code
        </Typography>
        <Divider />
        <Typography variant="body2" fontWeight={800} mb={2} mt={2}>
          Enter the following parameters and search:
        </Typography>
        <TextField
          id="outlined-basic"
          label="Zipcode"
          variant="outlined"
          required
          inputProps={{ maxLength: 5 }}
          onChange={(e) => setZipcode(e.target.value)}
        />

        <Box
          m={1}
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <Button
            variant="outlined"
            onClick={() => zipcodeSearchRoute()}
            sx={{ height: 40 }}
          >
            {" "}
            Search{" "}
          </Button>
        </Box>
      </Box>

      {zipcodeInfo && (
        <Box
          mt={3}
          mb={3}
          p={3}
          sx={{ background: "black", borderRadius: "16px" }}
        >
          <Typography variant="h4" fontWeight={800}>
            Your Zipcheck Report
          </Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={6} mb={2}>
            <Grid item xs={6} md={6}>
              <Typography variant="body1">
                {nonNullVal(zipcodeInfo.zipcode)}
              </Typography>
              <Typography variant="body1">
                {nonNullVal(zipcodeInfo.city)}
              </Typography>
              <Typography variant="body1">
                {nonNullVal(zipcodeInfo.state)}
              </Typography>
              <Typography variant="body1">
                {nonNullVal(zipcodeInfo.country)}
              </Typography>
            </Grid>
            <Grid item xs={6} md={6}>
              <Typography variant="body1" align="right">
                {nonNullVal(zipcodeInfo.timezone)}
              </Typography>
              <Typography variant="body1" align="right">
                {nonNullVal(zipcodeInfo.latitude)}
              </Typography>
              <Typography variant="body1" align="right">
                {nonNullVal(zipcodeInfo.longitutde)}
              </Typography>
            </Grid>
          </Grid>

          <Divider />
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
            General
          </Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.total_population)}
              </Typography>
              <Typography variant="h6">Total population</Typography>
              <Typography variant="body2" mb={2}>
                The total population in the zip code
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.poverty_rate)}
              </Typography>
              <Typography variant="h6">Poverty Rate</Typography>
              <Typography variant="body2" mb={2}>
                The percentage of people living in poverty in the zip code
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.unemployment_rate)}
              </Typography>
              <Typography variant="h6">Unemployment Rate</Typography>
              <Typography variant="body2" mb={2}>
                The unemployment rate of the workers in the zip code
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.average_household_income)}
              </Typography>
              <Typography variant="h6">Average Household Income</Typography>
              <Typography variant="body2" mb={2}>
                The average household income in the zip code
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.working_age_pop_over_16)}
              </Typography>
              <Typography variant="h6">Working age pop over 16</Typography>
              <Typography variant="body2" mb={2}>
                The population of people above 16 years old in the zip code
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.rate_of_civilian_with_insurance)}
              </Typography>
              <Typography variant="h6">
                Rate of civilian w/ Insurance
              </Typography>
              <Typography variant="body2" mb={2}>
                The percentage of civilian with health insurance in the zip code
              </Typography>
            </Grid>
          </Grid>

          <Divider />
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
            Housing
          </Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            {/* <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.total_house_units)}
              </Typography>
              <Typography variant="h6">Total house units</Typography>
              <Typography variant="body2" mb={2}>
                The total housing units available in the zip code
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.occupied_house_units)}
              </Typography>
              <Typography variant="h6">Occupied house units</Typography>
              <Typography variant="body2" mb={2}>
                The number of housing units that are occupied in the zip code
              </Typography>
            </Grid> */}

            {/* <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.owner_occupied_units)}
              </Typography>
              <Typography variant="h6">Owner occupied units</Typography>
              <Typography variant="body2" mb={2}>
                The number of housing units that are owner-occupied in the zip
                code
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.renter_occupied_units)}
              </Typography>
              <Typography variant="h6">Renter occupied units</Typography>
              <Typography variant="body2" mb={2}>
                The number of housing units that are renter-occupied in the zip
                code
              </Typography>
            </Grid> */}

            {/* Education Demographics */}
            <Divider />
            <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
              Education Demographics
            </Typography>
            <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
              <BarChart
                width={1000}
                height={800}
                data={housingData1}
                margin={{ top: 5, right: 30, left: 20, bottom: 100 }}
              >
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 15 }}
                  // label={{ value: "Race", position: "bottom", offset: 0 }}
                />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="value"
                  name="Education"
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
            </Grid>

            <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
              <BarChart
                width={1000}
                height={800}
                data={housingData2}
                margin={{ top: 5, right: 30, left: 20, bottom: 100 }}
              >
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 15 }}
                  // label={{ value: "Race", position: "bottom", offset: 0 }}
                />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="value"
                  name="Education"
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
            </Grid>
            {/* Education Demographics */}
            {/* 
            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.median_home_value)}
              </Typography>
              <Typography variant="h6">Median Home Value</Typography>
              <Typography variant="body2" mb={2}>
                The median home value in the zip code
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.median_rent_value)}
              </Typography>
              <Typography variant="h6">Median Rent Value</Typography>
              <Typography variant="body2" mb={2}>
                The median rent value in the zip code
              </Typography>
            </Grid> */}
          </Grid>

          {/* Education Demographics */}
          <Divider />
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
            Education Demographics
          </Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <BarChart
              width={1000}
              height={800}
              data={edu2Data}
              margin={{ top: 5, right: 30, left: 20, bottom: 100 }}
            >
              <XAxis
                dataKey="name"
                interval={0}
                angle={-45}
                textAnchor="end"
                tick={{ fontSize: 10 }}
                // label={{ value: "Race", position: "bottom", offset: 0 }}
              />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Education" fill="#8884d8" barSize={80}>
                {edu2Data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                <LabelList dataKey="value" position="top" />
              </Bar>
            </BarChart>
          </Grid>
          {/* Education Demographics */}

          {/* <Divider />
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
            Education
          </Typography> */}
          {/* <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.pop_with_high_school)}
              </Typography>
              <Typography variant="h6">Pop with high school</Typography>
              <Typography variant="body2" mb={2}>
                The population of high school grads in the zip code
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.pop_with_bachelor)}
              </Typography>
              <Typography variant="h6">Pop with bachelor</Typography>
              <Typography variant="body2" mb={2}>
                The population of people with bachelor’s degrees in the zip code
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.hs_grad_rate)}
              </Typography>
              <Typography variant="h6">HS grad rate</Typography>
              <Typography variant="body2" mb={2}>
                The percentage of people only graduated from high school in the
                zip code
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.bachelor_grad_rate)}
              </Typography>
              <Typography variant="h6">Bachelor grad rate</Typography>
              <Typography variant="body2" mb={2}>
                The percentage of people with bachelor’s degrees in the zip code
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.combined_bachelor_hs_rate)}
              </Typography>
              <Typography variant="h6">Combined bachelor hs rate</Typography>
              <Typography variant="body2" mb={2}>
                The percentage of people with bachelor’s degrees and only
                graduated from high school in the zip code
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.labor_force_participation_rate)}
              </Typography>
              <Typography variant="h6">
                Labor force participation rate
              </Typography>
              <Typography variant="body2" mb={2}>
                The labor force participation rate of the workers in the zip
                code
              </Typography>
            </Grid>
          </Grid> */}

          {/* <Divider />
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
            Sex Demographics
          </Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.male_female_sex_ratio)}
              </Typography>
              <Typography variant="h6">Male female sex ratio</Typography>
              <Typography variant="body2" mb={2}>
                The males to 100 females ratio in the zip code
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.male_female_sex_ratio_over_18)}
              </Typography>
              <Typography variant="h6">
                Male female sex ratio over 18
              </Typography>
              <Typography variant="body2" mb={2}>
                The males to 100 females ratio for people over 18 years old in
                the zip code
              </Typography>
            </Grid>
          </Grid> */}

          {/* Education Demographics */}
          {/* <Divider />
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
            Education Demographics
          </Typography> */}
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <BarChart
              width={1000}
              height={800}
              data={eduData}
              margin={{ top: 5, right: 30, left: 20, bottom: 100 }}
            >
              <XAxis
                dataKey="name"
                interval={0}
                angle={-45}
                textAnchor="end"
                tick={{ fontSize: 10 }}
                // label={{ value: "Race", position: "bottom", offset: 0 }}
              />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Education" fill="#8884d8" barSize={80}>
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
          {/* Education Demographics */}

          {/* Sex Demographics */}
          <Divider />
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
            Sex Demographics
          </Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <BarChart
              width={1000}
              height={800}
              data={sexData}
              margin={{ top: 5, right: 30, left: 20, bottom: 55 }}
            >
              <XAxis
                dataKey="name"
                interval={0}
                angle={-45}
                textAnchor="end"
                tick={{ fontSize: 10 }}
                // label={{ value: "Race", position: "bottom", offset: 0 }}
              />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
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
          </Grid>
          {/* Sex Demographics */}

          {/* <Divider />
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
            Age Demographics
          </Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_under_5)}
              </Typography>
              <Typography variant="h6">Age under 5</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_5_to_9)}
              </Typography>
              <Typography variant="h6">Age 5 to 9</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_10_to_14)}
              </Typography>
              <Typography variant="h6">Age 10 to 14</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_15_to_19)}
              </Typography>
              <Typography variant="h6">Age 15 to 19</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_20_to_24)}
              </Typography>
              <Typography variant="h6">Age 20 to 24</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_25_to_34)}
              </Typography>
              <Typography variant="h6">Age 25 to 34</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_35_to_44)}
              </Typography>
              <Typography variant="h6">Age 35 to 44</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_45_to_54)}
              </Typography>
              <Typography variant="h6">Age 45 to 54</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_55_to_59)}
              </Typography>
              <Typography variant="h6">Age 55 to 59</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_60_to_64)}
              </Typography>
              <Typography variant="h6">Age 60 to 64</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_65_to_74)}
              </Typography>
              <Typography variant="h6">Age 65 to 74</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_75_to_84)}
              </Typography>
              <Typography variant="h6">Age 75 to 84</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_over_85)}
              </Typography>
              <Typography variant="h6">Age over 85</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_over_16)}
              </Typography>
              <Typography variant="h6">Age over 16</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_over_18)}
              </Typography>
              <Typography variant="h6">Age over 18</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_under_16)}
              </Typography>
              <Typography variant="h6">Age under 18</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_over_21)}
              </Typography>
              <Typography variant="h6">Age over 21</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_range_20_34)}
              </Typography>
              <Typography variant="h6">Age 20 to 34</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_range_35_64)}
              </Typography>
              <Typography variant="h6">Age 35 to 64</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.age_over_65)}
              </Typography>
              <Typography variant="h6">Age over 65</Typography>
            </Grid>
          </Grid>

          <Divider />
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
            Race Demographics
          </Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.race_white)}
              </Typography>
              <Typography variant="h6">Race white</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.race_black)}
              </Typography>
              <Typography variant="h6">Race black</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.race_native_american)}
              </Typography>
              <Typography variant="h6">Race native american</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.race_asian)}
              </Typography>
              <Typography variant="h6">Race asian</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.race_asian)}
              </Typography>
              <Typography variant="h6">Race asian indian</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.race_asian_chinese)}
              </Typography>
              <Typography variant="h6">Race asian chinese</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.race_asian_japanese)}
              </Typography>
              <Typography variant="h6">Race asian japanese</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.race_asian_korean)}
              </Typography>
              <Typography variant="h6">Race asian korean</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.race_asian_vietnamese)}
              </Typography>
              <Typography variant="h6">Race asian vietnamese</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.race_asian_filipino)}
              </Typography>
              <Typography variant="h6">Race asian filipino</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.race_asian_pacific_islander)}
              </Typography>
              <Typography variant="h6">Race asian pacific islander</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.race_other)}
              </Typography>
              <Typography variant="h6">Race other</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.hispanic_any_race)}
              </Typography>
              <Typography variant="h6">Hispanic any race</Typography>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(zipcodeInfo.race_two_or_more_or_unknown)}
              </Typography>
              <Typography variant="h6">Race two or more or unknown</Typography>
            </Grid>
          </Grid> */}

          {/* do here */}
          {/* <Divider />
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
            Race Demographics
          </Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <BarChart
              width={1000}
              height={800}
              data={raceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 55 }}
            >
              <XAxis
                dataKey="name"
                interval={0}
                angle={-45}
                textAnchor="end"
                tick={{ fontSize: 10 }}
                // label={{ value: "Race", position: "bottom", offset: 0 }}
              />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Race" fill="#8884d8">
                {raceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                <LabelList dataKey="value" position="top" />
              </Bar>
            </BarChart>
          </Grid> */}
          {/* do here */}

          {/* do here */}
          <Divider />
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
            Race Demographics
          </Typography>
          <Grid
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
                <PieChart width={700} height={700}>
                  <Tooltip />
                  <Pie
                    data={raceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={300}
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
          </Grid>

          <Divider />
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
            Age Demographics
          </Typography>
          <Grid
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
                <PieChart width={700} height={700}>
                  <Tooltip />
                  <Pie
                    data={ageData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={300}
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
          </Grid>

          {/* do here */}
        </Box>
      )}
    </Container>
  );
}
