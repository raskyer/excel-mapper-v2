import React from 'react';
import { connect } from 'react-redux';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Upload from './components/Upload';
import Sheets from './components/Sheets';
import IDCustomer from './components/IDCustomer';
import IDProvider from './components/IDProvider';
import Options from './components/Options';
import Rates from './components/Rates';
import Columns from './components/Columns';

import State from './entities/State';
import { submit } from './redux/reducer';

interface AppProps extends AppState, AppDispatch {}

interface AppState {
  activeKey: string;
}

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
      <Container>
        <Form onSubmit={onSubmit}>
        <Accordion activeKey={props.activeKey}>
          <Row>
            <Col>
              <Upload />
            </Col>
          </Row>
          <Row>
            <Col>
              <Sheets />
            </Col>
          </Row>
          <Row>
            <Col>
              <IDCustomer />
            </Col>
          </Row>
          <Row>
            <Col>
              <IDProvider />
            </Col>
          </Row>
          <Row>
            <Col>
              <Options />
            </Col>
          </Row>
          <Row>
            <Col>
              <Rates />
            </Col>
          </Row>
          <Row>
            <Col>
              <Columns />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Button type="submit">Valider</Button>
              </Form.Group>
            </Col>
          </Row>
        </Accordion>
        </Form>
      </Container>
    </>
  );
};

const mapStateToProps = (state: State): AppState => ({
  activeKey: state.activeKey
});

const mapDispatchToProps = (dispatch: Function): AppDispatch => ({
  submit: () => dispatch(submit())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
