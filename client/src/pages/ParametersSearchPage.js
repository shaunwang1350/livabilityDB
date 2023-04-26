import { useEffect, useState } from 'react';
import { Container, TextField, Box, Button } from '@mui/material';
import ZipcodeSearchCard from '../components/ZipcodeSearchCard';
const config = require('../config.json');

export default function ParametersSearchPage() {

  const [zipcode, setZipcode] = useState(null);
  const [zipcodeInfo, setZipcodeInfo] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search`)
      .then(res => res.json())
      .then(resJson => setZipcodeInfo(resJson));
  }, []);


  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search?`)
      .then(res => res.json())
      .then(resJson => setZipcodeInfo(resJson));
  }

  return (
    <Container>
      <Box mt={3} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px'}} >
        <h2>Find all housing, demographics, and economic info for a particular zip code</h2>
        <p>Enter the following parameters and search:</p>
        <TextField id="outlined-basic" label="Zipcode" variant="outlined" required inputProps={{maxLength: 5}} onChange={(e) => setZipcode(e.target.value)}/>

        <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
          <Button variant="outlined" onClick={() => search() } sx={{ height: 40 }}> Search </Button>
        </Box>
      </Box>

      <ZipcodeSearchCard zipcode={zipcodeInfo} handleClose={() => setZipcode(null)}/>
  
    </Container>
  );
};