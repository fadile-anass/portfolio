import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, ProgressBar, Form, Button, ListGroup, Modal } from "react-bootstrap";
import Particle from "../Particle";
import { FaDownload, FaEye, FaHistory } from 'react-icons/fa';
import './ImageGenerator.css';

function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [selectedShape, setSelectedShape] = useState(1);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedHistoryImage, setSelectedHistoryImage] = useState(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('imageGeneratorHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const response = await axios.post('http://localhost:8000/generateImage', { prompt, selectedShape }, {
        responseType: 'arraybuffer',
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      
      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          '',
        ),
      );
      const imageUrl = `data:image/png;base64,${base64}`;
      setGeneratedImage(imageUrl);

      // Add to history
      const newHistory = [{ prompt, imageUrl }, ...history.slice(0, 9)];
      setHistory(newHistory);
      localStorage.setItem('imageGeneratorHistory', JSON.stringify(newHistory));
    } catch (err) {
      setError('Error generating image. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (imageUrl, promptText) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated_image_${promptText.slice(0, 20)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewHistoryImage = (item) => {
    setSelectedHistoryImage(item);
    setShowModal(true);
  };

  return (
    <Container fluid className="image-generator-section">
      <Particle />
      <Container>
        <Row>
          <Col md={9} className="main-content">
            <h1 className="title">
              AI <strong className="purple">Image Generator</strong>
            </h1>
<form onSubmit={handleSubmit} className="image-generator-form">
  <input
    type="text"
    value={prompt}
    onChange={(e) => {
      console.log('Input changed');
      setPrompt(e.target.value);
    }}
    onClick={() => console.log('Input clicked')}
    placeholder="Enter your image prompt"
    required
    className="image-generator-input"
  />
  <Form.Select 
    value={selectedShape} 
    onChange={(e) => {
      console.log('Select changed');
      setSelectedShape(Number(e.target.value));
    }}
    onClick={() => console.log('Select clicked')}
    className="image-generator-select"
  >
    <option value={1}>Square</option>
    <option value={2}>Circle</option>
    <option value={3}>Rounded Square</option>
    <option value={4}>Horizontal Rectangle</option>
    <option value={5}>Vertical Rectangle</option>
  </Form.Select>
  <Button 
    type="submit" 
    disabled={loading} 
    className="generate-button"
    onClick={() => console.log('Button clicked')}
  >
    {loading ? 'Generating...' : 'Generate Image'}
  </Button>
</form>
            {error && <p className="error-message">{error}</p>}
            {loading && (
              <div className="progress-container">
                <ProgressBar now={progress} label={`${progress}%`} variant="info" animated />
              </div>
            )}
            {generatedImage && (
              <div className="generated-image-container">
                <img src={generatedImage} alt="Generated" className="generated-image" />
                <Button onClick={() => handleDownload(generatedImage, prompt)} className="download-button">
                  <FaDownload /> Download Image
                </Button>
              </div>
            )}
          </Col>
          <Col md={3} className="history-sidebar">
            <h3><FaHistory /> History</h3>
            <ListGroup>
              {history.map((item, index) => (
                <ListGroup.Item key={index} className="history-item">
                  <img src={item.imageUrl} alt={item.prompt} className="history-thumbnail" />
                  <div className="history-item-content">
                    <p>{item.prompt}</p>
                    <div className="history-item-actions">
                      <Button variant="outline-primary" size="sm" onClick={() => handleViewHistoryImage(item)}>
                        <FaEye /> View
                      </Button>
                      <Button variant="outline-success" size="sm" onClick={() => handleDownload(item.imageUrl, item.prompt)}>
                        <FaDownload /> Download
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedHistoryImage?.prompt}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={selectedHistoryImage?.imageUrl} alt={selectedHistoryImage?.prompt} className="modal-image" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={() => handleDownload(selectedHistoryImage?.imageUrl, selectedHistoryImage?.prompt)}>
            <FaDownload /> Download
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ImageGenerator;