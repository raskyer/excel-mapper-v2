import React from 'react';
import { connect } from 'react-redux';

import Upload from './Upload';
import Spreadsheet from './Spreadsheet';

import State from 'src/entities/State';

import { getOrderSheet } from 'src/redux/selectors';
import { orderFileChangedAction } from 'src/redux/actions';

interface OrderProps extends OrderState, OrderDispatch {}

interface OrderState {
  orderSheet: any[][];
}

interface OrderDispatch {
  onOrderChange: (f: File) => void;
}

const Order: React.FC<OrderProps> = (props: OrderProps) => {
  if (props.orderSheet.length < 1) return <Upload title="Commandes" onFileUpload={props.onOrderChange} />
  return <Spreadsheet sheet={props.orderSheet} />;
};

const mapStateToProps = (state: State): OrderState => ({
  orderSheet: getOrderSheet(state)
});

const mapDispatchToProps = (dispatch: Function): OrderDispatch => ({
  onOrderChange: (f: File) => dispatch(orderFileChangedAction(f))
});

export default connect(mapStateToProps, mapDispatchToProps)(Order);
