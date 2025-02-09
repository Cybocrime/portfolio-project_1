import React from "react"; 
import { Box, Typography, IconButton } from "@mui/material"; 
import FacebookIcon from "@mui/icons-material/Facebook"; 
import InstagramIcon from "@mui/icons-material/Instagram"; 
import WhatsAppIcon from "@mui/icons-material/WhatsApp"; 

const Footer = () => (
  <Box
    component="footer"
    sx={{
      backgroundColor: "black",
      color: "white",
      textAlign: "center",
      py: 3,
    }}
  >
    <Typography variant="body1">
      © 2024 My Website. All rights reserved.
    </Typography>

    <Box sx={{ mt: 2 }}>
      {[
        { Icon: FacebookIcon, url: "https://www.facebook.com" },
        { Icon: InstagramIcon, url: "https://www.instagram.com" },
        { Icon: WhatsAppIcon, url: "https://wa.me/1234567890" },
      ].map(({ Icon, url }, index) => (
        <IconButton
          key={index}
          color="inherit"
          onClick={() => window.open(url, "_blank")}
          sx={{ margin: 1 }}
        >
          <Icon />
        </IconButton>
      ))}
    </Box>
  </Box>
);

export default Footer;
