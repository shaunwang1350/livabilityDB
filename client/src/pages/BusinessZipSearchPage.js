import { useEffect, useState } from 'react';
import { Container, TextField, Box, Button } from '@mui/material';
const config = require('../config.json');

export default function BusinessZipSearchPage() {

  const [selectedZipcode, setselectedZipcode] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/businessZipSearchPage`)
      .then(res => res.json())
      .then(resJson => setselectedZipcode(resJson));
  }, []);


  const searchRoute1 = () => {
  }

  return (
    <Container>
      <Box mt={3} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px'}} >
        <h2>Find all housing, demographics, and economic info for a particular zip code</h2>
        <p>Enter the following parameters and search:</p>
        <TextField id="outlined-basic" label="Zipcode" variant="outlined" required inputProps={{maxLength: 5}} onChange={(e) => setselectedZipcode(e.target.value)}/>

        <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
          <Button variant="outlined" onClick={() => searchRoute1() } sx={{ height: 40 }}> Search </Button>
        </Box>
      </Box>

      {<zipcodeSearchCard zipcode={selectedZipcode}/>}
  
    </Container>
  );
};