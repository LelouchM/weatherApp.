import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';

import SearchContainer from './Search';
import addScroll from './scroll';

class LeftCol extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: -1,
    };
  }
  componentDidMount() {
    const list = List(JSON.parse(localStorage.getItem('cityList')).map(item => Map(item)));
    this.props.fetchFromStorage(list);
    list.forEach((item, i) => {
      this.props.reloadItem(item.get('city').id, i);
    });
    window.onunload = () => localStorage.setItem('cityList', JSON.stringify(this.props.favoriteList.toJSON()));
  }

  componentDidUpdate() {
    addScroll();
  }

  resetActive(num) {
    this.setState({ active: num });
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
        <span
          className="delete-btn icon-cancel-circle"
          onClick={(e) => {
            if (this.state.active === i) {
              this.props.clearMain();
              this.setState({ active: -1 });
            } else if (this.state.active > i) {
              this.setState({ active: this.state.active - 1 });
            }
            this.props.deleteFavorite(`${i}`);
            e.stopPropagation();
          }}
        />
      </div>
    ));

    return (
      <aside className="left-col">
        <SearchContainer reset={num => this.resetActive(num)} />
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
  favoriteList: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  deleteFavorite: PropTypes.func.isRequired,
  openItem: PropTypes.func.isRequired,
  fetchFromStorage: PropTypes.func.isRequired,
  clearMain: PropTypes.func.isRequired,
  reloadItem: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    favoriteList: state.favoriteReducer,
  }),
  dispatch => ({
    clearMain: () => {
      dispatch({ type: 'SUCSESS_FETCH_INFORMATION', payload: {} });
    },
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
    fetchFromStorage: (value) => {
      dispatch({ type: 'FETCH_FROM_STORAGE', payload: value });
    },
    reloadItem: (id, number) => {
      dispatch((dispatcher) => {
        fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${id}&APPID=59266b31367f58b75f5f9f7eb60f8a2f`)
        .then((response) => {
          response.json().then((value) => {
            dispatcher({ type: 'CHANGE_FAVORITE_ITEM', payload: { num: number, value: Map(value) } });
          });
        })
        .catch(() => {});
      });
    },
  }),
)(LeftCol);
