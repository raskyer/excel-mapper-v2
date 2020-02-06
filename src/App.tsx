import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Upload from './components/Upload';
import Sheets from './components/Sheets';
import IDCustomer from './components/IDCustomer';
import IDProvider from './components/IDProvider';

const App = () => {
  return (
    <Container>
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
    </Container>
  );
}

export default App;
