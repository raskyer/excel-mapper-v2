import React from 'react';
import { connect } from 'react-redux';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
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

import { submit } from './redux/actions';

interface AppProps extends AppState, AppDispatch {}

interface AppState {}

interface AppDispatch {
  submit: () => void;
}

const App: React.FC<AppProps> = (props: AppProps) => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.submit();
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">
          Excel Mapper
        </Navbar.Brand>
      </Navbar>

      <Container className="mt-3">
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
            <Button type="submit">Valider</Button>
          </Form.Group>
        </Form>
      </Container>
    </>
  );
};

const mapDispatchToProps = (dispatch: Function): AppDispatch => ({
  submit: () => dispatch(submit())
});

export default connect(undefined, mapDispatchToProps)(App);
