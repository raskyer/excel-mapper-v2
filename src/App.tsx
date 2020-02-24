import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

import Config from './components/Config/Config';
import Result from './components/Result/Result';

const App: React.FC = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark" fixed="top">
        <Navbar.Brand href="#home">
          Excel Mapper
        </Navbar.Brand>
      </Navbar>

      <Container style={{ marginTop: '70px' }}>
        <Config />
        <Result />
      </Container>
    </>
  );
};

export default App;
