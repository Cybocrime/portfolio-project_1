import React from 'react';
import { Box, CircularProgress } from '@mui/material';


const Preloader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        backgroundColor: '#fff', // Optional: Background for loader
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Preloader;
