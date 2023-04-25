import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Link, Modal } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { NavLink } from 'react-router-dom';
const config = require('../config.json');

export default function zipcodeSearch({zipcode}) {

    

    return (
        <Modal open={true}>
            <Box mt={3} mb={3} p={3} sx={{ background: 'black', borderRadius: '16px'}} >
                <p>ABC</p>
            </Box>
        </Modal>
    );
}