import { useEffect, useState } from 'react';
import { Container, TextField, Box, Button, Typography, Divider, Fade } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
const config = require('../config.json');

export default function BusinessZipSearchPage() {

  const [showResult, setShowResult] = useState(false);

  const [zipcode, setZipcode] = useState([]);
  const [businessInfo, setBusinessInfo] = useState(null);

  const businessZipSearchRoute = () => {
    fetch(`http://${config.server_host}:${config.server_port}/business/${zipcode}`)
      .then(res => res.json())
      .then(resJson => setBusinessInfo(resJson));
    
      setShowResult(true);
    console.log(zipcode);
    console.log(businessInfo);
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 220 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'business_category_list', headerName: 'Business Categories', width: 450 },
    { field: 'review_stars', headerName: 'Review stars', width: 100 },
    { field: 'review_count', headerName: '# of Reviews', width: 100 }
  ]

  return (
    <Fade in={true}>
    <Container>
      <Box mt={35} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px', boxShadow: 24}} >
        <Typography variant="h5" fontWeight={800} mb={2}>Find all business info for a particular zip code</Typography>
        <Divider/>
        <Typography variant="body2" fontWeight={800} mb={2} mt={2} >Enter the following parameters and search:</Typography>
        <TextField id="outlined-basic" label="Zipcode" variant="outlined" required inputProps={{maxLength: 5}} onChange={(e) => setZipcode(e.target.value)}/>

        <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
          <Button variant="outlined" onClick={() => businessZipSearchRoute() } sx={{ height: 40 }}> Search </Button>
        </Box>
      </Box>

      {businessInfo && 
      <Fade in={showResult}>
      <Box mt={3} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px'}} >
        <div style={{ height: 1000, width: '100%' }}>
        <DataGrid
          rows={businessInfo}
          columns={columns}
          paginationModel={{ page: 0, pageSize: 100 }}
        />
        </div>
      </Box>
      </Fade>}
    </Container>
    </Fade>
  );
};