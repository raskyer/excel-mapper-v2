import React from 'react';
import { connect } from 'react-redux';
import chunk from 'lodash/chunk';

import ListGroup from 'react-bootstrap/ListGroup';

import Step from './common/Step';

import State from '../entities/State';
import { getOrderCells } from '../redux/selectors';

interface ProjectionProps extends ProjectionState, ProjectionDispatch {}

interface ProjectionState {
  chunks: string[][],
  activeSells: Set<String>
}

interface ProjectionDispatch {}

const Projection: React.FC<ProjectionProps> = (props: ProjectionProps) => {
  const onClickCell = (cell: string) => {
    console.log(cell);
  };

  return (
    <Step eventKey="7" title="Projection" state="dark">
      {props.chunks.map((chunk, index) => (
        <ListGroup key={index} as="ul" horizontal>
          {chunk.map((cell, index) => (
            <ListGroup.Item
              key={index}
              as="li"
              active={props.activeSells.has(cell)}
              onClick={() => onClickCell(cell)}
              action
            >
              {cell}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ))}
    </Step>
  );
};

const mapStateToProps = (state: State): ProjectionState => ({
  chunks: chunk(getOrderCells(state), 4),
  activeSells: new Set()
});

export default connect(mapStateToProps)(Projection);
