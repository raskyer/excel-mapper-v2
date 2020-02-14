import React from 'react';
import { connect } from 'react-redux';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import Step from './common/Step';
import State from '../entities/State';
import Status from '../entities/Status';
import { dbFileChangedAction, orderFileChangedAction } from '../redux/actions';
import { getFileStatus } from '../redux/selector';

interface UploadProps extends UploadState, UploadDispatch {}

interface UploadState {
  fileStatus?: Status;
}

interface UploadDispatch {
  onDbChange: (f: File) => void;
  onOrderChange: (f: File) => void;
}

const Upload: React.FC<UploadProps> = (props: UploadProps) => {
  const onDbChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files) return;
    if (e.currentTarget.files.length > 0) {
      props.onDbChange(e.currentTarget.files[0]);
    }
  };

  const onOrderChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files) return;
    if (e.currentTarget.files.length > 0) {
      props.onOrderChange(e.currentTarget.files[0]);
    }
  };

  return (
    <Step eventKey="1" title="Fichiers" state={props.fileStatus}>
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
    </Step>
  );
};

const mapStateToProps = (state: State): UploadState => ({
  fileStatus: getFileStatus(state)
});

const mapDispatchToProps = (dispatch: Function): UploadDispatch => ({
  onDbChange: (f: File) => dispatch(dbFileChangedAction(f)),
  onOrderChange: (f: File) => dispatch(orderFileChangedAction(f))
});

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
