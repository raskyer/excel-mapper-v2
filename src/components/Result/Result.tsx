import React from 'react';
import { connect } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import State from '../../entities/State';
import RankedOrder from '../../entities/RankedOrder';
import { createWorkbook, downloadWorkbook } from '../../utils/excel';

interface ResultProps extends ResultState {}

interface ResultState {
  headers: string[];
  results?: RankedOrder[];
}

const Result: React.FC<ResultProps> = (props: ResultProps) => {
  if (props.results === undefined) {
    return null;
  }

  const onDownloadExcel = () => {
    if (!props.results) return;
    const data = props.results.map(result => result.order);
    data.unshift(props.headers);

    const workbook = createWorkbook(data);
    downloadWorkbook(workbook);
  };

  return (
    <>
      <div className="text-right mb-2">
        <Button variant="success" onClick={onDownloadExcel}>
          Télécharger en Excel
        </Button>
      </div>

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
              placement="top"
              overlay={
                <Popover id="popover-basic">
                  <Popover.Title as="h3" className="bg-danger text-white">Info</Popover.Title>
                  <Popover.Content>
                    <b>Note client</b> : {result.customerMark},<br/>
                    <b>Note transporteur</b> : {result.providerMark},<br/>
                    <b>Date</b> : {result.dateRanking}
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
    </>
  );
};

const mapStateToProps = (state: State): ResultState => ({
  headers: state.projection,
  results: state.results
});

export default connect(mapStateToProps)(Result);
