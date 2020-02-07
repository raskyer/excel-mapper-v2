import React from 'react';
import { connect } from 'react-redux';

import IDLink from './common/IDLink';

import State from '../entities/State';
import { getCustomerCells, getOrderCells, getCustomerMap, getOrderCustomerMap } from '../redux/selector';
import { customerIDCellChangedAction, orderCustomerIDCellChangedAction } from '../redux/reducer';

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
  return (
    <IDLink
      header={"Cellule ID Client"}
      cells={props.customerCells}
      orderCells={props.orderCells}
      IDCell={props.customerIDCell}
      orderIDCell={props.orderCustomerIDCell}
      map={props.customerMap}
      orderMap={props.orderCustomerMap}
      onIDCellChange={props.onCustomerIDCellChange}
      onOrderIDCellChange={props.onOrderCustomerIDCellChange}
    />
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
