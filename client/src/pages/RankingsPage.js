import { useEffect, useState } from 'react';
import { Container, TextField, Box, Button } from '@mui/material';
const config = require('../config.json');

export default function RankingsPage() {

  const [category, setCategory] = useState(null);
  const [zipBusinessInfo, setZipBusinessInfo] = useState(null);

  const searchTopBusinessZipcode = () => {
    fetch(`http://${config.server_host}:${config.server_port}/top_business_zipcode/${category}`)
      .then(res => res.json())
      .then(resJson => setZipBusinessInfo(resJson));

    console.log(category);
    console.log(zipBusinessInfo);
  };

  return (
    <Container>
      <Box mt={3} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px'}} >
        <h2>Find the top zip codes for a particular business category</h2>
        <p>Enter the following parameters and search:</p>
        {/* Change to a dropdown with fix values of business categories */}
        <TextField id="outlined-basic" label="Business Category" variant="outlined" required inputProps={{maxLength: 99}} onChange={(e) => setCategory(e.target.value)}/>

        <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
          <Button variant="outlined" onClick={() => searchTopBusinessZipcode() } sx={{ height: 40 }}> Search </Button>
        </Box>
      </Box>
    </Container>
  );
};