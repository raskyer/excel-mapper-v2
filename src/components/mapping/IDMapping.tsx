import React from 'react';
import { connect } from 'react-redux';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Select from '../common/Select';
import State from '../../entities/State';
import { getCustomerCells, getOrderCells } from '../../redux/selector';
import { customerIDCellChangedAction } from '../../redux/reducer';

interface IDMappingProps extends IDMappingState, IDMappingDispatch {}

interface IDMappingState {
  customerCells: string[];
  orderCells: string[];
  customerIDCell?: number;
  orderCustomerIDCell?: number;
}

interface IDMappingDispatch {
  onCustomerIDCellChange: (s: string) => void;
  onOrderCustomerIDCellChange: (s: string) => void;
}

const IDMapping: React.FC<IDMappingProps> = (props: IDMappingProps) => {
  return (
    <Row>
      <Col>
        <Row>
          <Col xs={2}>
            <button>{12}</button>
          </Col>
          <Col>
            <Select
              title={`Cellule ID Client`}
              value={props.customerIDCell ? props.customerIDCell + '' : undefined}
              onChange={props.onCustomerIDCellChange}
              options={props.customerCells}
            />
          </Col>
        </Row>
      </Col>
      <Col xs={2}>
        =>
      </Col>
      <Col>
        <Row>
          <Col>
            <Select
              title={`Cellule ID Client`}
              value={props.orderCustomerIDCell ? props.orderCustomerIDCell + '' : undefined}
              onChange={props.onOrderCustomerIDCellChange}
              options={props.orderCells}
            />
          </Col>
          <Col xs={2}>
            <button>{100}</button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: State): IDMappingState => ({
  customerCells: getCustomerCells(state),
  orderCells: getOrderCells(state),
  customerIDCell: state.customerIDCell,
  orderCustomerIDCell: state.orderCustomerIDCell,
});

const mapDispatchToProps = (dispatch: Function): IDMappingDispatch => ({
  onCustomerIDCellChange: (s: string): void => dispatch(customerIDCellChangedAction(s)),
  onOrderCustomerIDCellChange: (s: string): void => dispatch(s)
});

export default connect(mapStateToProps, mapDispatchToProps)(IDMapping);
