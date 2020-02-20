import React from 'react';
import { connect } from 'react-redux';

import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import State from '../../entities/State';
import RankedOrder from '../../entities/RankedOrder';

interface ResultProps extends ResultState {}

interface ResultState {
  headers: string[];
  results?: RankedOrder[];
}

const Result: React.FC<ResultProps> = (props: ResultProps) => {
  if (props.results === undefined) {
    return null;
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {props.headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.results.slice(1, props.results.length).map((result, index) => (
          <OverlayTrigger
            key={index}
            trigger="hover"
            placement="top"
            overlay={
              <Popover id="popover-basic">
                <Popover.Title as="h3">Info</Popover.Title>
                <Popover.Content>
                  Note client : {result.customerMark},<br/>
                  Note transporteur : {result.providerMark}
                </Popover.Content>
              </Popover>
            }>
            <tr>
              {result.order.map((o, oIndex) => (
                <td key={oIndex}>{o}</td>
              ))}
            </tr>
          </OverlayTrigger>
        ))}
      </tbody>
    </Table>
  );
};

const mapStateToProps = (state: State): ResultState => ({
  headers: [...state.projection],
  results: state.results
});

export default connect(mapStateToProps)(Result);
