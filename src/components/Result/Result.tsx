import React from 'react';
import { connect } from 'react-redux';

import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import State from '../../entities/State';

interface ResultProps extends ResultState {}

interface ResultState {
  result: any[][];
}

const Result: React.FC<ResultProps> = (props: ResultProps) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {props.result[0].map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.result.slice(1, props.result.length).map((result, index) => (
          <OverlayTrigger
            key={index}
            trigger="hover"
            placement="top"
            overlay={
              <Popover id="popover-basic">
                <Popover.Title as="h3">Popover right</Popover.Title>
                <Popover.Content>
                  And here's some <strong>amazing</strong> content. It's very engaging.
                  right?
                </Popover.Content>
              </Popover>
            }>
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
          </OverlayTrigger>
        ))}
      </tbody>
    </Table>
  );
};

const mapStateToProps = (state: State): ResultState => ({
  result: [[], []]
});

export default connect(mapStateToProps)(Result);
