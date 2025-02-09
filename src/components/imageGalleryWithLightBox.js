import React, { useState, useEffect } from 'react';
import { storage } from '../firebase.js';
import { ref, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import Gallery from 'react-photo-gallery';
import 'react-image-lightbox/style.css'; // Include default styles
import Lightbox from 'react-image-lightbox';

const ImageGalleryWithLightbox = () => {
  const [images, setImages] = useState([]);
  const [imageRefs, setImageRefs] = useState([]); // Store references to Firebase storage
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Fetch images and their refs
  const fetchImages = async () => {
    try {
      const storageRef = ref(storage, 'media');
      const result = await listAll(storageRef);
      const urls = await Promise.all(result.items.map((item) => getDownloadURL(item)));
      setImages(urls);
      setImageRefs(result.items); // Store Firebase references
    } catch (error) {
      console.error('Failed to fetch images:', error.message);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Preload selected image when Lightbox opens
  useEffect(() => {
    if (selectedImageIndex !== null) {
      const img = new Image();
      img.src = images[selectedImageIndex];
      img.onload = () => setIsImageLoaded(true);
    } else {
      setIsImageLoaded(false);
    }
  }, [selectedImageIndex, images]);

  // Delete selected image
  const handleDelete = async () => {
    if (selectedImageIndex === null) return;

    try {
      const fileRef = imageRefs[selectedImageIndex]; // Use the exact Firebase reference
      await deleteObject(fileRef);
      alert('Image deleted successfully!');
      setSelectedImageIndex(null); // Close the Lightbox
      fetchImages(); // Refresh image list
    } catch (error) {
      console.error('Delete failed:', error.message);
    }
  };

  return (
    <div>
      <h2>Image Gallery</h2>
      <Gallery
        photos={images.map((url) => ({ src: url, width: 1, height: 1 }))}
        onClick={(event, { index }) => setSelectedImageIndex(index)}
      />
      {selectedImageIndex !== null && isImageLoaded && (
        <Lightbox
          mainSrc={images[selectedImageIndex]}
          nextSrc={images[(selectedImageIndex + 1) % images.length]}
          prevSrc={images[(selectedImageIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setSelectedImageIndex(null)}
          onMovePrevRequest={() =>
            setSelectedImageIndex((selectedImageIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setSelectedImageIndex((selectedImageIndex + 1) % images.length)
          }
          toolbarButtons={[
            <button
              key="delete"
              style={{
                padding: '10px',
                backgroundColor: '#f44336',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              onClick={handleDelete}
            >
              Delete
            </button>,
          ]}
        />
      )}
      {selectedImageIndex !== null && !isImageLoaded && (
        <div>Loading image...</div> // Fallback during preload
      )}
    </div>
  );
};

export default ImageGalleryWithLightbox;
