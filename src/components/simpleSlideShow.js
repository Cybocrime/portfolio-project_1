import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useTheme, useMediaQuery } from "@mui/material";

function SimpleSlideshow() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen size is mobile

  const slides = [
    { image: "/images/A-crowd-of-magic-ooyj.jpeg", caption: "Welcome to our homepage!" },
    { image: "/images/A-crowd-of-magic-petp.jpeg", caption: "Explore our services!" },
    { image: "/images/abstract-black-silk-satin-texture-260nw-1883366359.webp", caption: "Get in touch with us!" },
  ];

  return (
    <div style={{ margin: "0px", position: "relative" }}>
      {/* Large text on the left */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "5%",
          zIndex: 2,
          color: "white",
          fontSize: isMobile ? "2.1rem" : "3.2rem", // Smaller font for mobile, larger for desktop
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
          maxWidth: "50%",
          lineHeight: "1.1",
        }}
      >
        We believe in making the extraordinary achievable
      </div>

      {/* Swiper slideshow */}
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        style={{ width: "100%", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} style={{ position: "relative", height: "520px" }}>
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              style={{
                width: "100%",
                borderBottomLeftRadius: "8px",
                borderBottomRightRadius: "8px",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "10%",
                left: "5%",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                padding: "10px 40px",
                borderRadius: "5px",
              }}
            >
              {slide.caption}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default SimpleSlideshow;
