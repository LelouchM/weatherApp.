import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import HelpPopup from './HelpPopup';
import JsonCities from './RussianCity';

const cities = JSON.parse(JsonCities);
function searchCities(value, regEx) {
  const reg = regEx || new RegExp(`^${value}`, 'i');
  const correctCities = cities.filter(({ name }) => ~name.search(reg));
  return correctCities;
}

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      helperOpen: false,
      inputValue: '',
      correctCities: [],
      selectedCity: {
        name: '',
        id: null,
      },
    };
  }

  clickOnHelperItem(name, id) {
    this.setState({
      selectedCity: {
        name,
        id,
      },
      inputValue: name,
      correctCities: [],
      helperOpen: false,
    });
  }


  searchCorrectCities({ value }) {
    const correctCities = searchCities(value);
    this.setState({
      correctCities,
      helperOpen: true,
    });
  }

  requestInf(e) {
    if (this.state.inputValue.toLowerCase() === this.state.selectedCity.name.toLowerCase()) {
      this.props.fetchInformation(`http://api.openweathermap.org/data/2.5/forecast?id=${this.state.selectedCity.id}&APPID=59266b31367f58b75f5f9f7eb60f8a2f`);
    } else if (searchCities(this.state.inputValue).length === 0) {
      this.props.showError();
    } else {
      const cityId = searchCities(this.state.inputValue, new RegExp(`^${this.state.inputValue}$`, 'i'))[0];
      if (cityId === undefined) {
        this.props.showError();
      } else {
        this.props.fetchInformation(`http://api.openweathermap.org/data/2.5/forecast?id=${cityId.id}&APPID=59266b31367f58b75f5f9f7eb60f8a2f`);
      }
    }
    this.setState({ inputValue: '' });
    e.preventDefault();
  }

  render() {
    return (
      <form className="search-container" method="get" action="#" onSubmit={e => this.requestInf(e)}>
        <input
          type="text"
          placeholder="Enter city name"
          value={this.state.inputValue}
          onChange={({ target }) => {
            this.setState({ inputValue: target.value });
            this.searchCorrectCities(target);
          }}
        />
        <button className="search-icon icon-search" />
        <HelpPopup
          helperOpen={this.state.helperOpen}
          inputValue={this.state.inputValue}
          correctCities={this.state.correctCities}
          clickOnHelperItem={(name, id) => this.clickOnHelperItem(name, id)}
        />
      </form>
    );
  }
}

Search.propTypes = {
  fetchInformation: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
};

export default connect(
  () => ({}),
  dispatch => ({
    fetchInformation: (url) => {
      dispatch((dispatcher) => {
        fetch(url)
        .then((response) => {
          response.json().then((value) => {
            dispatcher({ type: 'SUCSESS_FETCH_INFORMATION', payload: value });
          });
        })
        .catch(() => {
          dispatcher({ type: 'FAIL_FETCH_INFORMATION' });
        });
      });
    },
    showError: () => {
      dispatch({ type: 'FAIL_FETCH_INFORMATION', payload: { text: 'City not found', show: true } });
    },
  }))(Search);
