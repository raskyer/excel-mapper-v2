import React from 'react';
import { connect } from 'react-redux';

import Form from 'react-bootstrap/Form';

import Step from './common/Step';

import State from 'src/entities/State';
import Status from 'src/entities/Status';

import { getRateStatus } from 'src/redux/selectors';
import {
  customerMarkRateChangedAction,
  providerMarkRateChangedAction,
  dateMarkRateChangedAction
} from 'src/redux/actions';

interface RatesProps extends RatesState, RatesDispatch {}

interface RatesState {
  rateStatus: Status;
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
    <Step eventKey="6" title="Ajustement" status={props.rateStatus}>
      <Form.Group>
        <Form.Label>Coéfficient Client</Form.Label>
        <Form.Control
          type="number"
          value={props.customerMarkRate + ''}
          onChange={(e: React.FormEvent<HTMLInputElement>) => props.onCustomerRateChange(e.currentTarget.value)}
          isValid={props.customerMarkRate > -1}
          isInvalid={props.customerMarkRate < 0}
          min={0}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Coéfficient Transporteur</Form.Label>
        <Form.Control
          type="number"
          value={props.providerMarkRate + ''}
          onChange={(e: React.FormEvent<HTMLInputElement>) => props.onProviderRateChange(e.currentTarget.value)}
          isValid={props.providerMarkRate > -1}
          isInvalid={props.providerMarkRate < 0}
          min={0}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Coéfficient Date</Form.Label>
        <Form.Control
          type="number"
          value={props.dateMarkRate + ''}
          onChange={(e: React.FormEvent<HTMLInputElement>) => props.onDateRateChange(e.currentTarget.value)}
          isValid={props.dateMarkRate > -1}
          isInvalid={props.dateMarkRate < 0}
          min={0}
          required
        />
      </Form.Group>
    </Step>
  );
};

const mapStateToProps = (state: State): RatesState => ({
  rateStatus: getRateStatus(state),
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
