import React, { Component } from 'react';
import moment from 'moment';
import LightbulbOn from 'mdi-react/LightbulbOnIcon';
import LightbulbOutline from 'mdi-react/LightbulbOutlineIcon';
import axios from 'axios';
import './App.css';
import WeatherIconComponent from './WeatherIconComponent';
import * as config from './config.json';
import * as parser from './parser.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      newsTitles: ['Loading..'],
      departure: null,
      weather: null,
      delayedMinutesNews: 5,
      delayedSecondsDepartures: 30,
      delayedMinutesWeather: 5,
    };
  }

  componentDidMount() {
    this.loadData();
    this.interval = setInterval(() => this.loadData(), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  loadData = () => {
    this.getWeather();
    this.getDepartues();
    this.getNews();
    //this.homeAssistant();
  };

  homeAssistant = () => {
    axios
      .get(
        `${config.backend.host}:${config.backend.port}${
          config.homeAssistant.route
        }`,
      )
      .then(response => console.log(response));
  };

  getNews = () => {
    const storageNews = JSON.parse(localStorage.getItem('news'));
    let data = null;
    if (
      storageNews &&
      moment.duration(moment().diff(moment(storageNews.time))).minutes() <
        this.state.delayedMinutesNews
    ) {
      console.log('getNews local', storageNews);

      if (storageNews.data === 'news error') {
        this.setState({
          newsTitles: ['News error: did you add your google API key?'],
        });
      } else {
        data = storageNews.data;
        this.setState({
          newsTitles: data.articles.map(article => article.title),
        });
      }
    } else {
      console.log('getNews api');
      axios
        .get(
          `${config.backend.host}:${config.backend.port}${config.news.route}`,
        )
        .then(response => {
          if (response.data) {
            localStorage.setItem(
              'news',
              JSON.stringify({ data: response.data, time: moment() }),
            );
            this.setState({
              newsTitles: response.data.articles.map(article => article.title),
            });
          }
        })
        .catch(error => {
          console.log('News error', error);
        });
    }
  };

  getDepartues = async () => {
    const storageDeparture = JSON.parse(localStorage.getItem('departures'));
    let data = null;
    if (
      storageDeparture &&
      moment.duration(moment().diff(moment(storageDeparture.time))).seconds() <
        this.state.delayedSecondsDepartures
    ) {
      data = storageDeparture.data;
      if (data.ResponseData) {
        this.setState({
          departure: parser.parseDepartures(data.ResponseData),
        });
      }
    } else {
      axios
        .get(`${config.backend.host}:${config.backend.port}`)
        .then(response => {
          data = response.data;
          if (data) {
            if (!data.ResponseData) {
              // eslint-disable-next-line
              throw 'No ResponseData. Missing api key?';
            }

            this.setState({
              departure: parser.parseDepartures(data.ResponseData),
            });
            localStorage.setItem(
              'departures',
              JSON.stringify({ data, time: moment() }),
            );
          }
        })
        .catch(error => {
          console.log('SL error', error);
          this.setState({
            departure: {
              deviations: [
                {
                  text: 'test-text: The elevator is out of order, all in need.',
                },
                {
                  text:
                    'test-text: Conditons might cause delays today. (Apply API-Keys in config to get real data)',
                },
              ],
              times: ['13:37', '(test)', '13:47'],
            },
          });
        });
    }
  };

  setWeatherData = data => {
    this.setState({
      weather: {
        temp: data.main && data.main.temp ? Math.round(data.main.temp) : '?',
        description: data.weather ? data.weather[0].description : undefined,
        icon: data.weather ? data.weather[0].icon : undefined,
      },
    });
  };

  getWeather = () => {
    const storageWeather = JSON.parse(localStorage.getItem('weather'));
    let data = null;
    if (
      storageWeather &&
      moment.duration(moment().diff(moment(storageWeather.time))).minutes() <
        this.state.delayedMinutesWeather
    ) {
      data = storageWeather.data;
      this.setWeatherData(data);
    } else {
      axios
        .get(
          `${config.backend.host}:${config.backend.port}${config.openWeather}`,
        )
        .then(response => {
          data = response.data;
          if (data) {
            this.setWeatherData(data);
            localStorage.setItem(
              'weather',
              JSON.stringify({ data, time: moment() }),
            );
          }
        })
        .catch(error => {
          console.error('Weather error', error);
          this.setState({
            weather: {
              temp: '?',
              description: '',
              icon: '?',
            },
          });
        });
    }
  };

  handleLightsOn = () => {
    this.setState({ lightsOn: true });
    setTimeout(
      function() {
        this.setState({ lightsOn: false });
      }.bind(this),
      2200,
    );
  };

  handleLightsOff = () => {
    this.setState({ lightsOff: true });
    setTimeout(
      function() {
        this.setState({ lightsOff: false });
      }.bind(this),
      2200,
    );
  };

  render() {
    let { departure, weather, newsTitles, lightsOff, lightsOn } = this.state;

    return (
      <div className="content">
        <div className="controlLights">
          <div className="lightsOn" onClick={this.handleLightsOn}>
            <LightbulbOn
              size={190}
              style={{
                transition: 'opacity 0.2s linear',
                opacity: lightsOn ? 1 : 0,
              }}
            />
          </div>
          <div className="lightsOff" onClick={this.handleLightsOff}>
            <LightbulbOutline
              size={190}
              style={{
                transition: 'opacity 0.2s linear',
                opacity: lightsOff ? 1 : 0,
              }}
            />
          </div>
        </div>

        <div className="leftPanel">
          {newsTitles.slice(0, 12).map((title, index) => {
            title = title.substr(0, title.lastIndexOf('-')) || title;
            return (
              <b className="newsItem" key={index}>
                {title}
              </b>
            );
          })}
        </div>

        {departure && departure.times && (
          <div className="common">
            <div className="departures">
              {departure.times.map((time, index) => {
                return (
                  <h1
                    style={{
                      color: index > 1 ? '#C6C6C6' : '#000000',
                    }}
                    key={`time_${index}`}
                  >
                    {time}
                  </h1>
                );
              })}
            </div>

            <div className="deviations">
              {departure.deviations.map((deviation, index) => {
                return (
                  <div key={`time_${deviation}_${index}`}>{deviation.text}</div>
                );
              })}
            </div>
          </div>
        )}
        {weather && (
          <div>
            <WeatherIconComponent weather={weather} />
            <h1
              style={{ marginLeft: weather.temp < 0 ? -10 : 0, marginTop: -10 }}
            >
              {weather.temp}
            </h1>
          </div>
        )}
      </div>
    );
  }
}

export default App;
