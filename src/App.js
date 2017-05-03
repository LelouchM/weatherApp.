import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Main from './Main';
import LeftCol from './Left-col';

class App extends Component {

  componentDidMount() {
    const cityName = this.props.location.slice(1);
    if (cityName) {
      const position = cityName.indexOf('_');
      const city = (~position) ? cityName.slice(0, position) : cityName;
      const region = (~position) ? cityName.slice(position + 1) : ' ';
      this.props.getCityByName(city, region);
    }
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.props.showGeoWeather(position.coords.latitude, position.coords.longitude);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const cityName = nextProps.location.slice(1);
    if (cityName) {
      const position = cityName.indexOf('_');
      const city = (~position) ? cityName.slice(0, position) : cityName;
      const region = (~position) ? cityName.slice(position + 1) : ' ';
      this.props.getCityByName(city, region);
    }
  }

  componentDidUpdate() {
    if (this.props.error.show) {
      setTimeout(this.props.closeError, 7000);
    }
  }

  render() {
    return (
      <div className="app-container">
        {(this.props.error.show) ? <div className="error">{this.props.error.text}</div> : null}
        <header className="main-header">
          <h1 className="logo">Weather App<span className="icon-sun-inv" /></h1>
        </header>
        <div className="container">
          <LeftCol />
          <Main />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  error: PropTypes.object.isRequired,
  closeError: PropTypes.func.isRequired,
  showGeoWeather: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired,
  getCityByName: PropTypes.func.isRequired,
};

export default connect(
  (state, ownProps) => ({
    error: state.mainReducer.get('FetchError'),
    location: ownProps.location.pathname,
  }),
  dispatch => ({
    closeError: () => {
      dispatch({ type: 'CLOSE_FETCH_ERROR', payload: { text: '', show: false } });
    },
    showGeoWeather: (lat, lon) => {
      dispatch((dispatcher) => {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=59266b31367f58b75f5f9f7eb60f8a2f`)
        .then((response) => {
          response.json().then((value) => {
            dispatcher({ type: 'SUCSESS_FETCH_INFORMATION', payload: value });
          });
        })
        .catch(() => {
          dispatcher({ type: 'FAIL_FETCH_INFORMATION', payload: { text: 'Connection error', show: true } });
        });
      });
    },
    getCityByName: (city, region) => {
      dispatch((dispatcher) => {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city},${region}&APPID=59266b31367f58b75f5f9f7eb60f8a2f`)
        .then((response) => {
          response.json().then((value) => {
            dispatcher({ type: 'SUCSESS_FETCH_INFORMATION', payload: value });
          });
        })
        .catch(() => {
          dispatcher({ type: 'FAIL_FETCH_INFORMATION', payload: { text: 'Wrong city name or region', show: true } });
          dispatcher({ type: 'SUCSESS_FETCH_INFORMATION', payload: {} });
        });
      });
    },
  }),
)(App);
