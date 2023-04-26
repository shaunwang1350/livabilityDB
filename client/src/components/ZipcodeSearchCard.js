import { useEffect, useState } from 'react';
import { Box, Modal, Typography, Grid} from '@mui/material';
const config = require('../config.json');

export default function ZipcodeSearchCard({zipcodeInfo, handleClose}){
    return (
        <Modal>
            <Box mt={3} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px'}} >
                <Typography variant="h6" mb={1}>zipcode</Typography>
                <Typography variant="h6" mb={1}>city</Typography>
                <Typography variant="h6" mb={1}>state</Typography>
                <Typography variant="h6" mb={1}>country</Typography>
                <Typography variant="h6" mb={1}>timezone</Typography>
                <Typography variant="h6" mb={1}>latitude</Typography>
                <Typography variant="h6" mb={1}>longitutde</Typography>

                <Typography variant="h4" mb={1}>10</Typography>
                <Typography variant="h6">Total house units</Typography>
                <Typography variant="body1" mb={2}>The total housing units available in the zip code</Typography>

                <Typography variant="h4" mb={1}>10</Typography>
                <Typography variant="h6">Occupied house units</Typography>
                <Typography variant="body1" mb={2}>The number of housing units that are occupied in the zip code</Typography>
                
                <Typography variant="h4" mb={1}>10</Typography>
                <Typography variant="h6">Owner occupied units</Typography>
                <Typography variant="body1" mb={2}>The number of housing units that are owner-occupied in the zip code</Typography>

                <Typography variant="h4" mb={1}>10</Typography>
                <Typography variant="h6">Owner occupied units</Typography>
                <Typography variant="body1" mb={2}>The number of housing units that are owner-occupied in the zip code</Typography>
            </Box>
        </Modal>
    );
}