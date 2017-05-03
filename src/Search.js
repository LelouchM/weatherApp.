import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Map } from 'immutable';

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
    this.input.focus();
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
    e.preventDefault();
    if (this.state.inputValue === '') return;
    let contains = false;
    this.props.favoriteList.forEach((item, i) => {
      if (item.get('city').name.toLowerCase() === this.state.inputValue.toLowerCase()) {
        contains = true;
        this.props.openItem(item.get('city').id, item, i);
        this.props.reset(i);
        this.setState({ inputValue: '' });
      }
    });

    if (!contains) {
      if (this.state.inputValue.toLowerCase() === this.state.selectedCity.name.toLowerCase()) {
        this.props.fetchInformation(`https://api.openweathermap.org/data/2.5/forecast?id=${this.state.selectedCity.id}&APPID=59266b31367f58b75f5f9f7eb60f8a2f`);
      } else if (searchCities(this.state.inputValue).length === 0) {
        this.props.showError();
      } else {
        const cityId = searchCities(this.state.inputValue, new RegExp(`^${this.state.inputValue}$`, 'i'))[0];
        if (cityId === undefined) {
          this.props.showError();
        } else {
          this.props.fetchInformation(`https://api.openweathermap.org/data/2.5/forecast?id=${cityId.id}&APPID=59266b31367f58b75f5f9f7eb60f8a2f`);
        }
      }
      this.props.reset(-1);
      this.setState({ inputValue: '' });
    }

    this.setState({ helperOpen: false });
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
          onBlur={() => setTimeout(() => this.setState({ helperOpen: false }), 100)}
          ref={input => this.input = input}
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
  reset: PropTypes.func.isRequired,
  favoriteList: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  openItem: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    favoriteList: state.favoriteReducer,
  }),
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
          dispatcher({ type: 'FAIL_FETCH_INFORMATION', payload: { text: 'Connection error', show: true } });
          dispatcher({ type: 'SUCSESS_FETCH_INFORMATION', payload: {} });
        });
      });
    },
    showError: () => {
      dispatch({ type: 'FAIL_FETCH_INFORMATION', payload: { text: 'City not found', show: true } });
    },
    openItem: (id, cityObj, number) => {
      dispatch((dispatcher) => {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${id}&APPID=59266b31367f58b75f5f9f7eb60f8a2f`)
        .then((response) => {
          response.json().then((value) => {
            dispatcher({ type: 'SUCSESS_FETCH_INFORMATION', payload: value });
            dispatcher({ type: 'CHANGE_FAVORITE_ITEM', payload: { num: number, value: Map(value) } });
          });
        })
        .catch(() => {
          dispatcher({ type: 'SUCSESS_FETCH_INFORMATION', payload: cityObj });
        });
      });
    },
  }))(Search);
