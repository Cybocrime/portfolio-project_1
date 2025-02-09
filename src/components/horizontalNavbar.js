import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import BuildIcon from '@mui/icons-material/Build';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function ResponsiveNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const appBarHeight = 56;

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, to: '/' },
    { text: 'Gallery', icon: <BuildIcon />, to: '/gallery' },
    { text: 'Contact', icon: <ContactMailIcon />, to: '/contact' },
  ];

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  return (
    <>
      {/* Fixed Navigation Bar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.94)', color: 'white',
          backdropFilter: 'blur(5px)',
          top: 0,
          height: appBarHeight,
        }}
      >
        <Toolbar
          sx={{
            height: appBarHeight,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: 'Arial, sans-serif',
              fontSize: isMobile ? '16px' : '24px',
              color: 'white',
            }}
          >
            My Website
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                edge="end"
                onClick={() => toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>

              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => toggleDrawer(false)}
                sx={{
                  '& .MuiDrawer-paper': {
                    width: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white',
                    backdropFilter: 'blur(5px)',
                  },
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'top',
                    alignItems: 'left',
                  }}
                >
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => toggleDrawer(false)}
                    sx={{
                      position: 'absolute',
                      top: 17,
                      right: 10,
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      padding: '3px',
                      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                      },
                    }}
                  >
                    <ChevronRightIcon sx={{ fontSize: '20px', color: '#333' }} />
                  </IconButton>

                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: '300px',
                      marginTop: '50px',
                      paddingLeft: '20px',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '8px',
                    }}
                  >
                    <List>
                      {menuItems.map((item, index) => (
                        <ListItem key={index}>
                          <Link
                            to={item.to}
                            style={{
                              textDecoration: 'none',
                              color: 'white',
                              marginBottom: '10px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            onClick={() => toggleDrawer(false)}
                          >
                            <span style={{ fontSize: '15px', border: '2px solid white', borderRadius: '15px', padding: '3px' }}>
                              {React.cloneElement(item.icon, { sx: { fontSize: '15px' } })}
                            </span>
                            <span style={{ marginLeft: '17px', fontSize: '15px' }}>{item.text}</span>
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'absolute',
                      bottom: 30,
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '50px',
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '25%',
                          padding: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <WhatsAppIcon sx={{ fontSize: '20px', color: 'black' }} />
                      </span>

                      <span
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '25%',
                          padding: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <InstagramIcon sx={{ fontSize: '20px', color: 'black' }} />
                      </span>

                      <span
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '25%',
                          padding: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <FacebookIcon sx={{ fontSize: '20px', color: 'black' }} />
                      </span>
                    </div>
                  </div>
                </div>
              </Drawer>
            </>
          ) : (
            <>
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.to}
                  style={{
                    textDecoration: 'none',
                    fontSize: '14px',
                    marginRight: '30px',
                    color: 'white',
                    fontWeight: 600,
                  }}
                >
                  {item.text}
                </Link>
              ))}
              <IconButton
                color="secondary"
                onClick={() => console.log('Instagram clicked')}
                sx={{
                  marginRight: '10px',
                  backgroundColor: 'white',
                  borderRadius: '25%',
                  padding: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <InstagramIcon sx={{ fontSize: '20px', color: 'black' }} />
              </IconButton>

              <IconButton
                color="primary"
                onClick={() => console.log('Facebook clicked')}
                sx={{
                  marginRight: '10px',
                  backgroundColor: 'white',
                  borderRadius: '25%',
                  padding: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FacebookIcon sx={{ fontSize: '20px', color: 'black' }} />
              </IconButton>

              <IconButton
                color="primary"
                onClick={() => console.log('Dialing WhatsApp')}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '25%',
                  padding: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <WhatsAppIcon sx={{ fontSize: '20px', color: 'black' }} />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}

export default ResponsiveNavbar;
