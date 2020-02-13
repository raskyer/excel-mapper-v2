import React from 'react';
import { connect } from 'react-redux';
import chunk from 'lodash/chunk';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import State from '../entities/State';
import { getOrderCells } from '../redux/selector';

interface ColumnsProps extends ColumnsState, ColumnsDispatch {}

interface ColumnsState {
  chunks: string[][],
  activeSells: Set<String>
}

interface ColumnsDispatch {}

const Columns: React.FC<ColumnsProps> = (props: ColumnsProps) => {
  const onClickCell = (cell: string) => {
    console.log(cell);
  };

  return (
    <Card>
      <Card.Header>Projection</Card.Header>
      <Card.Body>
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
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = (state: State): ColumnsState => ({
  chunks: chunk(getOrderCells(state), 4),
  activeSells: new Set()
});

export default connect(mapStateToProps)(Columns);
