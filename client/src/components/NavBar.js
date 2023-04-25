import * as React from 'react';
import { AppBar, Container, Toolbar, Typography, Button, Menu, MenuItem} from '@mui/material'
import { NavLink, useNavigate } from 'react-router-dom';

// The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// helper component NavText local to the file is defined to prevent repeated code.
const NavText = ({ href, text, isMain }) => {
  return (
    <Typography
      variant={isMain ? 'h5' : 'h7'}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'Helvetica, sans-serif',
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

// Here, we define the NavBar. Note that we heavily leverage MUI components
// to make the component look nice. Feel free to try changing the formatting
// props to how it changes the look of the component.
export default function NavBar() {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (url) => {
    navigate(url);
    setAnchorEl(null);
  };


  return (
    <AppBar position='static' sx={{bgcolor: "transparent", boxShadow: 'none' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <NavText href='/' text='Zipcheck' isMain />
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          Search
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={() => handleClose('/zipcodeSearch')}>Search Zipcode</MenuItem>
          <MenuItem onClick={() => handleClose('/businessZipCodeSearch')}>Search Business By Zipcode</MenuItem>
          <MenuItem onClick={() => handleClose('/parametersSearch')}>Search Zipcode by Livability Parameters</MenuItem>
        </Menu>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={() => handleClose('/statistics')}
        >
          U.S. Statistics
        </Button>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={() => handleClose('/rankings')}
        >
          Rankings
        </Button>

        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={() => handleClose('/analysis')}
        >
          Analysis
        </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}