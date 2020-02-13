import React from 'react';
import { connect } from 'react-redux';

import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import { dbFileChangedAction, orderFileChangedAction, activeKeyChangedAction } from '../redux/reducer';
import State from '../entities/State';

interface UploadProps extends UploadState, UploadDispatch {}

interface UploadState {
  activeKeys: Set<string>;
}

interface UploadDispatch {
  onDbChange: (f: File) => void;
  onOrderChange: (f: File) => void;
  onActiveKeyChange: (s: string) => void;
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
      <Accordion.Toggle as={Card.Header} eventKey="1" onClick={() => props.onActiveKeyChange('0')}>
        Fichiers
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={props.activeKeys.has('0') ? '1' : '0'}>
        <Card.Body>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Fichier Clients / Transporteurs</Form.Label>
                <Form.Control type="file" onChange={onDbChange} required />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Fichier Commandes</Form.Label>
                <Form.Control type="file" onChange={onOrderChange} required />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

const mapStateToProps = (state: State) => ({
  activeKeys: state.activeKeys
});

const mapDispatchToProps = (dispatch: Function) => ({
  onDbChange: (f: File) => dispatch(dbFileChangedAction(f)),
  onOrderChange: (f: File) => dispatch(orderFileChangedAction(f)),
  onActiveKeyChange: (s: string): void => dispatch(activeKeyChangedAction(s))
});

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
