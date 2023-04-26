import { useEffect, useState } from 'react';
import { Container, Box } from '@mui/material';
const config = require('../config.json');

export default function StatisticsPage() {

  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/us_statistics`)
      .then(res => res.json())
      .then(resJson => setStats(resJson));
  }, []);

  return (
    <Container>
      <Box mt={3} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px'}} >
        <h2>Statistics across all US Zip Codes</h2>
        {/* Display all US Statistics */}
        {console.log(stats)}
      </Box>
    </Container>
  );
};