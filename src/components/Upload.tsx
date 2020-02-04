import React from 'react';
import { connect } from 'react-redux';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

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
    <Form>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Choissisez un fichier</Form.Label>
            <Form.Control type="file" onChange={onDbChange} />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Choissisez un fichier </Form.Label>
            <Form.Control type="file" onChange={onOrderChange} />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

const mapDispatchToProps = (dispatch: Function) => ({
  onDbChange: (file: File) => dispatch(dbFileChangedAction(file)),
  onOrderChange: (file: File) => dispatch(orderFileChangedAction(file))
});

export default connect(undefined, mapDispatchToProps)(Upload);
