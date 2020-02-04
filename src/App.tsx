import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Upload from './components/Upload';
import Mapping from './components/mapping/Mapping';

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
          <Mapping />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
