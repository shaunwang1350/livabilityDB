import { useState } from 'react';
import { AppBar, Container, Toolbar, Typography, Button, Menu, MenuItem} from '@mui/material'
import { NavLink, useNavigate } from 'react-router-dom';

const NavText = ({ href, text, isMain }) => {
  return (
    <Typography
      variant={isMain ? 'h5' : 'h7'}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'Monaco, sans-serif',
        fontWeight: 700,
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  )
}

export default function NavBar() {

  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (url) => {
    if (typeof url === 'string' ){
      navigate(url);
    }
    setAnchorEl(null);
  };


  return (
    <AppBar position='static' sx={{background: 'linear-gradient(to right bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))', boxShadow: 'none' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <NavText href='/' text='Zipcheck' isMain />
        <Button
          sx={{marginRight: '20px'}}
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          variant="outlined"
        >
          Search
        </Button>
        <Menu
          sx={{marginRight: '20px'}}
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={(e) => handleClose('/zipcodeSearch')}>Search Zipcode</MenuItem>
          <MenuItem onClick={(e) => handleClose('/businessZipCodeSearch')}>Search Business By Zipcode</MenuItem>
          <MenuItem onClick={(e) => handleClose('/parametersSearch')}>Search Zipcode by Livability Parameters</MenuItem>
        </Menu>
        <Button
          sx={{marginRight: '20px'}}
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={() => handleClose('/rankings')}
          variant="outlined"
        >
          Zipcode Rankings
        </Button>

        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={() => handleClose('/analysis')}
          variant="outlined"
        >
          Analysis
        </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}