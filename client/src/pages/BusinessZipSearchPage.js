import { useEffect, useState } from 'react';
import { Container, TextField, Box, Button } from '@mui/material';
const config = require('../config.json');

export default function BusinessZipSearchPage() {

  const [zipcode, setZipcode] = useState(null);
  const [businessInfo, setBusinessInfo] = useState(null);

  const businessZipSearchRoute = () => {
    fetch(`http://${config.server_host}:${config.server_port}/business/${zipcode}`)
      .then(res => res.json())
      .then(resJson => setBusinessInfo(resJson));
    
    console.log(zipcode);
    console.log(businessInfo);
  };

  return (
    <Container>
      <Box mt={3} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px'}} >
        <h2>Find all business info for a particular zip code</h2>
        <p>Enter the following parameters and search:</p>
        <TextField id="outlined-basic" label="Zipcode" variant="outlined" required inputProps={{maxLength: 5}} onChange={(e) => setZipcode(e.target.value)}/>

        <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
          <Button variant="outlined" onClick={() => businessZipSearchRoute() } sx={{ height: 40 }}> Search </Button>
        </Box>
      </Box>
    </Container>
  );
};