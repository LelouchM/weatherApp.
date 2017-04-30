import React from 'react';

function prepareList(cityInformation) {
  const propsList = cityInformation.get('list');
  let today = '';
  const list = propsList.filter((item, i) => {
    let result;
    if (!i) {
      today = item.dt_txt;
      result = true;
    }
    if (!~item.dt_txt.indexOf(today.slice(0, 10))) {
      result = !!~item.dt_txt.indexOf('15:00:00');
    }
    return result;
  });
  if (list.size < 6) list.push(propsList.get(`${propsList.size - 1}`));
  return list;
}

function mapList(cityInformation) {
  // const NA = <i className="icon-na" />;
  const list = prepareList(cityInformation);
  const mappedList = list.map((item, i) => {
    let result;
    if (i < 2) {
      result = (<div className="weather-display-item-row" key={item.dt}>
        <h2 className="day-date">{(i) ? 'Tomorrow' : 'Today'}</h2> <h2 className="day-date">{item.dt_txt.slice(8, 10)}</h2>
        <ul className="weather-information">
          <li>Temperature: {parseInt(`${item.main.temp - 273}`, 10)}</li>
          <li>Max. temperature: {parseInt(`${item.main.temp_max - 273}`, 10)}</li>
          <li>Min. temperature: {parseInt(`${item.main.temp_min - 273}`, 10)}</li>
          <li>Pressure: {item.main.pressure}</li>
          <li>Sea level: {item.main.sea_level}</li>
          <li>Ground level: {item.main.grnd_level}</li>
          <li>Humidity: {item.main.humidity}</li>
          <li>Weather: {item.weather[0].main}</li>
          <li>Wind speed: {item.wind.speed}</li>
        </ul>
      </div>);
    } else {
      result = (<div className="weather-display-item-col" key={item.dt}>
        <div className="day-date">{item.dt_txt.slice(8, 10)}</div>
        <ul className="weather-information">
          <li>Temperature: {parseInt(`${item.main.temp - 273}`, 10)}</li>
          <li>Pressure: {item.main.pressure}</li>
          <li>Weather: {item.weather[0].main}</li>
          <li>Wind speed: {item.wind.speed}</li>
        </ul>
      </div>);
    }
    return result;
  });

  return mappedList;
}

export default mapList;
