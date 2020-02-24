import React, { useState } from 'react';
import { connect } from 'react-redux';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Step from './common/Step';
import Select from './common/Select';
import DisplayModal from './common/DisplayModal';
import EyeAddon from './common/EyeAddon';

import State from '../../../entities/State';
import Status from '../../../entities/Status';

import {
  getOptionsStatus,
  getCustomerCells,
  getProviderCells,
  getOrderCells,
  getCustomerSheet,
  getProviderSheet,
  getOrderSheet
} from '../../../redux/selectors';

import {
  customerMarkCellChangedAction,
  providerMarkCellChangedAction,
  orderTypeCellChangedAction,
  orderLoadingDateCellChangedAction,
  orderShippingDateCellChangedAction
} from '../../../redux/actions';

import { formatValue } from '../../../utils/core';

interface OptionsProps extends OptionsState, OptionsDispatch {}

interface OptionsState {
  optionsStatus?: Status;
  customerMarkCell?: number;
  providerMarkCell?: number;
  customerCells: string[];
  providerCells: string[];
  orderCells: string[];

  orderTypeCell?: number;
  orderLoadingDateCell?: number;
  orderShippingDateCell?: number;

  customerSheet: any[][];
  providerSheet: any[][];
  orderSheet: any[][];
}

interface OptionsDispatch {
  onCustomerMarkCellChange: (s?: string) => void;
  onProviderMarkCellChange: (s?: string) => void;
  onOrderTypeCellChange: (s?: string) => void;
  onOrderLoadingDateCellChange: (s?: string) => void;
  onOrderShippingDateCellChange: (s?: string) => void;
}

const Options: React.FC<OptionsProps> = (props: OptionsProps) => {
  const [display, setDisplay] = useState<any[]>([]);
  const onClickEye = (index: number | undefined, sheet: any[]) => {
    if (index === undefined) return;
    const data = sheet
      .slice(1, sheet.length)
      .filter(values => values[index])
      .map(values => formatValue(values[index]));

    setDisplay(data);
  };

  return (
    <Step eventKey="5" title="Options" status={props.optionsStatus}>
      <Row>
        <Col>
          <Select
            title="Cellule de note client"
            value={props.customerMarkCell}
            onChange={props.onCustomerMarkCellChange}
            options={props.customerCells}
            addon={<EyeAddon
              onClick={() => onClickEye(props.customerMarkCell, props.customerSheet)}
              disabled={props.customerMarkCell === undefined}
            />}
          />
          <Select
            title="Cellule de note transporteur"
            value={props.providerMarkCell}
            onChange={props.onProviderMarkCellChange}
            options={props.providerCells}
            addon={<EyeAddon
              onClick={() => onClickEye(props.providerMarkCell, props.providerSheet)}
              disabled={props.providerMarkCell === undefined}
            />}
          />
        </Col>
        <Col>
          <Select
            title="Cellule de type"
            value={props.orderTypeCell}
            onChange={props.onOrderTypeCellChange}
            options={props.orderCells}
            addon={<EyeAddon
              onClick={() => onClickEye(props.orderTypeCell, props.orderSheet)}
              disabled={props.orderTypeCell === undefined}
            />}
          />
          <Select
            title="Cellule de date chargement"
            value={props.orderLoadingDateCell}
            onChange={props.onOrderLoadingDateCellChange}
            options={props.orderCells}
            addon={<EyeAddon
              onClick={() => onClickEye(props.orderLoadingDateCell, props.orderSheet)}
              disabled={props.orderLoadingDateCell === undefined}
            />}
          />
          <Select
            title="Cellule de date livraison"
            value={props.orderShippingDateCell}
            onChange={props.onOrderShippingDateCellChange}
            options={props.orderCells}
            addon={<EyeAddon
              onClick={() => onClickEye(props.orderShippingDateCell, props.orderSheet)}
              disabled={props.orderShippingDateCell === undefined}
            />}
          />
        </Col>
      </Row>

      <DisplayModal display={display} onHide={() => setDisplay([])} />
    </Step>
  );
};

const mapStateToProps = (state: State): OptionsState => ({
  optionsStatus: getOptionsStatus(state),
  customerMarkCell: state.customerMarkCell,
  providerMarkCell: state.providerMarkCell,
  customerCells: getCustomerCells(state),
  providerCells: getProviderCells(state),
  orderCells: getOrderCells(state),

  orderTypeCell: state.orderTypeCell,
  orderLoadingDateCell: state.orderLoadingDateCell,
  orderShippingDateCell: state.orderShippingDateCell,

  customerSheet: getCustomerSheet(state),
  providerSheet: getProviderSheet(state),
  orderSheet: getOrderSheet(state)
});

const mapDispatchToProps = (dispatch: Function): OptionsDispatch => ({
  onCustomerMarkCellChange: (s?: string) => dispatch(customerMarkCellChangedAction(s)),
  onProviderMarkCellChange: (s?: string) => dispatch(providerMarkCellChangedAction(s)),
  onOrderTypeCellChange: (s?: string) => dispatch(orderTypeCellChangedAction(s)),
  onOrderLoadingDateCellChange: (s?: string) => dispatch(orderLoadingDateCellChangedAction(s)),
  onOrderShippingDateCellChange: (s?: string) => dispatch(orderShippingDateCellChangedAction(s))
});

export default connect(mapStateToProps, mapDispatchToProps)(Options);
