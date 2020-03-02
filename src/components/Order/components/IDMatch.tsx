import React from 'react';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPortrait } from '@fortawesome/free-solid-svg-icons/faPortrait';
import { faTruck } from '@fortawesome/free-solid-svg-icons/faTruck';

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
      <div className="flex justify-between items-center">
        <div>
          <FontAwesomeIcon icon={faPortrait} className="text-blue-600" /> {props.customerID ? props.customerCells[props.customerID] : <span className="text-red-600">Non défini</span>}
        </div>
        <div className="w-64">
          <ProgressBar percent={25} />
        </div>
        <div>
          <FontAwesomeIcon icon={faPortrait} className="text-blue-600" /> {props.orderCustomerID ? props.orderCells[props.orderCustomerID] : <span className="text-red-600">Non défini</span>}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <FontAwesomeIcon icon={faTruck} className="text-red-600" /> {props.providerID ? props.providerCells[props.providerID] : <span className="text-red-600">Non défini</span>}
        </div>
        <div className="w-64">
          <ProgressBar percent={80} />
        </div>
        <div>
          <FontAwesomeIcon icon={faTruck} className="text-red-600" /> {props.orderProviderID ? props.orderCells[props.orderProviderID] : <span className="text-red-600">Non défini</span>}
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
