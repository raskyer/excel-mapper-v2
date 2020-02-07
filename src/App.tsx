import React from 'react';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Upload from './components/Upload';
import Sheets from './components/Sheets';
import IDCustomer from './components/IDCustomer';
import IDProvider from './components/IDProvider';
import Options from './components/Options';

const App = () => {
  return (
    <Container>
      <Form>
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
      </Form>
    </Container>
  );
};

export default App;
