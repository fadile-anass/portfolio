// ImageModal.js
import React from 'react';
import { Modal } from 'react-bootstrap';

const ImageModal = ({ show, onHide, imageUrl }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Body>
        <img src={imageUrl} alt="Full size" style={{ width: '100%', height: 'auto' }} />
      </Modal.Body>
    </Modal>
  );
};

export default ImageModal;