import React, { useState } from 'react';
import { connect } from 'react-redux';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faArrowsAltH } from '@fortawesome/free-solid-svg-icons/faArrowsAltH';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';

import Step from './common/Step';

import State from '../../../entities/State';
import Status from '../../../entities/Status';
import { getProjectionStatus, getOrderCells } from '../../../redux/selectors';
import { projectionAddedAction, projectionRemovedAction, projectionUppedAction, projectionDownedAction } from '../../../redux/actions';

interface ProjectionProps extends ProjectionState, ProjectionDispatch {}

interface ProjectionState {
  projectionStatus: Status;
  orderCells: string[];
  projection: string[];
}

interface ProjectionDispatch {
  onProjectionAdd: (s: string) => void;
  onProjectionRemove: (s: number) => void;
  onProjectionUp: (s: number) => void;
  onProjectionDown: (s: number) => void;
}

const Projection: React.FC<ProjectionProps> = (props: ProjectionProps) => {
  const [newHeader, setNewHeader] = useState('');
  const onChangeNewHeader = (e: React.FormEvent<HTMLInputElement>) => {
    setNewHeader(e.currentTarget.value);
  };

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
                className="list-group-item d-flex justify-content-between align-items-center"
                as="li"
                disabled={props.projection.includes(cell)}
              >
                {cell}

                <Button
                  variant="success"
                  onClick={() => props.onProjectionAdd(cell)}
                  disabled={props.projection.includes(cell)}
                >
                  <FontAwesomeIcon icon={faArrowRight} size="xs" />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col className="d-flex align-items-center justify-content-center">
          <FontAwesomeIcon icon={faArrowsAltH} size="10x" />
        </Col>

        <Col>
          <p>Projection</p>
          <ListGroup as="ul">
            {props.projection.map((projection, index) => (
              <ListGroup.Item
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
                as="li"
              >
                {projection}

                <div>
                  <Button variant="dark" onClick={() => props.onProjectionUp(index)} disabled={index === 0}>
                    <FontAwesomeIcon icon={faArrowUp} size="xs" />
                  </Button>
                  <Button variant="dark" onClick={() => props.onProjectionDown(index)} disabled={index === props.projection.length - 1}>
                    <FontAwesomeIcon icon={faArrowDown} size="xs" />
                  </Button>
                  <Button variant="danger" onClick={() => props.onProjectionRemove(index)}>
                    <FontAwesomeIcon icon={faTrash} size="xs" />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <Form.Group className="d-flex flex-row mt-2">
            <Form.Control type="text" value={newHeader} onChange={onChangeNewHeader} />
            <Button variant="outline-success" onClick={onAddNewHeader}>
              <FontAwesomeIcon icon={faPlus} size="xs"/>
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
  onProjectionRemove: (i: number) => dispatch(projectionRemovedAction(i)),
  onProjectionUp: (i: number) => dispatch(projectionUppedAction(i)),
  onProjectionDown: (i: number) => dispatch(projectionDownedAction(i))
});

export default connect(mapStateToProps, mapDispatchToProps)(Projection);
