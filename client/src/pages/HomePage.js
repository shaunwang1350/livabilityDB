import { useEffect, useState } from "react";
import { Grid, Box, Button, Typography, Divider, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { nonNullVal } from "../helpers/formatter";
import bgimg from "../images/bkvector.png";

import {
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";

const config = require("../config.json");

export default function HomePage() {
  const navigate = useNavigate();
  const handleClick = (url) => {
    navigate(url);
  };

  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  const [stats, setStats] = useState([]);

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

  const eduData = stats
    ? [
        {
          name: "Average US bachelor grad",
          value: stats.avg_us_bachelor_grad_percentage,
        },
        {
          name: "Average US hs grad",
          value: stats.avg_us_hs_grad_percentage,
        },
        {
          name: "Average US combined bachelor hs",
          value: stats.avg_us_combined_bachelor_hs_percentage,
        },
      ]
    : [];

  const ageData = stats
    ? [
        {
          name: "Average US children",
          value: stats.avg_us_children_percentage,
        },
        {
          name: "Mean young adult ",
          value: stats.avg_us_young_adults_percentage,
        },
        {
          name: "Average US middle age",
          value: stats.avg_us_middle_age_percentage,
        },
        {
          name: "Average US seniors",
          value: stats.avg_us_seniors_percentage,
        },
      ]
    : [];

  const raceData = stats
    ? [
        {
          name: "Asian",
          value: stats.avg_us_asian_percentage,
        },
        {
          name: "Black",
          value: stats.avg_us_black_percentage,
        },
        {
          name: "Chinese",
          value: stats.avg_us_chinese_percentage,
        },
        {
          name: "Filipino",
          value: stats.avg_us_filipino_percentage,
        },
        {
          name: "Hispanic (any race)",
          value: stats.avg_us_hispanic_any_race_percentage,
        },
        {
          name: "Indian",
          value: stats.avg_us_indian_percentage,
        },
        {
          name: "Japanese",
          value: stats.avg_us_japanese_percentage,
        },
        {
          name: "Korean",
          value: stats.avg_us_korean_percentage,
        },
        {
          name: "Native American",
          value: stats.avg_us_native_american_percentage,
        },
        {
          name: "Other",
          value: stats.avg_us_other_percentage,
        },
        {
          name: "White",
          value: stats.avg_us_white_percentage,
        },
        {
          name: "Pacific Islander",
          value: stats.avg_us_pacific_islander_percentage,
        },
        {
          name: "Vietnamese",
          value: stats.avg_us_vietnamese_percentage,
        },
        {
          name: "2+ or unknown race",
          value: stats.avg_us__or_more_or_unknown_percentage,
        },
      ]
    : [];

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/us_statistics`)
      .then((res) => res.json())
      .then((resJson) => setStats(resJson));
  }, []);

  return (
    <Fade in={show}>
      <Grid>
        <Box m={7} display="flex" justifyContent="center" alignItems="center" minHeight="70vh" >
          <Grid container spacing={8}>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight={800} mb={4}>
                Find out more than you know about your zipcode.
              </Typography>

              <Typography variant="h6" mb={1}>
                Zipcode Report helps you to generate reports that include
                displaying housing, demographics, and economic information for a
                given zipcode, displaying business information for a given
                zipcode, and searching for a zipcode based on specific
                livability parameters.
              </Typography>

              <Typography variant="h6" mb={4}>
                It can also find the top N zipcodes with the highest average
                review score and number of businesses for a specific business
                category, calculate the mean statistics of livability parameters
                across all US zip codes, and score zipcodes based on various
                factors such as home value/rent, age/education, economic
                indicators, and business review star/count. These functions help
                users evaluate and compare different areas based on relevant
                factors to make informed decisions.
              </Typography>

              <Button
                variant="outlined"
                color="primary"
                sx={{ width: "200px", fontSize: "16px" }}
                onClick={() => handleClick("/zipcodeSearch")}
              >
                Search now
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <img
                src={bgimg}
                alt="My Team"
                width="650"
                sx={{ "border-radius": "5%" }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box mt={3} mb={3} ml={5} mr={5} p={5} sx={{ background: "black", borderRadius: "16px", boxShadow: 24 }} >
          <Typography variant="h5" fontWeight={800} mb={2}>
            Statistics across all US Zip Codes
          </Typography>

          <Divider />
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
            Housing
          </Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2}>
            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                ${nonNullVal(stats.avg_us_home_value)}
              </Typography>
              <Typography variant="h6">Average US Home Value</Typography>
              <Typography variant="body2" mb={2}>
                Mean home value across all US zip codes
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                ${nonNullVal(stats.avg_us_rent_value)}
              </Typography>
              <Typography variant="h6">Average US Rent Value</Typography>
              <Typography variant="body2" mb={2}>
                Mean rent value across all US zip codes
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                ${nonNullVal(stats.avg_us_household_income)}
              </Typography>
              <Typography variant="h6">Average US Household Income</Typography>
              <Typography variant="body2" mb={2}>
                Mean household income across all US zip codes
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(stats.avg_us_house_occupancy_rate)}
              </Typography>
              <Typography variant="h6">
                Average US House Occupancy Rate
              </Typography>
              <Typography variant="body2" mb={2}>
                Mean house occupancy rate across all US zip codes
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(stats.avg_us_owner_occupancy_rate)}
              </Typography>
              <Typography variant="h6">
                Average US Owner Occupancy Rate
              </Typography>
              <Typography variant="body2" mb={2}>
                Mean owner occupancy rate across all US zip codes
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography variant="h3" mb={1}>
                {nonNullVal(stats.avg_us_renter_occupancy_rate)}
              </Typography>
              <Typography variant="h6">
                Average US Renter Occupancy Rate
              </Typography>
              <Typography variant="body2" mb={2}>
                Mean renter occupancy rate across all US zip codes
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box mt={3} mb={0} ml={5} mr={5} p={5} sx={{ background: "black", borderRadius: "16px", boxShadow: 24 }} >
          {/* Education Demographics */}
          <Divider />
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
            Education Demographics across all Zipcodes
          </Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mt={1} mb={0} alignItems="center" justifyContent="center">
            <BarChart
              width={1200 + eduData.length * 100}
              height={400}
              data={eduData}
              margin={{ top: 5, right: 30, left: 20, bottom: 10 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9 }}
              />
              <YAxis
                domain={[0, 1]}
                tickFormatter={(tick) => `${(tick * 100).toFixed(2)}%`}
              />{" "}
              <Tooltip
                formatter={(value) => `${(value * 100).toFixed(2)}%`}
                labelFormatter={(label) => `${(label * 100).toFixed(0)}%`}
              />{" "}
              <Bar dataKey="value" name="Education" fill="#8884d8" barSize={80}>
                {eduData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(value) => `${(value * 100).toFixed(2)}%`}
                />
              </Bar>
            </BarChart>
            <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2} ml={2}>
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
          </Grid>
          {/* Race Demographics */}
          </Box>
          <Box mt={3} mb={0} ml={5} mr={5} p={5} sx={{ background: "black", borderRadius: "16px", boxShadow: 24 }} >
          <Divider />
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
            Race Demographics across all Zipcodes
          </Typography>
          <Grid sx={{ flexGrow: 1 }} container spacing={2} mb={2} mt={2}>
            <BarChart
              width={100 + raceData.length * 100}
              height={300}
              data={raceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 10 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9 }}
              />
              <YAxis
                domain={[0, 1]}
                tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`}
              />{" "}
              <Tooltip
                formatter={(value) => `${(value * 100).toFixed(2)}%`}
                labelFormatter={(label) => `${(label * 100).toFixed(0)}%`}
              />{" "}
              <Bar dataKey="value" name="Race" fill="#8884d8" barSize={80}>
                {raceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(value) => `${(value * 100).toFixed(2)}%`}
                />
              </Bar>
            </BarChart>
          </Grid>
          </Box>
          <Box mt={3} mb={0} ml={5} mr={5} p={5} sx={{ background: "black", borderRadius: "16px", boxShadow: 24 }} >

          {/* Age  Demographics */}
          <Divider />
          <Typography variant="h5" fontWeight={800} mt={2} mb={2}>
            Age Demographics across all Zipcodes
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Grid container spacing={2} mb={2} mt={1}>
              <BarChart
                width={1100 + ageData.length * 100}
                height={300}
                data={ageData}
                margin={{ top: 5, right: 30, left: 20, bottom: 10 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 9}}
                />
                <YAxis
                  domain={[0, 1]}
                  tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`}
                />
                <Tooltip
                  formatter={(value) => `${(value * 100).toFixed(2)}%`}
                  labelFormatter={(label) => `${(label * 100).toFixed(2)}%`}
                />{" "}
                <Bar
                  dataKey="value"
                  name="Education"
                  fill="#8884d8"
                  barSize={80}
                >
                  {ageData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                  <LabelList
                    dataKey="value"
                    formatter={(value) => `${(value * 100).toFixed(2)}%`}
                    position="top"
                  />
                </Bar>
              </BarChart>
            </Grid>
          </Box>
          {/* Age Demographics */}
          {console.log(stats)}
        </Box>
      </Grid>
    </Fade>
  );
}
