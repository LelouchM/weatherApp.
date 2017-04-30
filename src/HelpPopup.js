import React from 'react';

import Helper from './Helper';

const HelpPopUp = ({ helperOpen, inputValue, correctCities, clickOnHelperItem }) => {
  let helpPopUp;

  if (helperOpen && inputValue) {
    helpPopUp = (correctCities.length)
      ? (<Helper
        correctCities={correctCities}
        onclick={clickOnHelperItem}
      />)
      : <div className="helper">Not matches found...</div>;
  } else {
    helpPopUp = null;
  }

  return helpPopUp;
};

export default HelpPopUp;
