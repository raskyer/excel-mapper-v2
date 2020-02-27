import React from 'react';
import { connect } from 'react-redux';

import Upload from './Upload';
import Spreadsheet from './Spreadsheet';

import State from 'src/entities/State';

import { orderFileChangeAction } from 'src/redux/actions';

interface OrderProps extends OrderState, OrderDispatch {}

interface OrderState {
  orderSheet: any[][];
}

interface OrderDispatch {
  onOrderChange: (f: File) => void;
}

const Order: React.FC<OrderProps> = (props: OrderProps) => {
  if (props.orderSheet.length < 1) {
    return (
      <Upload title="Commandes" onFileUpload={props.onOrderChange} />
    );
  }
  return (<Spreadsheet />);
};

const mapStateToProps = (state: State): OrderState => ({
  orderSheet: state.orderSheet
});

const mapDispatchToProps = (dispatch: Function): OrderDispatch => ({
  onOrderChange: (f: File) => dispatch(orderFileChangeAction(f))
});

export default connect(mapStateToProps, mapDispatchToProps)(Order);
