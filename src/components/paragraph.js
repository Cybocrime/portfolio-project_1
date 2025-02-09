import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

export default function FullWidthContainer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen size is mobile

  return (
    <Box
      sx={{
        width: '100%', // Full width
        maxWidth: '100%', // Optional: restrict max width to improve text wrapping
        padding: '3rem',    // Increased padding for both sides
        backgroundColor: '#EDEDED', // Optional background color
        boxSizing: 'border-box',
        color: 'black',
        display: 'flex',   // Ensures the content is centered
        justifyContent: 'center', // Center content horizontally
        alignItems: 'center', // Center content vertically
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '1200px' }}>  {/* Constrains the width for large screens */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            paddingTop: 2,
            paddingBottom: 2,
            fontWeight: 'bold',
            fontSize: isMobile ? '1rem' : '1.5rem', // Smaller font for mobile, larger for desktop
            textAlign: 'center', // Centers the text
          }}
        >
          Welcome to Mawutorye Building and Constructions and Aluminium Works
        </Typography>

        <Typography
          variant="h6"
          sx={{
            lineHeight: '1.5', // Optional for better readability
            fontSize: isMobile ? '0.85rem' : '1rem', // Adjusted font size for mobile and desktop
            textAlign: 'center', // Centers the text
          }}
        >
          For over a decade, we&apos;ve been at the forefront of transforming glass, walls, and spaces into functional and elegant designs tailored for homes, offices, and bespoke projects. Specializing in glazing, construction, and wall design, we bring your vision to life with energy-efficient glass installations and stunning interior and exterior finishes made with cement and ceramic.
        </Typography>

        <Typography
          variant="h6"
          sx={{
            paddingTop: 2,
            lineHeight: '1.5', // Optional for better readability
            fontSize: isMobile ? '0.85rem' : '1rem', // Adjusted font size for mobile and desktop
            textAlign: 'center', // Centers the text
          }}
        >
          Our commitment to innovation, craftsmanship, and sustainability ensures that every project we deliver not only enhances aesthetics but also elevates functionality. With clear communication, exceptional service, and a focus on lasting relationships, we pride ourselves on delivering brilliant, customized solutions that reflect your unique style.
        </Typography>
      </Box>
    </Box>
  );
}
