import React from 'react';
import { connect } from 'react-redux';
import chunk from 'lodash/chunk';

import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';

import State from '../entities/State';
import { getOrderCells } from '../redux/selector';
import { activeKeyChangedAction } from '../redux/reducer';

interface ColumnsProps extends ColumnsState, ColumnsDispatch {}

interface ColumnsState {
  chunks: string[][],
  activeSells: Set<String>
}

interface ColumnsDispatch {
  onActiveKeyChange: (s: string) => void;
}

const Columns: React.FC<ColumnsProps> = (props: ColumnsProps) => {
  const onClickCell = (cell: string) => {
    console.log(cell);
  };

  return (
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey="1" onClick={() => props.onActiveKeyChange('6')}>
        Projection
      </Accordion.Toggle>
      <Accordion.Collapse eventKey="1">
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
      </Accordion.Collapse>
    </Card>
  );
};

const mapStateToProps = (state: State): ColumnsState => ({
  chunks: chunk(getOrderCells(state), 4),
  activeSells: new Set()
});

const mapDispatchToProps = (dispatch: Function): ColumnsDispatch => ({
  onActiveKeyChange: (s: string): void => dispatch(activeKeyChangedAction(s))
});

export default connect(mapStateToProps, mapDispatchToProps)(Columns);
