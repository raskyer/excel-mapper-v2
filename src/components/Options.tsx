import React from 'react';
import { connect } from 'react-redux';

import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Select from './common/Select';
import State from '../entities/State';
import { getCustomerCells, getProviderCells, getOrderCells } from '../redux/selector';
import {
  customerRatingCellChangedAction,
  providerRatingCellChangedAction,
  orderTypeCellChangedAction,
  orderShippingDateCellChangedAction,
  orderDeliveryDateCellChangedAction
} from '../redux/reducer';

interface OptionsProps extends OptionsState, OptionsDispatch {}

interface OptionsState {
  customerRatingCell?: number;
  providerRatingCell?: number;
  customerCells: string[];
  providerCells: string[];
  orderCells: string[];

  orderTypeCell?: number;
  orderShippingDateCell?: number;
  orderDeliveryDateCell?: number;
}

interface OptionsDispatch {
  onCustomerRatingCellChange: (s: string) => void;
  onProviderRatingCellChange: (s: string) => void;
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
              value={props.customerRatingCell}
              onChange={props.onCustomerRatingCellChange}
              options={props.customerCells}
            />
            <Select
              title="Cellule de note client"
              value={props.providerRatingCell}
              onChange={props.onProviderRatingCellChange}
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
  customerRatingCell: state.customerRatingCell,
  providerRatingCell: state.providerRatingCell,
  customerCells: getCustomerCells(state),
  providerCells: getProviderCells(state),
  orderCells: getOrderCells(state),

  orderTypeCell: state.orderTypeCell,
  orderShippingDateCell: state.orderShippingDateCell,
  orderDeliveryDateCell: state.orderDeliveryDateCell
});

const mapDispatchToProps = (dispatch: Function): OptionsDispatch => ({
  onCustomerRatingCellChange: (s: string) => dispatch(customerRatingCellChangedAction(s)),
  onProviderRatingCellChange: (s: string) => dispatch(providerRatingCellChangedAction(s)),
  onOrderTypeCellChange: (s: string) => dispatch(orderTypeCellChangedAction(s)),
  onOrderShippingDateCellChange: (s: string) => dispatch(orderShippingDateCellChangedAction(s)),
  onOrderDeliveryDateCellChange: (s: string) => dispatch(orderDeliveryDateCellChangedAction(s))
});

export default connect(mapStateToProps, mapDispatchToProps)(Options);
