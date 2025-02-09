import React from 'react';
import ClientGallery from '../components/clientSideGallery.js';
import { Box } from '@mui/material';  // Import Box for layout styling

function App() {
  return (
    <Box sx={{ padding: 2 }}>
      <ClientGallery />
    </Box>
  );
}

export default App;
