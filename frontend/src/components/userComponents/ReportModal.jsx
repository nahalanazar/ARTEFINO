// ReportModal.js
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ReportModal = ({ showModal, handleClose, handleReport, postToReport }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  const handleFormSubmit = () => {
    if (reason.trim() !== '') {
      // Pass the reporting details to the parent component
      handleReport(postToReport, { reason, description });
      handleClose();
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Report Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="reason">
            <Form.Label>Reason for Reporting</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter additional details"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleFormSubmit} disabled={!reason.trim()}>
          Submit Report
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportModal;
