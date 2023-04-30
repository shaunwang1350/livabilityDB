import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Box,
  Button,
  Autocomplete,
  Typography,
  Divider,
  Fade,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { isInvalidBusinessCategory, dataSort } from "../helpers/formatter";
const config = require("../config.json");

export default function RankingsPage() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  const [allCategories, setAllCategories] = useState([]);

  const [showResult, setShowResult] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);

  const [category, setCategory] = useState();
  const [zipBusinessInfo, setZipBusinessInfo] = useState(null);

  const defaultProps = {
    options: allCategories,
    getOptionLabel: (option) => option.name,
  };

  useEffect(() => {
    fetch(
      `http://${config.server_host}:${config.server_port}/business_category`
    )
      .then((res) => res.json())
      .then((resJson) => setAllCategories(resJson));
  }, []);

  const columns = [
    { field: "zipcode", headerName: "Zipcode", width: 100 },
    { field: "state", headerName: "State", width: 100 },
    { field: "city", headerName: "City", width: 300 },
    { field: "avg_review_star", headerName: "Avg Star Reviews", width: 200 },
    { field: "num_business", headerName: "# of Businesses", width: 200 },
  ];

  const searchTopBusinessZipcode = () => {
    const invalidBC = isInvalidBusinessCategory(category);
    setInvalidInput(invalidBC);
    
    if (invalidBC) {
      return;
    }

    console.log(category);
    fetch(
      `http://${config.server_host}:${config.server_port}/top_business_zipcode/${category}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        const zipBusinessInfo = resJson.map((info) => ({
          id: info.zipcode,
          ...info,
        }));
        setZipBusinessInfo(zipBusinessInfo);
      });
    
    setShowResult(true);
    console.log(zipBusinessInfo);
  };

  return (
    <Fade in={show}>
      <Container>
        <Box
          mt={35}
          mb={3}
          p={3}
          sx={{ background: "black", borderRadius: "16px", boxShadow: 24 }}
        >
          <Typography variant="h5" fontWeight={800} mb={2}>
            Find the top zip codes for a particular business category
          </Typography>
          <Divider />
          <Typography variant="body2" fontWeight={800} mb={2} mt={2}>
            Enter the following parameters and search:
          </Typography>

          <Autocomplete
            {...defaultProps}
            value={category}
            onInputChange={(event, newInputValue) => {
              setCategory(newInputValue);
              console.log(newInputValue);
            }}
            disablePortal
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Business Categories" />
            )}
          />
          {invalidInput && <Box><Typography variant="p" fontWeight={100} mb={2} mt={2}>Missing Input for Business Category</Typography></Box>}

          <Box
            m={1}
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <Button
              variant="outlined"
              onClick={() => searchTopBusinessZipcode()}
              sx={{ height: 40 }}
            >
              {" "}
              Search{" "}
            </Button>
          </Box>
        </Box>

        {zipBusinessInfo && (
          <Fade in={showResult}>
            <Box
              mt={3}
              mb={3}
              p={3}
              sx={{ background: "black", borderRadius: "16px", boxShadow: 24 }}
            >
              <div style={{ height: 1000, width: "100%" }}>
                <DataGrid
                  rows={zipBusinessInfo}
                  columns={columns}
                  paginationModel={{ page: 0, pageSize: 100 }}
                />
              </div>
            </Box>
          </Fade>
        )}

        {zipBusinessInfo && category && (
          <Box
            mt={3}
            mb={3}
            p={3}
            sx={{ background: "black", borderRadius: "16px" }}
          >
            <Typography variant="h5" fontWeight={800} mb={2}>
              Bar chart for top 10 Zipcodes with the most number of businesses
            </Typography>
            <BarChart
              width={100 + 10 * 100}
              height={400}
              data={dataSort(zipBusinessInfo)}
              margin={{ top: 5, right: 30, left: 20, bottom: 55 }}
            >
              <XAxis dataKey="zipcode" />
              <YAxis
                domain={[
                  0,
                  Math.ceil(Math.max(...zipBusinessInfo.map((d) => d.num_business)) * 1.1),
                ]}
              />
              <Tooltip />
              <Bar
                dataKey="num_business"
                name="Number of Businesses"
                fill="#8884d8"
              />
            </BarChart>
          </Box>
        )}
      </Container>
    </Fade>
  );
}
