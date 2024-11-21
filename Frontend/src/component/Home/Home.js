import React, { useState } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import './Home.css';

const Home = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [rollNumber, setRollNumber] = useState('');
  const [retrieveRollNumber, setRetrieveRollNumber] = useState('');
  const [retrievedVideo, setRetrievedVideo] = useState('');

  // Handle Video Upload
  const handleUpload = async () => {
    if (!videoFile || !rollNumber) {
      alert('Please select a video file and enter a roll number.');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('rollNumber', rollNumber);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData);;
      alert(`Video uploaded successfully for Roll Number: ${rollNumber}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Error uploading video.');
    }
  };

  // Handle Video Retrieval
  const handleFetch = async () => {
    if (!retrieveRollNumber) {
      alert('Please enter a roll number to retrieve the video.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/video/roll/${rollNumber}`, {
        responseType: 'blob', // Ensures we get the video as binary data
      });
      const videoURL = URL.createObjectURL(response.data);
      setRetrievedVideo(videoURL);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Error fetching video.');
    }
  };

  return (
    <div className="container">
      <h1>Interview Trainer - Video Storage</h1>

      {/* Upload Section */}
      <div className="upload-section">
        <h2>Upload Video</h2>
        <input
          type="text"
          placeholder="Enter Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
        />
        <button onClick={handleUpload}>Upload</button>
      </div>

      {/* Retrieve Section */}
      <div className="retrieve-section">
        <h2>Retrieve Video</h2>
        <input
          type="text"
          placeholder="Enter Roll Number"
          value={retrieveRollNumber}
          onChange={(e) => setRetrieveRollNumber(e.target.value)}
        />
        <button onClick={handleFetch}>Fetch Video</button>
      </div>

      {/* Video Playback */}
      {retrievedVideo && (
        <div className="video-playback">
          <h2>Video Playback</h2>
          <ReactPlayer url={retrievedVideo} controls={true} />
        </div>
      )}
    </div>
  );
};

export default Home;
