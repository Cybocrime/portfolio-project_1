import React from 'react';
import { Box, Typography } from '@mui/material';
import backgroundImage from '../assets/glass_house_design.webp';

const BackgroundSection = () => (
  <Box
    sx={{
      height: 550,
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      color: 'white',
      textAlign: 'center',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1,
      },
    }}
  >
    <Box sx={{ zIndex: 2, width: '100%', padding: 1 }}>
      <Typography
        variant="h3"
        sx={{
          fontSize: { xs: '32px', sm: '48px', md: '64px' },
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
        }}
      >
        WE BELIEVE IN MAKING THE EXTRAORDINARY ACHIEVABLE
      </Typography>
    </Box>
  </Box>
);

export default BackgroundSection;
