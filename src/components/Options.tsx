import React from 'react';
import { connect } from 'react-redux';

import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Select from './common/Select';
import State from '../entities/State';
import { getCustomerCells, getProviderCells, getOrderCells } from '../redux/selector';
import {
  customerMarkCellChangedAction,
  providerMarkCellChangedAction,
  orderTypeCellChangedAction,
  orderShippingDateCellChangedAction,
  orderDeliveryDateCellChangedAction
} from '../redux/reducer';

interface OptionsProps extends OptionsState, OptionsDispatch {}

interface OptionsState {
  customerMarkCell?: number;
  providerMarkCell?: number;
  customerCells: string[];
  providerCells: string[];
  orderCells: string[];

  orderTypeCell?: number;
  orderShippingDateCell?: number;
  orderDeliveryDateCell?: number;
}

interface OptionsDispatch {
  onCustomerMarkCellChange: (s: string) => void;
  onProviderMarkCellChange: (s: string) => void;
  onOrderTypeCellChange: (s: string) => void;
  onOrderShippingDateCellChange: (s: string) => void;
  onOrderDeliveryDateCellChange: (s: string) => void;
}

const Options: React.FC<OptionsProps> = (props: OptionsProps) => {
  return (
    <Card>
      <Card.Header>Cellule de Notes</Card.Header>
      <Card.Body>
        <Row>
          <Col>
            <Select
              title="Cellule de note client"
              value={props.customerMarkCell}
              onChange={props.onCustomerMarkCellChange}
              options={props.customerCells}
            />
            <Select
              title="Cellule de note client"
              value={props.providerMarkCell}
              onChange={props.onProviderMarkCellChange}
              options={props.providerCells}
            />
          </Col>
          <Col>
            <Select
              title="Cellule de type"
              value={props.orderTypeCell}
              onChange={props.onOrderTypeCellChange}
              options={props.orderCells}
            />
            <Select
              title="Cellule de date chargement"
              value={props.orderShippingDateCell}
              onChange={props.onOrderShippingDateCellChange}
              options={props.orderCells}
            />
            <Select
              title="Cellule de date livraison"
              value={props.orderDeliveryDateCell}
              onChange={props.onOrderDeliveryDateCellChange}
              options={props.orderCells}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = (state: State): OptionsState => ({
  customerMarkCell: state.customerMarkCell,
  providerMarkCell: state.providerMarkCell,
  customerCells: getCustomerCells(state),
  providerCells: getProviderCells(state),
  orderCells: getOrderCells(state),

  orderTypeCell: state.orderTypeCell,
  orderShippingDateCell: state.orderShippingDateCell,
  orderDeliveryDateCell: state.orderDeliveryDateCell
});

const mapDispatchToProps = (dispatch: Function): OptionsDispatch => ({
  onCustomerMarkCellChange: (s: string) => dispatch(customerMarkCellChangedAction(s)),
  onProviderMarkCellChange: (s: string) => dispatch(providerMarkCellChangedAction(s)),
  onOrderTypeCellChange: (s: string) => dispatch(orderTypeCellChangedAction(s)),
  onOrderShippingDateCellChange: (s: string) => dispatch(orderShippingDateCellChangedAction(s)),
  onOrderDeliveryDateCellChange: (s: string) => dispatch(orderDeliveryDateCellChangedAction(s))
});

export default connect(mapStateToProps, mapDispatchToProps)(Options);
