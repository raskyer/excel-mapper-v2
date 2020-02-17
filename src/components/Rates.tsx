import React from 'react';
import { connect } from 'react-redux';

import Form from 'react-bootstrap/Form';

import Step from './common/Step';

import State from '../entities/State';
import { customerMarkRateChangedAction, providerMarkRateChangedAction, dateMarkRateChangedAction } from '../redux/actions';

interface RatesProps extends RatesState, RatesDispatch {}

interface RatesState {
  customerMarkRate: number;
  providerMarkRate: number;
  dateMarkRate: number;
}

interface RatesDispatch {
  onCustomerRateChange: (s: string) => void;
  onProviderRateChange: (s: string) => void;
  onDateRateChange: (s: string) => void;
}

const Rates: React.FC<RatesProps> = (props: RatesProps) => {
  return (
    <Step eventKey="6" title="Ajustement" state="success">
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
    </Step>
  );
};

const mapStateToProps = (state: State): RatesState => ({
  customerMarkRate: state.customerMarkRate,
  providerMarkRate: state.providerMarkRate,
  dateMarkRate: state.dateMarkRate
});

const mapDispatchToProps = (dispatch: Function): RatesDispatch => ({
  onCustomerRateChange: (s: string) => dispatch(customerMarkRateChangedAction(s)),
  onProviderRateChange: (s: string) => dispatch(providerMarkRateChangedAction(s)),
  onDateRateChange: (s: string) => dispatch(dateMarkRateChangedAction(s))
});

export default connect(mapStateToProps, mapDispatchToProps)(Rates);
