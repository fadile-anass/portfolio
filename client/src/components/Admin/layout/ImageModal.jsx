import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ImageModal = ({ show, onHide, imageUrl }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body>
        <img src={imageUrl} alt="Large" className="img-fluid" />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageModal;
