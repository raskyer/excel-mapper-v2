import React from 'react';
import { connect } from 'react-redux';

import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { dbFileChangedAction, orderFileChangedAction } from '../redux/reducer';

interface UploadProps extends UploadDispatch {}

interface UploadDispatch {
  onDbChange: (file: File) => void;
  onOrderChange: (file: File) => void;
}

const Upload: React.FC<UploadProps> = (props) => {
  const onDbChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files) return;
    props.onDbChange(e.currentTarget.files[0]);
  };

  const onOrderChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files) return;
    props.onOrderChange(e.currentTarget.files[0]);
  };

  return (
    <Card>
      <Card.Header>Fichiers</Card.Header>
      <Card.Body>
        <Form>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Fichier Clients / Transporteurs</Form.Label>
                <Form.Control type="file" onChange={onDbChange} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Fichier Commandes</Form.Label>
                <Form.Control type="file" onChange={onOrderChange} isValid={true} />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

const mapDispatchToProps = (dispatch: Function) => ({
  onDbChange: (file: File) => dispatch(dbFileChangedAction(file)),
  onOrderChange: (file: File) => dispatch(orderFileChangedAction(file))
});

export default connect(undefined, mapDispatchToProps)(Upload);
