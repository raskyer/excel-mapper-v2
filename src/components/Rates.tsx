import React from 'react';
import { connect } from 'react-redux';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import State from '../entities/State';
import { keyChangedAction } from '../redux/reducer';

interface RatesProps extends RatesState, RatesDispatch {}

interface RatesState {
  customerMarkRate: number;
  providerMarkRate: number;
  dateMarkRate: number;
}

interface RatesDispatch {
  onCustomerRateChange: (str: string) => void;
  onProviderRateChange: (str: string) => void;
  onDateRateChange: (str: string) => void;
}

const Rates: React.FC<RatesProps> = (props: RatesProps) => {
  return (
    <Card>
      <Card.Header>Ajustement</Card.Header>
      <Card.Body>
        <Form.Group>
          <Form.Label>Coéfficient Client</Form.Label>
          <Form.Control
            type="number"
            value={props.customerMarkRate !== undefined ? (props.customerMarkRate + '') : props.customerMarkRate}
            onChange={(e: React.FormEvent<HTMLInputElement>) => props.onCustomerRateChange(e.currentTarget.value)}
            isInvalid={props.customerMarkRate < 0}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Coéfficient Transporteur</Form.Label>
          <Form.Control
            type="number"
            value={props.providerMarkRate !== undefined ? props.providerMarkRate + '' : props.providerMarkRate}
            onChange={(e: React.FormEvent<HTMLInputElement>) => props.onProviderRateChange(e.currentTarget.value)}
            isInvalid={props.providerMarkRate < 0}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Coéfficient Date</Form.Label>
          <Form.Control
            type="number"
            value={props.dateMarkRate !== undefined ? props.dateMarkRate + '' : props.dateMarkRate}
            onChange={(e: React.FormEvent<HTMLInputElement>) => props.onDateRateChange(e.currentTarget.value)}
            isInvalid={props.dateMarkRate < 0}
            required
          />
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = (state: State): RatesState => ({
  customerMarkRate: state.customerMarkRate,
  providerMarkRate: state.providerMarkRate,
  dateMarkRate: state.dateMarkRate
});

const mapDispatchToProps = (dispatch: Function): RatesDispatch => ({
  onCustomerRateChange: (str: string) => dispatch(keyChangedAction('customerMarkRate', str)),
  onProviderRateChange: (str: string) => dispatch(keyChangedAction('providerMarkRate', str)),
  onDateRateChange: (str: string) => dispatch(keyChangedAction('dateMarkRate', str))
});

export default connect(mapStateToProps, mapDispatchToProps)(Rates);
