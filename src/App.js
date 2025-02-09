import React, { useState, useEffect, Suspense } from 'react';  
import { Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import ResponsiveNavbar from './components/horizontalNavbar.js';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css'; 
import '@fontsource/poppins/700.css'; 
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Lazy load components
const Footer = React.lazy(() => import('./components/footer.js'));
const Homepage = React.lazy(() => import('./pages/homePage.js'));
const ContactUs = React.lazy(() => import('./pages/contact.js'));
const Gallery = React.lazy(() => import('./pages/gallery.js'));
const AdminPage = React.lazy(() => import('./components/adminPage.js'));
const Preloader = React.lazy(() => import('./components/preloader.js'));
const ModalComponent = React.lazy(() => import('./components/modalComponent.js'));

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins',
    fontWeight: 300, 
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          backgroundColor: '#EDEDED',
        },
      },
    },
  },
});

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {loading ? (
        <Suspense fallback={<div>Loading...</div>}>
          <Preloader />
        </Suspense>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
          <ResponsiveNavbar />
          <Box component="main" sx={{ flex: 1, width: '100%', marginTop: '56px', position: 'relative' }}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/admin-page" element={<AdminPage />} />
            </Routes>
          </Box>
          <Suspense fallback={<div>Loading Footer...</div>}>
            <Footer />
          </Suspense>
        </Box>
      )}

      {/* ModalComponent */}
      <Suspense fallback={<div>Loading Modal...</div>}>
        <Box sx={{ position: 'fixed', bottom: '20px', right: '13px', zIndex: 1200 }}>
          <ModalComponent />
        </Box>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
