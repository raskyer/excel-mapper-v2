import React from 'react';
import { connect } from 'react-redux';

import Rate from 'src/components/common/Rate';

import State from 'src/entities/State';

import {
  customerMarkRateChangeAction,
  providerMarkRateChangeAction,
  dateMarkRateChangeAction
} from 'src/redux/actions';

interface RatesProps extends RatesState, RatesDispatch {}

interface RatesState {
  customerMarkRate: number;
  providerMarkRate: number;
  dateMarkRate: number;
}

interface RatesDispatch {
  onCustomerMarkRateChange: (n: number) => void;
  onProviderMarkRateChange: (n: number) => void;
  onDateMarkRateChange: (n: number) => void;
}

const Rates: React.FC<RatesProps> = (props: RatesProps) => {
  return (
    <>
      <Rate label="Coéfficient Client" value={props.customerMarkRate} onChange={props.onCustomerMarkRateChange} />
      <Rate label="Coéfficient Transporteur" value={props.providerMarkRate} onChange={props.onProviderMarkRateChange} />
      <Rate label="Coéfficient Date" value={props.dateMarkRate} onChange={props.onDateMarkRateChange} />
    </>
  );
};

const mapStateToProps = (state: State): RatesState => ({
  customerMarkRate: state.customerMarkRate,
  providerMarkRate: state.providerMarkRate,
  dateMarkRate: state.dateMarkRate
});

const mapDispatchToProps = (dispatch: Function): RatesDispatch => ({
  onCustomerMarkRateChange: n => dispatch(customerMarkRateChangeAction(n)),
  onProviderMarkRateChange: n => dispatch(providerMarkRateChangeAction(n)),
  onDateMarkRateChange: n => dispatch(dateMarkRateChangeAction(n))
});

export default connect(mapStateToProps, mapDispatchToProps)(Rates);
