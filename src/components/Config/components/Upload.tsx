import React from 'react';
import { connect } from 'react-redux';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import Step from './common/Step';
import Dropzone from './common/Dropzone';

import State from '../../../entities/State';
import Status from '../../../entities/Status';
import { dbFileChangedAction, orderFileChangedAction } from '../../../redux/actions';
import { getFileStatus } from '../../../redux/selectors';

interface UploadProps extends UploadState, UploadDispatch {}

interface UploadState {
  fileStatus?: Status;
}

interface UploadDispatch {
  onDbChange: (f: File) => void;
  onOrderChange: (f: File) => void;
}

const Upload: React.FC<UploadProps> = (props: UploadProps) => {
  const onDbChange = (files: File[]) => {
    if (files.length < 1) return;
    props.onDbChange(files[0]);
  };

  const onOrderChange = (files: File[]) => {
    if (files.length < 1) return;
    props.onOrderChange(files[0]);
  };

  return (
    <Step eventKey="1" title="Fichiers" status={props.fileStatus}>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Fichier Clients / Transporteurs</Form.Label>
            <Dropzone onChange={onDbChange} />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Fichier Commandes</Form.Label>
            <Dropzone onChange={onOrderChange} />
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
