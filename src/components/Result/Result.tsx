import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Element, scroller } from 'react-scroll';

import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import State from '../../entities/State';
import RankedOrder from '../../entities/RankedOrder';

import { download } from '../../redux/actions';
import { formatDate } from '../../utils/core';

interface ResultProps extends ResultState, ResultDispatch {}

interface ResultState {
  headers: string[];
  results?: RankedOrder[];
  customerMarkRate: number;
  providerMarkRate: number;
  dateMarkRate: number;
}

interface ResultDispatch {
  download: (headers: string[], rankedOrders: RankedOrder[]) => void;
}

const Result: React.FC<ResultProps> = (props: ResultProps) => {
  useEffect(() => {
    if (props.results === undefined) return;

    scroller.scrollTo('tab', {
      duration: 1000,
      smooth: true,
      offset: -60
    });
  }, [props.results]);

  if (props.results === undefined) {
    return null;
  }

  const onDownloadExcel = () => {
    if (!props.results) return;
    props.download(props.headers, props.results);
  };

  return (
    <Element name="tab">
      <div className="text-right mb-2">
        <Button variant="success" onClick={onDownloadExcel}>
          Télécharger
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
          {props.results.map((result, index) => (
            <OverlayTrigger
              key={index}
              placement="top"
              overlay={
                <Popover id="popover-basic" style={{ maxWidth: '100%' }}>
                  <Popover.Title as="h3" className="bg-info text-white">Info</Popover.Title>
                  <Popover.Content>
                    <b>Client</b> : {result.customer.id}, <b>Note</b> : {result.customer.mark ? result.customer.mark : 'Non trouvé'} ({result.customer.ranking}/{5 * props.customerMarkRate}),<br/>
                    <b>Transporteur</b> : {result.provider.id}, <b>Note</b> : {result.provider.mark ? result.provider.mark : 'Non trouvé'} ({result.provider.ranking}/{5 * props.providerMarkRate}),<br/>
                    <b>Date</b> : {formatDate(result.date.date)}, <b>Note</b> : {result.date.ranking.toFixed(2)}/{5 * props.dateMarkRate}
                  </Popover.Content>
                </Popover>
              }>
              <tr>
                {result.projection && result.projection.map((o, oIndex) => (
                  <td key={oIndex}>{o}</td>
                ))}
              </tr>
            </OverlayTrigger>
          ))}
        </tbody>
      </Table>
    </Element>
  );
};

const mapStateToProps = (state: State): ResultState => ({
  headers: state.projection,
  results: state.results,
  customerMarkRate: state.customerMarkRate,
  providerMarkRate: state.providerMarkRate,
  dateMarkRate: state.dateMarkRate
});

const mapDispatchToProps = (dispatch: Function): ResultDispatch => ({
  download: (headers, rankedOrders) => dispatch(download(headers, rankedOrders))
});

export default connect(mapStateToProps, mapDispatchToProps)(Result);
