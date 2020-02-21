import React, { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

import Select from './Select';

import { difference, diffPercentage } from '../../../../utils/core';

interface IDLink {
  header: string;
  cells: string[];
  orderCells: string[];
  IDCell?: number;
  orderIDCell?: number;
  map: Map<string | number, any[]>;
  orderMap: Map<string | number, any[]>;

  onIDCellChange: (s?: string) => void;
  onOrderIDCellChange: (s?: string) => void;
}

const IDLink: React.FC<IDLink> = (props: IDLink) => {
  const [display, setDisplay] = useState<any[]>([]);
  const [missing, setMissing] = useState<any[][]>([]);

  useEffect(() => {
    setMissing(difference(props.orderMap, props.map));
  }, [props.map, props.orderMap]);

  const onClickID = () => {
    const data: any[] = [];
    props.map.forEach((_, key) => data.push(key));
    setDisplay(data.sort());
  };

  const onClickOrder = () => {
    const data: any[] = [];
    props.orderMap.forEach((_, key) => data.push(key));
    setDisplay(data.sort());
  };

  const onClickMissing = () => {
    setDisplay(
      missing.map(m => props.orderIDCell ? m[props.orderIDCell] : 0).sort()
    );
  };

  const percentage = diffPercentage(props.orderMap.size, missing.length);

  let fillColor = 'red';
  if (percentage > 80) {
    fillColor = 'green';
  } else if (percentage > 40) {
    fillColor = 'orange';
  }

  return (
    <>
      <Row>
        <Col>
          <Select
            title={props.header}
            value={props.IDCell}
            onChange={props.onIDCellChange}
            options={props.cells}
          />
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
        <Col>
          <Select
            title={props.header}
            value={props.orderIDCell}
            onChange={props.onOrderIDCellChange}
            options={props.orderCells}
          />
        </Col>
      </Row>

      <Row style={{textAlign: 'center'}}>
        <Col>
          <Button onClick={onClickID} disabled={props.map.size === 0}>
            {props.map.size} {props.header}
          </Button>
        </Col>
        <Col>
          <Button onClick={onClickMissing}>
            {missing.length} absents
          </Button>
        </Col>
        <Col>
          <Button onClick={onClickOrder} disabled={props.orderMap.size === 0}>
            {props.orderMap.size} {props.header}
          </Button>
        </Col>
      </Row>

      <Modal show={display.length > 0} onHide={() => setDisplay([])}>
        <Modal.Header closeButton>
          <Modal.Title>Liste des cellules</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {display.map(m => (
              <ListGroup.Item key={m}>{m}</ListGroup.Item>
            ))}
          </ListGroup>
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
