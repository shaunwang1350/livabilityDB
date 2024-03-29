import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Box,
  Button,
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
import { isInvalidZipCodeInput,  dataSort} from "../helpers/formatter";
const config = require("../config.json");

export default function BusinessZipSearchPage() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  const [invalidInput, setInvalidInput] = useState(false);

  const [zipcode, setZipcode] = useState([]);
  const [businessInfo, setBusinessInfo] = useState(null);

  const businessZipSearchRoute = () => {
    const invalidZC = isInvalidZipCodeInput(zipcode);
    setInvalidInput(invalidZC);
    
    if (invalidZC) {
      return;
    }

    fetch(
      `http://${config.server_host}:${config.server_port}/business/${zipcode}`
    )
      .then((res) => res.json())
      .then((resJson) => setBusinessInfo(resJson));

    console.log(zipcode);
    console.log(businessInfo);
  };

  const columns = [
    { field: "name", headerName: "Name", width: 220 },
    { field: "address", headerName: "Address", width: 200 },
    {
      field: "business_category_list",
      headerName: "Business Categories",
      width: 450,
    },
    { field: "review_stars", headerName: "Review stars", width: 100 },
    { field: "review_count", headerName: "# of Reviews", width: 100 },
  ];

  // Define constant for data to be used in the BarCharts
  const top10ReviewCountData = businessInfo
    ? dataSort(businessInfo)
    : [];

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
            Find all business info for a particular zip code
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
          {invalidInput && <Box><Typography variant="p" fontWeight={100} mb={2} mt={2}>Missing/Invalid Input for Zip Code</Typography></Box>}

          <Box
            m={1}
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <Button
              variant="outlined"
              onClick={() => businessZipSearchRoute()}
              sx={{ height: 40 }}
            >
              {" "}
              Search{" "}
            </Button>
          </Box>
        </Box>

        {businessInfo && (
          <Box
            mt={3}
            mb={3}
            p={3}
            sx={{ background: "black", borderRadius: "16px" }}
          >
            <div style={{ height: 1000, width: "100%" }}>
              <DataGrid
                rows={businessInfo}
                columns={columns}
                paginationModel={{ page: 0, pageSize: 10 }}
              />
            </div>
          </Box>
        )}

        {businessInfo && (
          <Box
            mt={3}
            mb={3}
            p={3}
            sx={{ background: "black", borderRadius: "16px" }}
          >
            <Typography variant="h5" fontWeight={800} mb={2}>
              Bar chart for 10 top businesses with the most number of review
              count
            </Typography>
            <BarChart width={1050} height={400} data={top10ReviewCountData}>
            <XAxis
                      dataKey="name"
                      tick={{ fontSize: 9 }}
                    />
              <YAxis
                domain={[
                  0,
                  Math.ceil(
                    Math.max(...businessInfo.map((d) => d.review_count)) * 1.1
                  ),
                ]}
              />{" "}
              <Tooltip />
              <Bar dataKey="review_count" name="Review Count" fill="#82ca9d" />
            </BarChart>
          </Box>
        )}
      </Container>
    </Fade>
  );
}
