import React, { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Select from './Select';
import DisplayModal from './DisplayModal';
import EyeAddon from './EyeAddon';

import CellMap from 'src/entities/CellMap';

import { difference, diffPercentage } from 'src/utils/core';

interface IDLink {
  header: string;
  cells: string[];
  orderCells: string[];
  IDCell?: number;
  orderIDCell?: number;
  map: CellMap;
  orderMap: CellMap;

  onIDCellChange: (s?: string) => void;
  onOrderIDCellChange: (s?: string) => void;
}

const IDLink: React.FC<IDLink> = (props: IDLink) => {
  const [display, setDisplay] = useState<any[]>([]);
  const [diff, setDiff] = useState<{ present: any[][], missing: any[][] }>({ present: [], missing: [] });

  useEffect(() => {
    const diff = difference(props.orderMap, props.map);
    setDiff(diff);
  }, [props.map, props.orderMap]);

  const onClickID = () => {
    const data: any[] = [];
    const id = props.IDCell;
    if (id === undefined) return;
    props.map.forEach(v => data.push(v[id]));
    setDisplay(data.sort());
  };

  const onClickOrder = () => {
    const data: any[] = [];
    const id = props.orderIDCell;
    if (id === undefined) return;
    props.orderMap.forEach((v) => data.push(v[id]));
    setDisplay(data.sort());
  };

  const onClickPresent = () => {
    const id = props.orderIDCell;
    if (id === undefined) return;
    const display = diff.present.map(m => m[id]).sort();
    setDisplay(display);
  }

  const onClickMissing = () => {
    const id = props.orderIDCell;
    if (id === undefined) return;
    const display = diff.missing.map(m => m[id]).sort();
    setDisplay(display);
  };

  const percentage = diffPercentage(props.orderMap.size, diff.missing.length);

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
          <Button variant="success" onClick={onClickPresent} disabled={diff.present.length === 0}>
            {diff.present.length} presents
          </Button>
          <Button variant="danger" onClick={onClickMissing} disabled={diff.missing.length === 0}>
            {diff.missing.length} absents
          </Button>
        </Col>
      </Row>

      <DisplayModal display={display} onHide={() => setDisplay([])} />
    </>
  );
};

export default IDLink;
