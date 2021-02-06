import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

import Config from './components/Config/Config';
import Result from './components/Result/Result';
import { useTrackers } from './service';

const App: React.FC = () => {
  useTrackers('excelmapper');

  return (
    <>
      <Navbar bg="dark" variant="dark" fixed="top">
        <Navbar.Brand>Excel Mapper</Navbar.Brand>
      </Navbar>

      <Container style={{ marginTop: '70px' }}>
        <Config />
        <Result />
      </Container>
    </>
  );
};

export default App;
