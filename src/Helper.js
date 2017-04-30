import React from 'react';
import PropTypes from 'prop-types';

const Helper = ({ correctCities, onclick }) => {
  let key = 0;
  const correctCitiesSliced = correctCities.slice(0, 10);
  const cities = correctCitiesSliced.map(({ name, id }) => (
    <button className="help-item" onClick={() => onclick(name, id)} key={key += 1}>{name}</button>
  ));

  return <div className="helper">{cities}</div>;
};

Helper.propTypes = {
  correctCities: PropTypes.array.isRequired,
  onclick: PropTypes.func.isRequired,
};

export default Helper;
