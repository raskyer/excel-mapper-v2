import React from 'react';
import { connect } from 'react-redux';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import Select from './common/Select';
import State from '../entities/State';
import { getDbSheetNames, getOrderSheetNames } from '../redux/selector';
import { customerSheetChangedAction, providerSheetChangedAction, orderSheetChangedAction } from '../redux/reducer';

interface SheetsProps extends SheetsState, SheetsDispatch {}

interface SheetsState {
  dbSheetsNames: string[];
  orderSheetsNames: string[];
  customerSheetName?: string;
  providerSheetName?: string;
  orderSheetName?: string;
}

interface SheetsDispatch {
  onCustomerSheetChange: (s: string) => void;
  onProviderSheetChange: (s: string) => void;
  onOrderSheetChange: (s: string) => void;
}

const Sheets: React.FC<SheetsProps> = (props: SheetsProps) => {
  return (
    <Card>
      <Card.Header>Feuilles</Card.Header>
      <Card.Body>
        <Row>
          <Col>
            <Select
              title="Feuille Clients"
              value={props.customerSheetName}
              onChange={props.onCustomerSheetChange}
              options={props.dbSheetsNames}
              byValue
            />

            <Select
              title="Feuille Transporteurs"
              value={props.providerSheetName}
              onChange={props.onProviderSheetChange}
              options={props.dbSheetsNames}
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
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = (state: State): SheetsState => ({
  dbSheetsNames: getDbSheetNames(state),
  orderSheetsNames: getOrderSheetNames(state),
  customerSheetName: state.customerSheetName,
  providerSheetName: state.providerSheetName,
  orderSheetName: state.orderSheetName
});

const mapDispatchToProps = (dispatch: Function): SheetsDispatch => ({
  onCustomerSheetChange: (s: string): void => dispatch(customerSheetChangedAction(s)),
  onProviderSheetChange: (s: string): void => dispatch(providerSheetChangedAction(s)),
  onOrderSheetChange: (s: string): void => dispatch(orderSheetChangedAction(s))
});

export default connect(mapStateToProps, mapDispatchToProps)(Sheets);
