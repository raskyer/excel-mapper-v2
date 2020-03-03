import React from 'react';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPortrait } from '@fortawesome/free-solid-svg-icons/faPortrait';
import { faTruck } from '@fortawesome/free-solid-svg-icons/faTruck';

import ProgressBar from 'src/components/common/ProgressBar';

import State from 'src/entities/State';
import Difference from 'src/entities/Difference';

import { getCustomerCells, getProviderCells, getOrderCells, getCustomerDifference, getProviderDifference } from 'src/redux/selectors';
import { differencePercentage } from 'src/utils/core';

interface IDMatchProps extends IDMatchState {}

interface IDMatchState {
  customerCells: string[];
  providerCells: string[];
  orderCells: string[];
  customerID?: number;
  providerID?: number;
  orderCustomerID?: number;
  orderProviderID?: number;
  customerDiff: Difference;
  providerDiff: Difference;
}

const IDMatch: React.FC<IDMatchProps> = (props: IDMatchProps) => {
  return (
    <>
      <div className="grid grid-cols-3 text-center">
        <div>
          <FontAwesomeIcon icon={faPortrait} className="text-blue-600" /> {props.customerID !== undefined ?
            props.customerCells[props.customerID]
            :
            <span className="text-red-600">Non défini</span>
          }
          <br/>
          <span className="italic">(Base de données)</span>
        </div>
        <div className="w-full">
          <ProgressBar percent={differencePercentage(props.customerDiff)} />
        </div>
        <div>
          <FontAwesomeIcon icon={faPortrait} className="text-blue-600" /> {props.orderCustomerID !== undefined ?
            props.orderCells[props.orderCustomerID]
            :
            <span className="text-red-600">Non défini</span>
          }
          <br/>
          <span className="italic">(Fichier commandes)</span>
        </div>
      </div>
      <div className="grid grid-cols-3 text-center mt-5">
        <div>
          <FontAwesomeIcon icon={faTruck} className="text-red-600" /> {props.providerID !== undefined ?
            props.providerCells[props.providerID]
            :
            <span className="text-red-600">Non défini</span>
          }
          <br/>
          <span className="italic">(Base de données)</span>
        </div>
        <div className="w-full">
          <ProgressBar percent={differencePercentage(props.providerDiff)} />
        </div>
        <div>
          <FontAwesomeIcon icon={faTruck} className="text-red-600" /> {props.orderProviderID !== undefined ?
            props.orderCells[props.orderProviderID]
            :
            <span className="text-red-600">Non défini</span>
          }
          <br/>
          <span className="italic">(Fichier commandes)</span>
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
  orderProviderID: state.orderProviderIDCell,
  customerDiff: getCustomerDifference(state),
  providerDiff: getProviderDifference(state)
});

export default connect(mapStateToProps)(IDMatch);
