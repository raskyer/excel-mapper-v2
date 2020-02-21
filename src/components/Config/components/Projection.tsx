import React, { useState } from 'react';
import { connect } from 'react-redux';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Step from './common/Step';

import State from '../../../entities/State';
import Status from '../../../entities/Status';
import { getProjectionStatus, getOrderCells } from '../../../redux/selectors';
import { projectionAddedAction, projectionRemovedAction } from '../../../redux/actions';

interface ProjectionProps extends ProjectionState, ProjectionDispatch {}

interface ProjectionState {
  projectionStatus: Status;
  orderCells: string[];
  projection: string[];
}

interface ProjectionDispatch {
  onProjectionAdd: (s: string) => void;
  onProjectionRemove: (s: number) => void;
}

const Projection: React.FC<ProjectionProps> = (props: ProjectionProps) => {
  const [newHeader, setNewHeader] = useState('');
  const onAddNewHeader = () => {
    const trim = newHeader.trim();
    if (trim === '') return;
    props.onProjectionAdd(trim);
    setNewHeader('');
  };

  return (
    <Step eventKey="7" title="Projection" status={props.projectionStatus}>
      <Row>
        <Col>
          <p>Cellules</p>
          <ListGroup as="ul">
            {props.orderCells.map((cell, index) => (
              <ListGroup.Item
                key={index}
                as="li"
                onClick={() => props.onProjectionAdd(cell)}
                disabled={props.projection.includes(cell)}
                action
              >
                {cell}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col>
          <p>=></p>
        </Col>

        <Col>
          <p>Projection</p>
          <ListGroup as="ul">
            {props.projection.map((projection, index) => (
              <ListGroup.Item
                key={index}
                as="li"
                onClick={() => props.onProjectionRemove(index)}
                action
              >
                {projection}
              </ListGroup.Item>
            ))}
          </ListGroup>

          <Form.Group>
            <Form.Control type="text" value={newHeader} onChange={(e: React.FormEvent<HTMLInputElement>) => setNewHeader(e.currentTarget.value)} />
            <Button variant="outline-success" onClick={onAddNewHeader}>
              Ajouter une colonne
            </Button>
          </Form.Group>
        </Col>
      </Row>
    </Step>
  );
};

const mapStateToProps = (state: State): ProjectionState => ({
  projectionStatus: getProjectionStatus(state),
  orderCells: getOrderCells(state),
  projection: state.projection
});

const mapDispatchToProps = (dispatch: Function): ProjectionDispatch => ({
  onProjectionAdd: (s: string) => dispatch(projectionAddedAction(s)),
  onProjectionRemove: (i: number) => dispatch(projectionRemovedAction(i))
});

export default connect(mapStateToProps, mapDispatchToProps)(Projection);
