import React from 'react';
import { connect } from 'react-redux';

import Step from './common/Step';
import IDLink from './common/IDLink';

import State from 'src/entities/State';
import Status from 'src/entities/Status';
import CellMap from 'src/entities/CellMap';

import {
  getProviderCells,
  getOrderCells,
  getProviderMap,
  getOrderProviderMap,
  getProviderIDStatus
} from 'src/redux/selectors';
import {
  providerIDCellChangedAction,
  orderProviderIDCellChangedAction
} from 'src/redux/actions';

interface IDProviderProps extends IDProviderState, IDProviderDispatch {}

interface IDProviderState {
  providerIDStatus?: Status;
  providerCells: string[];
  orderCells: string[];
  providerIDCell?: number;
  orderProviderIDCell?: number;
  providerMap: CellMap;
  orderProviderMap: CellMap;
}

interface IDProviderDispatch {
  onProviderIDCellChange: (s?: string) => void;
  onOrderProviderIDCellChange: (s?: string) => void;
}

const IDProvider: React.FC<IDProviderProps> = (props: IDProviderProps) => {
  return (
    <Step eventKey="4" title="Cellule d'ID Transporteur" status={props.providerIDStatus}>
      <IDLink
        header="Cellule d'ID Transporteur"
        cells={props.providerCells}
        orderCells={props.orderCells}
        IDCell={props.providerIDCell}
        orderIDCell={props.orderProviderIDCell}
        map={props.providerMap}
        orderMap={props.orderProviderMap}
        onIDCellChange={props.onProviderIDCellChange}
        onOrderIDCellChange={props.onOrderProviderIDCellChange}
      />
    </Step>
  );
};

const mapStateToProps = (state: State): IDProviderState => ({
  providerIDStatus: getProviderIDStatus(state),
  providerCells: getProviderCells(state),
  orderCells: getOrderCells(state),
  providerIDCell: state.providerIDCell,
  orderProviderIDCell: state.orderProviderIDCell,
  providerMap: getProviderMap(state),
  orderProviderMap: getOrderProviderMap(state)
});

const mapDispatchToProps = (dispatch: Function): IDProviderDispatch => ({
  onProviderIDCellChange: (s?: string): void => dispatch(providerIDCellChangedAction(s)),
  onOrderProviderIDCellChange: (s?: string): void => dispatch(orderProviderIDCellChangedAction(s))
});

export default connect(mapStateToProps, mapDispatchToProps)(IDProvider);
