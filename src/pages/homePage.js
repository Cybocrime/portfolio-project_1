import React from 'react';
import Paragraph from '../components/paragraph.js';
import Grid from '../components/grid.js';
import ServiceSlider from '../components/slider1.js';
import BackgroundSection from '../components/backgroundImage.js';

import { Box } from '@mui/material';  // Import Box for layout styling

function Homepage() {
  return (
    <Box sx={{  border:'3px solid red' }}>
      <BackgroundSection />
      <Paragraph />
      <ServiceSlider />
      <Grid />
      {/* Footer will be naturally placed at the bottom here due to flex */}
    </Box>
  );
}

export default Homepage;
