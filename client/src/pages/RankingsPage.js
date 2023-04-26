import { useEffect, useState } from 'react';
import { Container, TextField, Box, Button, Autocomplete, Typography, Divider } from '@mui/material';
const config = require('../config.json');

export default function RankingsPage() {

  const [allCategories, setAllCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [zipBusinessInfo, setZipBusinessInfo] = useState(null);


  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 }
  ]

  const options = top100Films.map((option) => {
    const firstLetter = option.title[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  });

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/business_category`)
      .then(res => res.json())
      .then(resJson => setAllCategories(resJson));
  }, []);


  const searchTopBusinessZipcode = () => {
    fetch(`http://${config.server_host}:${config.server_port}/top_business_zipcode/${category}`)
      .then(res => res.json())
      .then(resJson => setZipBusinessInfo(resJson));

    console.log(category);
    console.log(zipBusinessInfo);
  };

  return (
    <Container>

      <Box mt={10} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px'}} >
        <Typography variant="h5" fontWeight={800} mb={2}>Find all housing, demographics, and economic info for a particular zip code</Typography>
        <Divider/>
        <Typography variant="body2" fontWeight={800} mb={2} mt={2} >Enter the following parameters and search:</Typography>
        <Autocomplete
          id="grouped-demo"
          options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
          groupBy={(option) => option.firstLetter}
          getOptionLabel={(option) => option.title}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="With categories" />}
        />

        <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
          <Button variant="outlined" onClick={() => searchTopBusinessZipcode() } sx={{ height: 40 }}> Search </Button>
        </Box>
      </Box>
    </Container>
  );
};