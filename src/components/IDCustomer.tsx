import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { CircularProgressbar } from 'react-circular-progressbar';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import Select from './common/Select';
import State from '../entities/State';
import { getCustomerCells, getOrderCells, getCustomerMap, getOrderCustomerMap } from '../redux/selector';
import { customerIDCellChangedAction, orderCustomerIDCellChangedAction } from '../redux/reducer';
import { getMissing } from '../utils/core';

interface IDCustomerProps extends IDCustomerState, IDCustomerDispatch {}

interface IDCustomerState {
  customerCells: string[];
  orderCells: string[];
  customerIDCell?: number;
  orderCustomerIDCell?: number;
  customerMap: Map<string | number, any[]>;
  orderCustomerMap: Map<string | number, any[]>;
}

interface IDCustomerDispatch {
  onCustomerIDCellChange: (s: string) => void;
  onOrderCustomerIDCellChange: (s: string) => void;
}

const IDCustomer: React.FC<IDCustomerProps> = (props: IDCustomerProps) => {
  const [display, setDisplay] = useState<any[]>([]);
  const [missing, setMissing] = useState<any[][]>([]);

  useEffect(() => {
    setMissing(getMissing(props.orderCustomerMap, props.customerMap));
  }, [props.customerMap, props.orderCustomerMap]);

  const onClickCustomer = () => {
    const data: any[] = [];
    props.customerMap.forEach((_, key) => data.push(key));
    setDisplay(data);
  };

  const onClickOrder = () => {
    const data: any[] = [];
    props.orderCustomerMap.forEach((_, key) => data.push(key));
    setDisplay(data);
  };

  /*const onClickMissing = () => {
    setDisplay(missing.map(m => m[props.orderCustomerIDCell ? props.orderCustomerIDCell : 0]));
  };*/

  let percentage = ((props.orderCustomerMap.size - missing.length) / props.orderCustomerMap.size) * 100;
  if (isNaN(percentage)) {
    percentage = 0;
  }

  return (
    <>
      <Card>
        <Card.Header>Cellule ID Client</Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Row>
                <Col xs={2} style={{textAlign: 'center', marginTop: '30px'}}>
                  <Button onClick={onClickCustomer} disabled={props.customerMap.size === 0}>
                    {props.customerMap.size}
                  </Button>
                </Col>
                <Col>
                  <Select
                    title={`Cellule ID Client`}
                    value={props.customerIDCell}
                    onChange={props.onCustomerIDCellChange}
                    options={props.customerCells}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={2} style={{textAlign: 'center'}}>
              <CircularProgressbar
                value={percentage}
                text={`${percentage} %`}
                styles={{
                  root: {
                    width: '100px'
                  },
                  path: {
                    stroke: 'green',
                    strokeWidth: '3px'
                  },
                  trail: {
                    strokeWidth: '3px'
                  }
                }}
              />
            </Col>
            <Col>
              <Row>
                <Col>
                  <Select
                    title={`Cellule ID Client`}
                    value={props.orderCustomerIDCell}
                    onChange={props.onOrderCustomerIDCellChange}
                    options={props.orderCells}
                  />
                </Col>
                <Col xs={2} style={{textAlign: 'center', marginTop: '30px'}}>
                  <Button onClick={onClickOrder} disabled={props.orderCustomerMap.size === 0}>
                    {props.orderCustomerMap.size}
                  </Button>
                </Col>
              </Row>
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

const mapStateToProps = (state: State): IDCustomerState => ({
  customerCells: getCustomerCells(state),
  orderCells: getOrderCells(state),
  customerIDCell: state.customerIDCell,
  orderCustomerIDCell: state.orderCustomerIDCell,
  customerMap: getCustomerMap(state),
  orderCustomerMap: getOrderCustomerMap(state)
});

const mapDispatchToProps = (dispatch: Function): IDCustomerDispatch => ({
  onCustomerIDCellChange: (s: string): void => dispatch(customerIDCellChangedAction(s)),
  onOrderCustomerIDCellChange: (s: string): void => dispatch(orderCustomerIDCellChangedAction(s))
});

export default connect(mapStateToProps, mapDispatchToProps)(IDCustomer);
