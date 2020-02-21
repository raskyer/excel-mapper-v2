import React from 'react';

import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

interface DisplayModalProps {
  display: any[];
  onHide: () => void;
}

const DisplayModal: React.FC<DisplayModalProps> = (props: DisplayModalProps) => (
  <Modal show={props.display.length > 0} onHide={props.onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Liste des cellules</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <ListGroup style={{ height: '400px', overflowY: 'scroll' }}>
        {props.display.map((m, i) => (
          <ListGroup.Item key={i}>{m}</ListGroup.Item>
        ))}
      </ListGroup>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="danger" onClick={props.onHide}>
        Fermer
      </Button>
    </Modal.Footer>
  </Modal>
);

export default DisplayModal;
