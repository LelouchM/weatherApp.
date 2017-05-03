import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Map } from 'immutable';

import prepareInformation from './prapareWeatherInformation';

const Main = ({ cityInformation, addToFavorite, favoriteList }) => {
  const list = (cityInformation.size) ? prepareInformation(cityInformation) : null;
  const add = () => {
    let contains = false;
    favoriteList.forEach((item) => {
      if (item.get('city').name === cityInformation.get('city').name) {
        contains = true;
      }
    });
    if (!contains) {
      addToFavorite(Map(cityInformation));
    }
  };

  const main = (!cityInformation.size)
    ? (
      <div className="content-container">
        <div className="empty-container">Please, write city name.</div>
      </div>
      )
    : (
      <div className="content-container">
        <div className="map">
          <input className="map-inp" id="map-inp" type="checkbox" />
          <label className="map-btn" htmlFor="map-inp" onMouseDown={(e) => { e.preventDefault(); }}>
            <span className="open-map">Open map</span>
            <span className="close-map">Close map</span>
          </label>
          <div className="map-img">
            <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${cityInformation.get('city').coord.lat},${cityInformation.get('city').coord.lon}&zoom=13&size=300x250&sensor=false`} alt="map" />
          </div>
        </div>
        <h1 className="city-header" onMouseDown={e => e.preventDefault()}>
          <span className="city-header-name">{cityInformation.get('city').name}:</span>
          <span className="add-to-favorite icon-plus-circle" onClick={add} />
        </h1>
        <div className="content-wrapper">
          <div className="row-content">
            {list.slice(0, 2)}
          </div>
          <div className="col-content">
            {list.slice(2)}
          </div>
        </div>
      </div>
  );
  return main;
};

Main.propTypes = {
  cityInformation: PropTypes.object.isRequired,
  addToFavorite: PropTypes.func.isRequired,
  favoriteList: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

export default connect(
  state => ({
    cityInformation: state.mainReducer.get('cityInformation'),
    favoriteList: state.favoriteReducer,
  }),
  dispatch => ({
    addToFavorite: (value) => {
      dispatch({ type: 'ADD_TO_FAVORITE', payload: value });
    },
  }),
)(Main);
