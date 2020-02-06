import React from 'react';
import { connect } from 'react-redux';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import Select from './common/Select';
import State from '../entities/State';
import { getDbSheetNames, getOrderSheetNames } from '../redux/selector';
import { customerSheetChangedAction } from '../redux/reducer';

interface SheetsProps extends SheetsState, SheetsDispatch {}

interface SheetsState {
  dbSheetsNames: string[];
  orderSheetsNames: string[];
  customerSheetName?: string;
  orderSheetName?: string;
}

interface SheetsDispatch {
  onCustomerSheetChange: (s: string) => void;
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
              title="Feuille Client"
              value={props.customerSheetName}
              onChange={props.onCustomerSheetChange}
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
  orderSheetName: state.orderSheetName
});

const mapDispatchToProps = (dispatch: Function): SheetsDispatch => ({
  onCustomerSheetChange: (s: string): void => dispatch(customerSheetChangedAction(s)),
  onOrderSheetChange: (s: string): void => dispatch(s),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sheets);
