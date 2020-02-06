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
import { getProviderCells, getOrderCells, getProviderMap, getOrderProviderMap } from '../redux/selector';
import { customerIDCellChangedAction, orderCustomerIDCellChangedAction } from '../redux/reducer';
import { getMissing } from '../utils/core';

interface IDProviderProps extends IDProviderState, IDProviderDispatch {}

interface IDProviderState {
  providerCells: string[];
  orderCells: string[];
  providerIDCell?: number;
  orderProviderIDCell?: number;
  providerMap: Map<string | number, any[]>;
  orderProviderMap: Map<string | number, any[]>;
}

interface IDProviderDispatch {
  onCustomerIDCellChange: (s: string) => void;
  onOrderCustomerIDCellChange: (s: string) => void;
}

const IDProvider: React.FC<IDProviderProps> = (props: IDProviderProps) => {
  const [display, setDisplay] = useState<any[]>([]);
  const [missing, setMissing] = useState<any[][]>([]);

  useEffect(() => {
    setMissing(getMissing(props.orderProviderMap, props.providerMap));
  }, [props.providerMap, props.orderProviderMap]);

  const onClickCustomer = () => {
    const data: any[] = [];
    props.providerMap.forEach((_, key) => data.push(key));
    setDisplay(data);
  };

  const onClickOrder = () => {
    const data: any[] = [];
    props.orderProviderMap.forEach((_, key) => data.push(key));
    setDisplay(data);
  };

  /*const onClickMissing = () => {
    setDisplay(missing.map(m => m[props.orderCustomerIDCell ? props.orderCustomerIDCell : 0]));
  };*/

  let percentage = ((props.orderProviderMap.size - missing.length) / props.orderProviderMap.size) * 100;
  if (isNaN(percentage)) {
    percentage = 0;
  }

  return (
    <>
      <Card>
        <Card.Header>Cellule ID Transporteur</Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Row>
                <Col xs={2} style={{textAlign: 'center', marginTop: '30px'}}>
                  <Button onClick={onClickCustomer} disabled={props.providerMap.size === 0}>
                    {props.providerMap.size}
                  </Button>
                </Col>
                <Col>
                  <Select
                    title={`Cellule ID Transporteur`}
                    value={props.providerIDCell}
                    onChange={props.onCustomerIDCellChange}
                    options={props.providerCells}
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
                    title={`Cellule ID Transporteur`}
                    value={props.orderProviderIDCell}
                    onChange={props.onOrderCustomerIDCellChange}
                    options={props.orderCells}
                  />
                </Col>
                <Col xs={2} style={{textAlign: 'center', marginTop: '30px'}}>
                  <Button onClick={onClickOrder} disabled={props.orderProviderMap.size === 0}>
                    {props.orderProviderMap.size}
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

const mapStateToProps = (state: State): IDProviderState => ({
  providerCells: getProviderCells(state),
  orderCells: getOrderCells(state),
  providerIDCell: state.providerIDCell,
  orderProviderIDCell: state.orderProviderIDCell,
  providerMap: getProviderMap(state),
  orderProviderMap: getOrderProviderMap(state)
});

const mapDispatchToProps = (dispatch: Function): IDProviderDispatch => ({
  onCustomerIDCellChange: (s: string): void => dispatch(customerIDCellChangedAction(s)),
  onOrderCustomerIDCellChange: (s: string): void => dispatch(orderCustomerIDCellChangedAction(s))
});

export default connect(mapStateToProps, mapDispatchToProps)(IDProvider);
