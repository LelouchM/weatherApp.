import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Main from './Main';
import LeftCol from './Left-col';

class App extends Component {
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
};

export default connect(
  state => ({
    error: state.mainReducer.get('FetchError'),
  }),
  dispatch => ({
    closeError: () => {
      dispatch({ type: 'CLOSE_FETCH_ERROR', payload: { text: '', show: false } });
    },
  }),
)(App);
