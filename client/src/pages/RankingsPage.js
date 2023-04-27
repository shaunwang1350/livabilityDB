import { useEffect, useState} from 'react';
import { Container, TextField, Box, Button, Autocomplete, Typography, Divider} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
const config = require('../config.json');

export default function RankingsPage() {

  const [allCategories, setAllCategories] = useState([]);
  const [category, setCategory] = useState();
  const [zipBusinessInfo, setZipBusinessInfo] = useState(null);

  const defaultProps = {
    options: allCategories,
    getOptionLabel: (option) => option.name,
  };

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/business_category`)
      .then(res => res.json())
      .then(resJson => setAllCategories(resJson));
  }, []);

  const columns = [
    { field: 'zipcode', headerName: 'Zipcode', width: 220 },
    { field: 'state', headerName: 'State', width: 200 },
    { field: 'city', headerName: 'City', width: 450 },
    { field: 'num_business', headerName: '# of Businesses', width: 100 },
    { field: 'avg_review_star', headerName: 'Avg Star Reviews', width: 100 }
  ]

  const searchTopBusinessZipcode = () => {
    console.log(category);
    fetch(`http://${config.server_host}:${config.server_port}/top_business_zipcode/${category}`)
      .then(res => res.json())
      .then(resJson => {
        const zipBusinessInfo = resJson.map((info) => ({ id: info.zipcode, ...info })); 
        setZipBusinessInfo(zipBusinessInfo)});

    console.log(zipBusinessInfo);
  };

  return (
    <Container>

      <Box mt={10} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px'}} >
        <Typography variant="h5" fontWeight={800} mb={2}>Find the top zip codes for a particular business category</Typography>
        <Divider/>
        <Typography variant="body2" fontWeight={800} mb={2} mt={2} >Enter the following parameters and search:</Typography>
        
        <Autocomplete
          {...defaultProps}
          value = {category}
          onInputChange={(event, newInputValue) => {
            setCategory(newInputValue);
            console.log(newInputValue);
          }}
          disablePortal
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Business Categories"/>}
        />

        <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
          <Button variant="outlined" onClick={() => searchTopBusinessZipcode() } sx={{ height: 40 }}> Search </Button>
        </Box>
      </Box>

      {zipBusinessInfo && <Box mt={3} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px'}} >
          <div style={{ height: 1000, width: '100%' }}>
            <DataGrid
              rows={zipBusinessInfo}
              columns={columns}
              paginationModel={{ page: 0, pageSize: 100 }}
            />
          </div>
      </Box>}

    </Container>
  );
};