import React from 'react';
import { connect } from 'react-redux';

import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';

import Upload from './components/Upload';
import Sheets from './components/Sheets';
import IDCustomer from './components/IDCustomer';
import IDProvider from './components/IDProvider';
import Options from './components/Options';
import Rates from './components/Rates';
import Projection from './components/Projection';

import { submit } from 'src/redux/actions';

interface ConfigProps extends ConfigState, ConfigDispatch {}

interface ConfigState {}

interface ConfigDispatch {
  submit: () => void;
}

const Config: React.FC<ConfigProps> = (props: ConfigProps) => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.submit();
  };

  return (
    <Form onSubmit={onSubmit}>
      <Accordion activeKey="0">
        <Upload />
        <Sheets />
        <IDCustomer />
        <IDProvider />
        <Options />
        <Rates />
        <Projection />
      </Accordion>

      <Form.Group className="mt-3">
        <Button type="submit" disabled>Valider</Button>
      </Form.Group>
    </Form>
  );
};

const mapDispatchToProps = (dispatch: Function): ConfigDispatch => ({
  submit: () => dispatch(submit())
});

export default connect(undefined, mapDispatchToProps)(Config);
