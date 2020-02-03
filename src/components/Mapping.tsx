import React from 'react';
import { connect } from 'react-redux';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Select from './common/Select';
import State from '../entities/State';
import { customerSheetChangedAction, customerIDCellChangedAction } from '../redux/app-reducer';

interface MappingProps extends MappingState, MappingDispatch {}

interface MappingState {
  sheetsNames: string[];
  orderSheetsNames: string[];

  customerSheetName?: string;
  providerSheetName?: string;
  orderSheetName?: string;

  customerCells: string[];
  providerCells: string[];
  orderCells: string[];

  customerIDCell?: number;
  providerIDCell?: number;
  orderCustomerIDCell?: number;
  orderProviderIDCell?: number;
}

interface MappingDispatch {
  onCustomerSheetChange: (s: string) => void;
  onOrderSheetChange: (s: string) => void;
  onCustomerIDCellChange: (s: string) => void;
  onOrderCustomerIDCellChange: (s: string) => void;
}

const Mapping: React.FC<MappingProps> = (props: MappingProps) => {

  return (
    <>
      <Row>
        <Col>
          <Select
            title="Feuille Client"
            value={props.customerSheetName}
            onChange={props.onCustomerSheetChange}
            options={props.sheetsNames}
            byValue
          />
        </Col>
        <Col>
          <Select
            title="Feuille Commandes"
            value={props.orderSheetName}
            onChange={props.onOrderSheetChange}
            options={props.orderSheetsNames}
            byValue
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Row>
            <Col xs={2}>
              <a>{12}</a>
            </Col>
            <Col>
              <Select
                title={`Cellule ID Client dans ${props.customerSheetName}`}
                value={props.customerIDCell ? props.customerIDCell + '' : undefined}
                onChange={props.onCustomerIDCellChange}
                options={props.customerCells}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={2}>
          {/* ARROW POINTING */}
        </Col>
        <Col>
          <Row>
            <Col>
              <Select
                title={`Cellule ID Client dans ${props.orderSheetName}`}
                value={props.orderCustomerIDCell ? props.orderCustomerIDCell + '' : undefined}
                onChange={props.onOrderCustomerIDCellChange}
                options={props.orderCells}
              />
            </Col>
            <Col xs={2}>
              <a>{100}</a>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state: State): MappingState => ({
  sheetsNames: state.sheetsNames,
  orderSheetsNames: state.orderSheetsNames,

  customerSheetName: state.customerSheetName,
  providerSheetName: state.providerSheetName,
  orderSheetName: state.orderSheetName,

  customerCells: state.customerCells,
  providerCells: state.providerCells,
  orderCells: state.orderCells,

  customerIDCell: state.customerIDCell,
  providerIDCell: state.providerIDCell,
  orderCustomerIDCell: state.orderCustomerIDCell,
  orderProviderIDCell: state.orderProviderIDCell
});

const mapDispatchToProps = (dispatch: Function): MappingDispatch => ({
  onCustomerSheetChange: (s: string): void => dispatch(customerSheetChangedAction(s)),
  onOrderSheetChange: (s: string): void => dispatch(s),
  onCustomerIDCellChange: (s: string): void => dispatch(customerIDCellChangedAction(s)),
  onOrderCustomerIDCellChange: (s: string): void => dispatch(s)
});

export default connect(mapStateToProps, mapDispatchToProps)(Mapping);
