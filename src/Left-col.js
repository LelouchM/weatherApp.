import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Map } from 'immutable';

import SearchContainer from './Search';

class LeftCol extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: -1,
    };
  }

  clickOnFavoriteItem(cityObj, number) {
    this.props.openItem(cityObj.get('city').id, cityObj, number);
    this.setState({ active: number });
  }

  render() {
    const favorites = this.props.favoriteList.map((item, i) => (
      <div
        className={`favorite-item ${(this.state.active === i) ? 'active' : ''}`}
        key={item.get('city').id}
        onClick={() => this.clickOnFavoriteItem(item, i)}
      >
        <span className="city-name">{item.get('city').name}</span>
        <span className={`temperature ${item.get('list')[0].weather[0].main}`}>{parseInt(`${item.get('list')[0].main.temp - 273}`, 10)}
          <i className="icon-celcius" />
        </span>
        <span className="delete-btn icon-cancel-circle" onClick={() => this.props.deleteFavorite(`${i}`)} />
      </div>
    ));

    return (
      <aside className="left-col">
        <SearchContainer />
        <div className="favorites" id="container">
          <div className="scrolling-content" id="scrolling-content">
            {favorites}
          </div>
          <div className="scroll" id="scroll">
            <div className="scroll-bar" id="scroll-bar" />
          </div>
        </div>
      </aside>
    );
  }
}

LeftCol.propTypes = {
  favoriteList: PropTypes.object.isRequired,
  deleteFavorite: PropTypes.func.isRequired,
  openItem: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    favoriteList: state.favoriteReducer,
  }),
  dispatch => ({
    deleteFavorite: (value) => {
      dispatch({ type: 'REMOVE_FROM_FAVORITE', payload: value });
    },
    openItem: (id, cityObj, number) => {
      dispatch((dispatcher) => {
        fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${id}&APPID=59266b31367f58b75f5f9f7eb60f8a2f`)
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
  }),
)(LeftCol);
