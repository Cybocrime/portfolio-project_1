import React from "react"; 
import { Grid, Box, Typography } from "@mui/material"; 

// Import your custom SVGs
import { ReactComponent as AccessTimeIcon } from "../assets/icons/smart-smart-watch-timer-svgrepo-com (1).svg";
import { ReactComponent as BuildIcon } from "../assets/icons/build-svgrepo-com.svg";
import { ReactComponent as AttachMoneyIcon } from "../assets/icons/price-label-price-tag-svgrepo-com.svg";
import { ReactComponent as DesignServicesIcon } from "../assets/icons/design-edit-svgrepo-com.svg";
import { ReactComponent as InventoryIcon } from "../assets/icons/quality-medal-svgrepo-com.svg";
import { ReactComponent as SpeedIcon } from "../assets/icons/optimation-seo-speed-svgrepo-com.svg";
import { ReactComponent as ThumbUpIcon } from "../assets/icons/thumb-up-shield-svgrepo-com.svg";

const AboutUs = () => {
  const data = [
    { icon: <AccessTimeIcon />, title: "24/7 Availability", description: "We're here for you any time, day or night." },
    { icon: <BuildIcon />, title: "Expert Installation", description: "Our team of certified professionals ensures perfect installation." },
    { icon: <AttachMoneyIcon />, title: "Affordable Pricing", description: "High-quality service at competitive rates." },
    { icon: <DesignServicesIcon />, title: "Custom Designs", description: "Tailored solutions to match your style." },
    { icon: <InventoryIcon />, title: "Quality Materials", description: "We only use premium, durable glass." },
    { icon: <SpeedIcon />, title: "Fast Service", description: "Quick turnaround to minimize your downtime." },
    { icon: <ThumbUpIcon />, title: "Satisfaction Guarantee", description: "We ensure 100% satisfaction with our work." },
  ];

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: "#f4f4f4", pt: 10, pb: 16 }} // pt for padding top and pb for padding bottom
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#333",
          mb: 2, // Margin bottom simplified
        }}
      >
        Why Join Us?
      </Typography>
      <Grid
        container
        spacing={3}
        sx={{
          p: 2,
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        {data.map(({ icon, title, description }, index) => (
          <Grid
            item
            xs={12} sm={6} md={4} lg={3}
            key={index}
            sx={{ display: "flex", justifyContent: "center", alignItems: "stretch" }}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={2}
              boxShadow="0px 4px 10px rgba(0, 0, 0, 0.2)"
              borderRadius={5}
              sx={{
                textAlign: "center",
                border: "1px solid #ddd",
                width: "100%",
                minHeight: "250px",
                backgroundColor: "white",
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: 40, height: 40 }}>
                {React.cloneElement(icon, { sx: { width: 25, height: 25 } })}
              </Box>
              <Typography variant="h6" mt={2} sx={{ color: "#333" }}>
                {title}
              </Typography>
              <Typography variant="body2" mt={1} sx={{ color: "#555" }}>
                {description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AboutUs;
