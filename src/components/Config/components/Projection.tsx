import React from 'react';
import { connect } from 'react-redux';
import chunk from 'lodash/chunk';

import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

import Step from './common/Step';

import State from '../../../entities/State';
import Status from '../../../entities/Status';
import { getOrderCells, getProjectionStatus } from '../../../redux/selectors';
import { projectionCellToggledAction } from '../../../redux/actions';

interface ProjectionProps extends ProjectionState, ProjectionDispatch {}

interface ProjectionState {
  projectionStatus: Status;
  chunks: string[][];
  projection: Set<String>;
}

interface ProjectionDispatch {
  onProjectionCellToggle: (s: string) => void;
}

const Projection: React.FC<ProjectionProps> = (props: ProjectionProps) => {
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
      
      <Button variant="outline-success">Ajouter une colonne</Button>
    </Step>
  );
};

const mapStateToProps = (state: State): ProjectionState => ({
  projectionStatus: getProjectionStatus(state),
  chunks: chunk(getOrderCells(state), 4),
  projection: state.projection
});

const mapDispatchToProps = (dispatch: Function): ProjectionDispatch => ({
  onProjectionCellToggle: (s: string) => dispatch(projectionCellToggledAction(s))
});

export default connect(mapStateToProps, mapDispatchToProps)(Projection);
