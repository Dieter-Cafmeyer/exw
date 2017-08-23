import React from 'react';
import {Match, BrowserRouter as Router} from 'react-router';
//import {Router, Route, hashHistory} from 'react-router';

import {Home, Overview} from '../pages/';

const App = () => {

  localStorage.setItem(`language`, `nl-NL`);

  return (
    <Router>
      <main>

        <Match
            exactly pattern='/'
            render={() => (<Home />)}
        />

        <Match
            exactly pattern='/overview'
            render={() => (<Overview />)}
        />

      </main>
    </Router>
  );
};

export default App;
