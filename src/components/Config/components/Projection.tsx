import React, { useState } from 'react';
import { connect } from 'react-redux';
import chunk from 'lodash/chunk';

import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Step from './common/Step';

import State from '../../../entities/State';
import Status from '../../../entities/Status';
import { getProjectionStatus } from '../../../redux/selectors';
import { projectionCellToggledAction, addHeaderAction } from '../../../redux/actions';

interface ProjectionProps extends ProjectionState, ProjectionDispatch {}

interface ProjectionState {
  projectionStatus: Status;
  chunks: string[][];
  projection: Set<String>;
}

interface ProjectionDispatch {
  onProjectionCellToggle: (s: string) => void;
  onAddHeader: (s: string) => void;
}

const Projection: React.FC<ProjectionProps> = (props: ProjectionProps) => {
  const [newHeader, setNewHeader] = useState('');
  const onAddNewHeader = () => {
    const trim = newHeader.trim();
    if (trim === '') return;
    props.onAddHeader(trim);
    props.onProjectionCellToggle(trim);
    setNewHeader('');
  };

  return (
    <Step eventKey="7" title="Projection" status={props.projectionStatus}>
      {props.chunks.map((chunk, index) => (
        <ListGroup key={index} as="ul" horizontal>
          {chunk.map((cell, index) => (
            <ListGroup.Item
              key={index}
              as="li"
              active={props.projection.has(cell)}
              onClick={() => props.onProjectionCellToggle(cell)}
              action
            >
              {cell}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ))}
      
      <Form.Group>
        <Form.Control type="text" value={newHeader} onChange={(e: React.FormEvent<HTMLInputElement>) => setNewHeader(e.currentTarget.value)} />
        <Button variant="outline-success" onClick={onAddNewHeader}>
          Ajouter une colonne
        </Button>
      </Form.Group>
    </Step>
  );
};

const mapStateToProps = (state: State): ProjectionState => ({
  projectionStatus: getProjectionStatus(state),
  chunks: chunk(state.headers, 4),
  projection: state.projection
});

const mapDispatchToProps = (dispatch: Function): ProjectionDispatch => ({
  onProjectionCellToggle: (s: string) => dispatch(projectionCellToggledAction(s)),
  onAddHeader: (s: string) => dispatch(addHeaderAction(s))
});

export default connect(mapStateToProps, mapDispatchToProps)(Projection);
