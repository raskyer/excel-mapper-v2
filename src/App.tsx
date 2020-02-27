import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Order from './components/Order/Order';
import Import from './components/Import/Import';

import './App.css';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Navbar />

      <main style={{ height: 'calc(100vh - 500px)' }}>
        <Switch>
          <Route path="/" exact>
            <Order />
          </Route>
          <Route path="/import">
            <Import />
          </Route>
        </Switch>
      </main>
    </HashRouter>
  );
};

export default App;
