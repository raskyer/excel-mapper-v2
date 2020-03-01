import React from 'react';
import { connect } from 'react-redux';

import Upload from './components/Upload';
import Spreadsheet from './components/Spreadsheet';
import Rates from './components/Rates';
import IDMatch from './components/IDMatch';
import Projections from './components/Projections';

import Section from '../common/Section';

import State from 'src/entities/State';
import Status from 'src/entities/Status';

import { getOrderStatus } from 'src/redux/selectors';

interface OrderProps extends OrderState {}

interface OrderState {
  orderStatus: Status;
}

const Order: React.FC<OrderProps> = (props: OrderProps) => {
  if (props.orderStatus === 'danger') {
    return (<Upload />);
  }

  return (
    <>
      <Spreadsheet />

      <Section title="Configuration">
        <div className="flex justify-around">
          <div className="w-full">
            <Rates />
          </div>

          <div className="w-full">
            <IDMatch />
          </div>
        </div>
      </Section>

      <Section title="Projections">
        <Projections />
      </Section>
    </>
  );
};

const mapStateToProps = (state: State): OrderState => ({
  orderStatus: getOrderStatus(state)
});

export default connect(mapStateToProps)(Order);
