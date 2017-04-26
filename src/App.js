import React from 'react';

import Main from './Main';
import LeftCol from './Left-col';

const App = () => (
  <div>
    <header className="main-header">
      <h1 className="logo">Weather App <span className="icon-sun-inv"></span></h1>
    </header>
    <div className="container">
      <LeftCol />
      <Main />
    </div>
  </div>
);

export default App;
