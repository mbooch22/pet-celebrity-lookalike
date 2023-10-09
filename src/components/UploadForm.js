import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  background-color: #222;
  color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
  font-family: 'Helvetica Neue', sans-serif;
`;

const Inputs = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
`;

const InputFile = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
`;

const InputNumber = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  background-color: #444;
  color: #fff;
  border: none;
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow: hidden;
  margin-top: 20px;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 400px;
  margin-top: 10px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.5s ease-in-out;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 20px;
`;

const LoadingContainer = styled.div`
  position: fixed;
  width: 80%;
  height: 20%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 999;
  color: black;
`;

const LoadingBar = styled.div`
  width: ${(props) => props.progress}%;
  height: 10px;
  background-color: #4caf50;
  transition: width 0.3s;
  margin-top: 10px;
`;

const Title = styled.h2`
  font-family: 'Pacifico', cursive;
  color: #4caf50;
  margin-bottom: 20px;
`;

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [numMatches, setNumMatches] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      if (loadingProgress > 0 && loadingProgress < 100) {
        setLoadingProgress((prevProgress) => Math.min(prevProgress + 10, 100));
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [loadingProgress]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleNumMatchChange = (e) => {
    setNumMatches(Math.abs(parseInt(e.target.value)));
  }

  const handleUpload = async () => {
    if (!file) {
      //Set Popup message
      alert("No File uploaded!")
      return;
    }
    setLoadingProgress(1);
    setMatches([]);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('numMatches', numMatches);

    try {
      const url = "http://ec2-18-220-221-154.us-east-2.compute.amazonaws.com:5000/upload"
      // const url = "http://localhost:5000/upload"
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      setMatches(response.data.result);
      setCurrentIndex(0);
      setLoadingProgress(100);
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoadingProgress(0);
      alert('Error uploading file:', error)
    }
  };

  const getImageSourcePath = (match) => {
    if (match.image_path.toLowerCase().includes("celebrities")) {
      return `dataset/${match.image_path}`;
    }
    return `dataset/celebrities/${match.label}/${match.image_path}`;
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % matches.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + matches.length) % matches.length);
  };

  return (
    <Container>
      <Title>Find Your Pet's Celebrity Look-Alike</Title>
      <Inputs>
        <InputFile type="file" onChange={handleFileChange} />
        <label>Select # of Matches to fetch: </label>
        <InputNumber type="number" value={numMatches} onChange={handleNumMatchChange}/>
      </Inputs>
      <Button onClick={handleUpload}>Find Celebrity Look-Alike</Button>
      {loadingProgress > 0 && loadingProgress < 100 ? (
        <LoadingContainer>
          <p>Loading...</p>
          <LoadingBar progress={loadingProgress} />
        </LoadingContainer>
      ) : (
        <ImageContainer>
          {file && <Image src={URL.createObjectURL(file)} alt="Uploaded" />}

          {matches.length > 0 && (
            <>
              <Image
                src={getImageSourcePath(matches[currentIndex])}
                alt={matches[currentIndex].label}
              />
              <p>Name: {matches[currentIndex].label}</p>
              <p>Score: {Math.round(matches[currentIndex].similarity * 1000)}%</p>
            </>
          )}
        </ImageContainer>
      )}

      {matches.length > 1 && (
        <ButtonContainer>
          <Button onClick={handlePrev}>Previous</Button>
          <Button onClick={handleNext}>Next</Button>
        </ButtonContainer>
      )}
    </Container>
  );
};

export default UploadForm;
