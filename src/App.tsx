import React from 'react';
import { connect } from 'react-redux';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Upload from './components/Upload';
import Sheets from './components/Sheets';
import IDCustomer from './components/IDCustomer';
import IDProvider from './components/IDProvider';
import Options from './components/Options';
import Rates from './components/Rates';

import { submit } from './redux/reducer';

interface AppProps extends AppDispatch {}

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
              <Form.Group>
                <Button type="submit">Valider</Button>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

const mapDispatchToProps = (dispatch: Function): AppDispatch => ({
  submit: () => dispatch(submit())
});

export default connect(null, mapDispatchToProps)(App);
