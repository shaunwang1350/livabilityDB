import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Box,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
const config = require("../config.json");

export default function BusinessZipSearchPage() {
  const [zipcode, setZipcode] = useState([]);
  const [businessInfo, setBusinessInfo] = useState(null);

  const businessZipSearchRoute = () => {
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
    { field: "business_category_list", headerName: "Name", width: 450 },
    { field: "review_stars", headerName: "Review stars", width: 100 },
    { field: "review_count", headerName: "# of Reviews", width: 100 },
  ];

  return (
    <Container>
      <Box
        mt={10}
        mb={3}
        p={3}
        sx={{ background: "black", borderRadius: "16px" }}
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
            Bar chart for number of stars and reviews
          </Typography>
          <Divider />
          <BarChart
            width={800}
            height={600}
            data={businessInfo}
            margin={{ top: 10, right: 30, left: 20, bottom: 100 }}
          >
            <XAxis
              dataKey="name"
              interval={0}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 10 }}
            />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="review_stars" name="Review Stars" fill="#8884d8" />
            <Bar dataKey="review_count" name="Review Count" fill="#82ca9d" />
          </BarChart>
        </Box>
      )}
    </Container>
  );
}
