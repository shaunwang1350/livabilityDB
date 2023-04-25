import { useEffect, useState } from 'react';
import { Container, TextField, Box, Button } from '@mui/material';
import zipcodeSearchCard from '../components/zipcodeSearchCard';
const config = require('../config.json');

export default function ZipcodeSearch() {

  const [selectedZipcode, setselectedZipcode] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/zipcodeSearch?zipcode=${selectedZipcode}`)
      .then(res => res.json())
      .then(resJson => setselectedZipcode(resJson));
  }, []);


  const searchRoute1 = () => {
    // fetch(`http://${config.server_host}:${config.server_port}/search_songs?title=${title}` +
    //   `&duration_low=${duration[0]}&duration_high=${duration[1]}` +
    //   `&plays_low=${plays[0]}&plays_high=${plays[1]}` +
    //   `&danceability_low=${danceability[0]}&danceability_high=${danceability[1]}` +
    //   `&energy_low=${energy[0]}&energy_high=${energy[1]}` +
    //   `&valence_low=${valence[0]}&valence_high=${valence[1]}` +
    //   `&explicit=${explicit}`
    // )
    //   .then(res => res.json())
    //   .then(resJson => {
    //     // DataGrid expects an array of objects with a unique id.
    //     // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
    //     const songsWithId = resJson.map((song) => ({ id: song.song_id, ...song }));
    //     setData(songsWithId);
    //   });
  }

  return (
    <Container>
      <h2>Welcome to Zipcheck, (call to action)</h2>
      <Box mt={3} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px'}} >
        <h2>Find all housing, demographics, and economic info for a particular zip code</h2>
        <p>Enter the following parameters and search:</p>
        <TextField id="outlined-basic" label="Zipcode" variant="outlined" required inputProps={{maxLength: 5}} onChange={(e) => setselectedZipcode(e.target.value)}/>

        <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
          <Button variant="contained" onClick={() => searchRoute1() } sx={{ height: 40 }}> Search </Button>
        </Box>

        {<zipcodeSearchCard zipcode={selectedZipcode}/>}

      </Box>
    
      <p>Created by Golden Meekats</p>
    </Container>
  );
};