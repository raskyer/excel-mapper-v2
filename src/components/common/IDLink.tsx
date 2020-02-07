import React, { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import Select from './Select';

import { getMissing } from '../../utils/core';

interface IDLink extends IDLinkState, IDLinkDispatch {}

interface IDLinkState {
  header: string;
  cells: string[];
  orderCells: string[];
  IDCell?: number;
  orderIDCell?: number;
  map: Map<string | number, any[]>;
  orderMap: Map<string | number, any[]>;
}

interface IDLinkDispatch {
  onIDCellChange: (s: string) => void;
  onOrderIDCellChange: (s: string) => void;
}

const IDLink: React.FC<IDLink> = (props: IDLink) => {
  const [display, setDisplay] = useState<any[]>([]);
  const [missing, setMissing] = useState<any[][]>([]);

  useEffect(() => {
    console.log('effect');
    setMissing(getMissing(props.orderMap, props.map));
  }, [props.map, props.orderMap]);

  const onClickID = () => {
    const data: any[] = [];
    props.map.forEach((_, key) => data.push(key));
    setDisplay(data);
  };

  const onClickOrder = () => {
    const data: any[] = [];
    props.orderMap.forEach((_, key) => data.push(key));
    setDisplay(data);
  };

  /*const onClickMissing = () => {
    setDisplay(missing.map(m => m[props.orderCustomerIDCell ? props.orderCustomerIDCell : 0]));
  };*/

  let percentage = Math.round(((props.orderMap.size - missing.length) / props.orderMap.size) * 100);
  if (isNaN(percentage)) {
    percentage = 0;
  }

  let fillColor = 'red';
  if (percentage > 80) {
    fillColor = 'green';
  } else if (percentage > 40) {
    fillColor = 'orange';
  }

  return (
    <>
      <Card>
        <Card.Header>{props.header}</Card.Header>

        <Card.Body>
          <Row>
            <Col style={{textAlign: 'center'}}>
              <Select
                title={props.header}
                value={props.IDCell}
                onChange={props.onIDCellChange}
                options={props.cells}
              />

              <Button onClick={onClickID} disabled={props.map.size === 0}>
                {props.map.size} {props.header}
              </Button>
            </Col>
            <Col xs={12} md={2} style={{textAlign: 'center'}}>
              <CircularProgressbar
                value={percentage}
                text={`${percentage} %`}
                styles={{
                  root: {
                    width: '100px'
                  },
                  path: {
                    stroke: fillColor,
                    strokeWidth: '3px'
                  },
                  trail: {
                    strokeWidth: '3px'
                  },
                  text: {
                    fill: fillColor
                  }
                }}
              />
            </Col>
            <Col style={{textAlign: 'center'}}>
              <Select
                title={props.header}
                value={props.orderIDCell}
                onChange={props.onOrderIDCellChange}
                options={props.orderCells}
              />

              <Button onClick={onClickOrder} disabled={props.orderMap.size === 0}>
                {props.orderMap.size} {props.header}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Modal show={display.length > 0} onHide={() => setDisplay([])}>
        <Modal.Header closeButton>
          <Modal.Title>Missing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {display.map(m => (
            <li key={m}>{m}</li>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setDisplay([])}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default IDLink;
