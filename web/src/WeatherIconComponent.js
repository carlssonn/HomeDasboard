import React, { Component } from 'react';
import {
  WiDaySunny,
  WiDayCloudy,
  WiCloud,
  WiCloudy,
  WiShowers,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiNightClear,
  WiNightCloudy,
  WiNA,
  WiFog,
} from 'weather-icons-react';

class WeatherIconComponent extends Component {
  render() {
    let icon = this.props.weather.icon;
    switch (icon) {
      case '01d':
        return <WiDaySunny size={88} color="#000" />;
      case '02d':
        return <WiDayCloudy size={88} color="#000" />;
      case '03d':
        return <WiCloud size={88} color="#000" />;
      case '04d':
        return <WiCloudy size={88} color="#000" />;
      case '09d':
        return <WiShowers size={88} color="#000" />;
      case '10d':
        return <WiRain size={88} color="#000" />;
      case '11d':
        return <WiThunderstorm size={88} color="#000" />;
      case '13d':
        return <WiSnow size={88} color="#000" />;
      case '50d':
        return <WiFog size={88} color="#000" />;
      case '01n':
        return <WiNightClear size={88} color="#000" />;
      case '02n':
        return <WiNightCloudy size={88} color="#000" />;
      case '03n':
        return <WiCloud size={88} color="#000" />;
      case '04n':
        return <WiCloudy size={88} color="#000" />;
      case '09n':
        return <WiShowers size={88} color="#000" />;
      case '10n':
        return <WiRain size={88} color="#000" />;
      case '11n':
        return <WiThunderstorm size={88} color="#000" />;
      case '13n':
        return <WiSnow size={88} color="#000" />;
      case '50n':
        return <WiFog size={88} color="#000" />;
      default:
        return <WiNA size={88} color="#000" />;
    }
  }
}

export default WeatherIconComponent;
