import React from 'react';
import { connect } from 'react-redux';

import ProgressBar from 'src/components/common/ProgressBar';

import State from 'src/entities/State';
import { getCustomerCells, getProviderCells, getOrderCells } from 'src/redux/selectors';

interface IDMatchProps extends IDMatchState {}

interface IDMatchState {
  customerCells: string[];
  providerCells: string[];
  orderCells: string[];
  customerID?: number;
  providerID?: number;
  orderCustomerID?: number;
  orderProviderID?: number;
}

const IDMatch: React.FC<IDMatchProps> = (props: IDMatchProps) => {
  return (
    <>
      <div className="grid grid-cols-3">
        <div>
          {props.customerID && props.customerCells[props.customerID]}
        </div>
        <ProgressBar percent={25} />
        <div>
          {props.orderCustomerID && props.orderCells[props.orderCustomerID]}
        </div>
      </div>
      <div>
        <div>
          {props.providerID && props.providerCells[props.providerID]}
        </div>
        <ProgressBar percent={80} />
        <div>
          {props.orderProviderID && props.orderCells[props.orderProviderID]}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: State): IDMatchState => ({
  customerCells: getCustomerCells(state),
  providerCells: getProviderCells(state),
  orderCells: getOrderCells(state),
  customerID: state.customerIDCell,
  providerID: state.providerIDCell,
  orderCustomerID: state.orderCustomerIDCell,
  orderProviderID: state.orderProviderIDCell
});

export default connect(mapStateToProps)(IDMatch);
