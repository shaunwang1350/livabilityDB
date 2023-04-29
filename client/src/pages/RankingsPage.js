import { useEffect, useState} from 'react';
import { Container, TextField, Box, Button, Autocomplete, Typography, Divider, Fade} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
const config = require('../config.json');

export default function RankingsPage() {

  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  
  const [allCategories, setAllCategories] = useState([]);
  const [showResult, setShowResult] = useState(false);

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
    { field: 'zipcode', headerName: 'Zipcode', width: 100 },
    { field: 'state', headerName: 'State', width: 100 },
    { field: 'city', headerName: 'City', width: 300 },
    { field: 'num_business', headerName: '# of Businesses', width: 200 },
    { field: 'avg_review_star', headerName: 'Avg Star Reviews', width: 200 }
  ]

  const searchTopBusinessZipcode = () => {
    console.log(category);
    fetch(`http://${config.server_host}:${config.server_port}/top_business_zipcode/${category}`)
      .then(res => res.json())
      .then(resJson => {
        const zipBusinessInfo = resJson.map((info) => ({ id: info.zipcode, ...info })); 
        setZipBusinessInfo(zipBusinessInfo)});
    setShowResult(true);
    console.log(zipBusinessInfo);
  };

  return (
    <Fade in={show}>
      <Container>
        <Box mt={35} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px', boxShadow: 24}} >
          <Typography variant="h5" fontWeight={800} mb={2}>Find the top zip codes for a particular business category</Typography>
          <Divider/>
          <Typography variant="body2" fontWeight={800} mb={2} mt={2} >Enter the following parameters and search:</Typography>
          
          <Autocomplete
            {...defaultProps}
            value={category}
            onInputChange={(event, newInputValue) => {
              setCategory(newInputValue);
              console.log(newInputValue);
            }}
            disablePortal
            sx={{ width: 300 }}
            renderInput={(params) => (<TextField {...params} label="Business Categories" />)}
          />

          <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end" >
            <Button variant="outlined" onClick={() => searchTopBusinessZipcode()} sx={{ height: 40 }} >
              {" "}Search{" "}
            </Button>
          </Box>
        </Box>

        {zipBusinessInfo && 
          <Fade in={showResult}>
            <Box mt={3} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px', boxShadow: 24}} >
              <div style={{ height: 1000, width: '100%' }}>
                <DataGrid
                  rows={zipBusinessInfo}
                  columns={columns}
                  paginationModel={{ page: 0, pageSize: 100 }}
                />
              </div>
            </Box>
          </Fade>
        }

        {zipBusinessInfo &&
          <Box mt={3} mb={3} p={3} sx={{ background: "black", borderRadius: "16px" }} >
            <Typography variant="h5" fontWeight={800} mb={2}>
              Bar chart for number of businesses and average star reviews
            </Typography>
            <Divider />
            <BarChart
              width={800}
              height={500}
              data={zipBusinessInfo}
              margin={{ top: 5, right: 30, left: 20, bottom: 55 }}
            >
              <XAxis dataKey="zipcode" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="num_business"
                name="Number of Businesses"
                fill="#8884d8"
              />
              <Bar
                dataKey="avg_review_star"
                name="Average Star Reviews"
                fill="#82ca9d"
              />
            </BarChart>
          </Box>
        }
      </Container>
    </Fade>
  );
}
