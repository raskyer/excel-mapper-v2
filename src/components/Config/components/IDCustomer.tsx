import React from 'react';
import { connect } from 'react-redux';

import Step from './common/Step';
import IDLink from './common/IDLink';

import State from 'src/entities/State';
import Status from 'src/entities/Status';
import CellMap from 'src/entities/CellMap';

import {
  getCustomerCells,
  getOrderCells,
  getCustomerMap,
  getOrderCustomerMap,
  getCustomerIDStatus
} from 'src/redux/selectors';
import {
  customerIDCellChangedAction,
  orderCustomerIDCellChangedAction
} from 'src/redux/actions';

interface IDCustomerProps extends IDCustomerState, IDCustomerDispatch {}

interface IDCustomerState {
  customerIDStatus?: Status;
  customerCells: string[];
  orderCells: string[];
  customerIDCell?: number;
  orderCustomerIDCell?: number;
  customerMap: CellMap;
  orderCustomerMap: CellMap;
}

interface IDCustomerDispatch {
  onCustomerIDCellChange: (s?: string) => void;
  onOrderCustomerIDCellChange: (s?: string) => void;
}

const IDCustomer: React.FC<IDCustomerProps> = (props: IDCustomerProps) => {
  return (
    <Step eventKey="3" title="Cellule d'ID Client" status={props.customerIDStatus}>
      <IDLink
        header="Cellule d'ID Client"
        cells={props.customerCells}
        orderCells={props.orderCells}
        IDCell={props.customerIDCell}
        orderIDCell={props.orderCustomerIDCell}
        map={props.customerMap}
        orderMap={props.orderCustomerMap}
        onIDCellChange={props.onCustomerIDCellChange}
        onOrderIDCellChange={props.onOrderCustomerIDCellChange}
      />
    </Step>
  );
};

const mapStateToProps = (state: State): IDCustomerState => ({
  customerIDStatus: getCustomerIDStatus(state),
  customerCells: getCustomerCells(state),
  orderCells: getOrderCells(state),
  customerIDCell: state.customerIDCell,
  orderCustomerIDCell: state.orderCustomerIDCell,
  customerMap: getCustomerMap(state),
  orderCustomerMap: getOrderCustomerMap(state)
});

const mapDispatchToProps = (dispatch: Function): IDCustomerDispatch => ({
  onCustomerIDCellChange: (s?: string): void => dispatch(customerIDCellChangedAction(s)),
  onOrderCustomerIDCellChange: (s?: string): void => dispatch(orderCustomerIDCellChangedAction(s))
});

export default connect(mapStateToProps, mapDispatchToProps)(IDCustomer);
