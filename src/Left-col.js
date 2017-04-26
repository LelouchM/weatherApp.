import React from 'react';

const LeftCol = () => (
  <aside className="left-col">
    <form className="search-container" method="get" action="#">
      <input type="text" placeholder="Enter city name" />
      <button className="search-icon icon-search"></button>
      <div className="helper">
        <div className="help-item">Piter</div>
        <div className="help-item">Moscow</div>
        <div className="help-item">Orenburg</div>
      </div>
    </form>
    <div className="favorites" id="container">
      <div className="scrolling-content" id="scrolling-content">
        <div className="favorite-item">
          <span className="city-name">Moscow</span>
          <span className="temperature">24<i className="icon-celcius"></i>
          </span>
          <span className="delete-btn icon-cancel-circle"></span>
        </div>
        <div className="favorite-item">
          <span className="city-name">Moscow</span>
          <span className="temperature rain">24<i className="icon-celcius"></i></span>
          <span className="delete-btn icon-cancel-circle"></span>
        </div>
        <div className="favorite-item">
          <span className="city-name">Moscow</span>
          <span className="temperature sun">24<i className="icon-celcius"></i></span>
          <span className="delete-btn icon-cancel-circle"></span>
        </div>
      </div>
      <div className="scroll" id="scroll">
        <div className="scroll-bar" id="scroll-bar" />
      </div>
    </div>
  </aside>
);

export default LeftCol;
