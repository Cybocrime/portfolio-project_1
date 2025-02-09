import React, { useState, useEffect, useRef } from 'react';
import { storage } from '../firebase.js';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // Include lightbox default styles
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress from Material-UI

const InfiniteScrollGallery = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); // New state to track modal
  const [error, setError] = useState(null); // State to track error
  const allImages = useRef([]);
  const galleryEndRef = useRef(null);
  const itemsPerPage = 10;

  const fetchImages = async () => {
    setIsLoading(true);
    setError(null); // Reset error state before fetching

    try {
      const storageRef = ref(storage, 'media'); // Replace 'media' with your Firebase storage folder
      const result = await listAll(storageRef);
      const urls = await Promise.all(result.items.map((item) => getDownloadURL(item)));
      allImages.current = urls;
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError('Failed to fetch images. Please try again later.');
      console.error('Error fetching images:', err); // Log error for debugging but avoid exposing sensitive info
    }
  };

  const loadMoreImages = async () => {
    if (isLoading || allImages.current.length === 0) return;

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const newImages = allImages.current.slice(startIndex, endIndex);

    setImages((prev) => [...prev, ...newImages]);
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    const init = async () => {
      await fetchImages();
      loadMoreImages();
    };
    init();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          loadMoreImages();
        }
      },
      { threshold: 1.0 }
    );

    if (galleryEndRef.current) observer.observe(galleryEndRef.current);

    return () => observer.disconnect();
  }, [page]);

  const openLightbox = (index) => {
    if (isLightboxOpen) return; // Prevent opening multiple instances
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    // Disable body scrolling for the lightbox
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setTimeout(() => setLightboxIndex(null), 300); // Delay to allow proper unmount
    document.body.style.overflow = 'auto'; // Re-enable body scrolling
  };

  return (
    <div>
      {/* Show error message if fetch fails */}
      {error && (
        <div
          style={{
            width: '100%',
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            borderRadius: '20px',
            color: 'red',
            fontWeight: 'bold',
          }}
        >
          {error}
        </div>
      )}

      {/* Show CircularProgress preloader when images are loading */}
      {isLoading && !error && (
        <div
          style={{
            width: '100%',
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            borderRadius: '20px',
          }}
        >
          <CircularProgress size={50} />
        </div>
      )}
      
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '4px',
          pointerEvents: isLightboxOpen ? 'none' : 'auto', // Disable interactions with gallery when modal is open
          height: isLightboxOpen ? '100vh' : 'auto', // Prevent gallery scroll when modal is open
          overflow: isLightboxOpen ? 'hidden' : 'auto', // Prevent scroll when modal is open
        }}
      >
        {/* Display images after fetch */}
        {!isLoading && !error &&
          images.map((src, index) => (
            <div
              key={index}
              className="lazy-image"
              style={{
                width: '100%',
                height: '150px',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
                borderRadius: '0px',
              }}
              onClick={() => openLightbox(index)}
            >
              <img
                src={src}
                alt={`Image ${index}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '0px',
                }}
              />
            </div>
          ))}
      </div>
      <div ref={galleryEndRef} style={{ height: '50px', marginTop: '10px' }} />

      {/* Lightbox Implementation */}
      {isLightboxOpen && lightboxIndex !== null && images[lightboxIndex] && (
        <Lightbox
          mainSrc={images[lightboxIndex]}
          nextSrc={images[(lightboxIndex + 1) % images.length]}
          prevSrc={images[(lightboxIndex + images.length - 1) % images.length]}
          onCloseRequest={closeLightbox}
          onMovePrevRequest={() => {
            setLightboxIndex((lightboxIndex + images.length - 1) % images.length);
          }}
          onMoveNextRequest={() => {
            setLightboxIndex((lightboxIndex + 1) % images.length);
          }}
          reactModalStyle={{
            overlay: { zIndex: 1301 }, // Ensure it's above other elements
          }}
        />
      )}
    </div>
  );
};

export default InfiniteScrollGallery;
