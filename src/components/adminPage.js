// src/pages/AdminPage.js
import React, { useState, useEffect } from 'react';
import { auth, storage } from '../firebase.js'; // Firebase initialization
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, listAll, deleteObject } from 'firebase/storage';
import ImageGalleryWithLightbox from './imageGalleryWithLightBox';  // Correct import path // Import the gallery component
import { getDownloadURL } from 'firebase/storage';  // Remove this from firebase.js


const AdminPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch uploaded images
  const fetchImages = async () => {
    try {
      const storageRef = ref(storage, 'media');  // Reference to the 'media' folder in Firebase Storage
      const result = await listAll(storageRef);  // List all the files in the 'media' folder
      const urls = await Promise.all(result.items.map((item) => getDownloadURL(item))); // Get download URLs
      setImages(urls);  // Store the URLs in the state
    } catch (error) {
      console.error('Failed to fetch images:', error.message);
    }
  };
  

  useEffect(() => {
    if (isAuthenticated) {
      fetchImages();
    }
  }, [isAuthenticated]);

  // Admin login
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  // Upload image
  const handleUpload = async () => {
    if (!file) return alert('Please select a file!');
    const storageRef = ref(storage, `media/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      alert('Image uploaded successfully!');
      fetchImages(); // Refresh image list
    } catch (error) {
      console.error('Upload failed:', error.message);
    }
  };

  // Delete image
  const handleDelete = async (url) => {
    try {
      const fileRef = ref(storage, `media/${url.split('/').pop()}`); // Extract file name and delete it
      await deleteObject(fileRef);
      alert('Image deleted successfully!');
      fetchImages(); // Refresh image list
    } catch (error) {
      console.error('Delete failed:', error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Admin Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload}>Upload Image</button>
      </div>
      <div>
        <h2>Uploaded Images</h2>
        <ImageGalleryWithLightbox
          images={images}
          fetchImages={fetchImages}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default AdminPage;
