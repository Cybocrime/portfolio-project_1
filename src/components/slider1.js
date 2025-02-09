import React, { useRef } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, IconButton, useMediaQuery } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

// Use import for images
import glassCutting from '../assets/glass_cutting.webp';
import mirrorInstallation from '../assets/mirror_installation.webp';
import windowsInstallation from '../assets/windows_installation.webp';
import glassDoor from '../assets/Glass_Door.webp';
import bathScreen from '../assets/Bath_screen.webp';
import glassBalustrades from '../assets/Glass_Balustrades.webp';

const services = [
  {
    title: 'Glass Cutting',
    description: 'Cutting glass to fit specific dimensions for windows, doors, and other uses.',
    image: glassCutting,
  },
  {
    title: 'Mirror Installation',
    description: 'Installation of mirrors for homes, offices, and public spaces.',
    image: mirrorInstallation,
  },
  {
    title: 'Window Installation',
    description: 'Professional installation of energy-efficient windows.',
    image: windowsInstallation,
  },
  {
    title: 'Glass Doors',
    description: 'Installing sliding, hinged, or bi-fold glass doors for interiors or exteriors.',
    image: glassDoor,
  },
  {
    title: 'Shower Screens',
    description: 'Design and installation of high-quality glass shower screens.',
    image: bathScreen,
  },
  {
    title: 'Glass Balustrades',
    description: 'Providing sleek and modern glass balustrades for safety and aesthetics.',
    image: glassBalustrades,
  },
];

const ScrollableSliderWithArrows = () => {
  const scrollRef = useRef(null);

  // Media query to check if the screen is large (desktop mode)
  const isDesktop = useMediaQuery('(min-width:600px)');

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300; // Scroll by 300px
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ width: '100%', paddingTop: '100px' }}>
      {/* Title Box */}
      <Box sx={{ padding: 2 }}>
        <Typography variant="h7" sx={{ fontWeight: 'bold', color: 'black' }}>
          Our Services
        </Typography>
      </Box>

      {/* Scrollable Content Section */}
      <Box sx={{ position: 'relative', width: '100%' }}>
        {/* Left Arrow - Only visible on desktop */}
        {isDesktop && (
          <IconButton
            onClick={() => scroll('left')}
            sx={{
              position: 'absolute',
              top: '50%',
              left: 10,
              transform: 'translateY(-50%)',
              zIndex: 10,
              backgroundColor: 'white',
              boxShadow: 2,
              '&:hover': { backgroundColor: '#f0f0f0' },
            }}
          >
            <ArrowBack />
          </IconButton>
        )}

        {/* Scrollable Content */}
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto', // Ensures horizontal scroll
            scrollSnapType: 'x mandatory',
            padding: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.2)', // Slight black background
            scrollbarWidth: 'thin', // Shows the scrollbar in Firefox
            '&::-webkit-scrollbar': { display: 'block', height: 8 }, // Shows scrollbar in Chrome with custom height
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'black', // Set the scrollbar thumb color to black
              borderRadius: 4,
            },
          }}
        >
          {services.map((service, index) => (
            <Card
              key={index}
              sx={{
                minWidth: 250,
                maxWidth: 250,
                height: 300,
                flexShrink: 0,
                borderRadius: 2,
                boxShadow: 3,
                overflow: 'hidden',
                scrollSnapAlign: 'center',
              }}
            >
              <CardMedia
                component="img"
                alt={service.title}
                image={service.image}
                sx={{
                  height: 150,
                  objectFit: 'cover',
                }}
              />
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {service.title}
                </Typography>
                <Typography variant="body2">{service.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Right Arrow - Only visible on desktop */}
        {isDesktop && (
          <IconButton
            onClick={() => scroll('right')}
            sx={{
              position: 'absolute',
              top: '50%',
              right: 10,
              transform: 'translateY(-50%)',
              zIndex: 10,
              backgroundColor: 'white',
              boxShadow: 2,
              '&:hover': { backgroundColor: '#f0f0f0' },
            }}
          >
            <ArrowForward />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default ScrollableSliderWithArrows;
