// src/App.js
import React from 'react';
import UploadForm from './components/UploadForm';
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

function App() {
  return (
    <Container>
      <div className="App">
        <h1>Pet Celebrity Look-Alike Finder</h1>
        <UploadForm />
      </div>
    </Container>
  );
}

export default App;
