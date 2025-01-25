import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { AppBar, Box, Typography, IconButton, TextField, Paper, Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { useAppContext } from '../../contexts/AppContext';

function Navbar() {
  const { state, dispatch } = useAppContext();
  const isAuthenticated = !!state.user;

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    // Add any additional logout logic here
  };

  return (
    <AppBar position="fixed" sx={{ background: 'none', boxShadow: 'none' }}>
     <Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					p: 1,
					width: '100%'
				}}
			>
        <div>
          
        </div>
				
				<Box sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					
					alignContent: 'center',
          flexDirection: 'row',
          pt: 1.6

				}}>
          <Typography
            sx={{
              color: '#D8F651',
              fontFamily: 'PixelSplitter, monospace',
              fontSize: '2.2rem',
              textShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
            }}
          >
            FREE<span style={{color: 'blue'}}>WRITER</span>
          </Typography>
          <div>
            <IconButton sx={{ color: '#000',}}>
              <QuestionMarkIcon sx={{border: '1px solid #000', borderRadius: 50, fontSize: '1.4rem'}} />
            </IconButton>
            <IconButton sx={{ color: '#000' }}>
              <SettingsIcon sx={{fontSize: '1.4rem'}} />
            </IconButton>
          </div>
				</Box>
			</Box>
    </AppBar>
  );
}

export default Navbar;