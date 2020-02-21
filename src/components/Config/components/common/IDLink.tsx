import React, { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Select from './Select';
import DisplayModal from './DisplayModal';
import EyeAddon from './EyeAddon';

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
            addon={<EyeAddon onClick={onClickID} disabled={props.map.size === 0} />}
          />
        </Col>
        <Col xs={12} md={2} className="text-center">
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
            addon={<EyeAddon onClick={onClickOrder} disabled={props.orderMap.size === 0} />}
          />
        </Col>
      </Row>

      <Row className="text-center mt-4">
        <Col>
          <Button variant="success">
            {props.orderMap.size - missing.length} presents
          </Button>
          <Button variant="danger" onClick={onClickMissing}>
            {missing.length} absents
          </Button>
        </Col>
      </Row>

      <DisplayModal display={display} onHide={() => setDisplay([])} />
    </>
  );
};

export default IDLink;
