import React from 'react';
import { connect } from 'react-redux';

import IDLink from './common/IDLink';

import State from '../entities/State';
import { getProviderCells, getOrderCells, getProviderMap, getOrderProviderMap } from '../redux/selector';
import { providerIDCellChangedAction, orderProviderIDCellChangedAction } from '../redux/reducer';

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
  onProviderIDCellChange: (s: string) => void;
  onOrderProviderIDCellChange: (s: string) => void;
}

const IDProvider: React.FC<IDProviderProps> = (props: IDProviderProps) => {
  return (
    <IDLink
      header={"Cellules ID Transporteur"}
      cells={props.providerCells}
      orderCells={props.orderCells}
      IDCell={props.providerIDCell}
      orderIDCell={props.orderProviderIDCell}
      map={props.providerMap}
      orderMap={props.orderProviderMap}
      onIDCellChange={props.onProviderIDCellChange}
      onOrderIDCellChange={props.onOrderProviderIDCellChange}
    />
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
  onProviderIDCellChange: (s: string): void => dispatch(providerIDCellChangedAction(s)),
  onOrderProviderIDCellChange: (s: string): void => dispatch(orderProviderIDCellChangedAction(s))
});

export default connect(mapStateToProps, mapDispatchToProps)(IDProvider);
