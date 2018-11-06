import React, { Component } from 'react';
import Gauge from 'react-svg-gauge';
import axios from 'axios';
import './App.css';

const baseUrl = '/api/iottimeseries/v3/timeseries/';
const deviceId = '1310450cbc204d238c8f4662987aa01f';

class App extends Component {
  constructor() {
    super();
    this.state = {
      ambientLight: {},
      barometer: {},
      temperature: {}
    };
  }

  componentDidMount() {
    this.ambientLightInterval = setInterval(this.loadAmbientLight, 5000);
    this.barometerInterval = setInterval(this.loadBarometer, 5000);
    this.temperatureInterval = setInterval(this.loadTemperature, 5000);
  }

  componentWillUnmount() {
    if (this.ambientLightInterval) {
      clearInterval(this.ambientLightInterval);
    }
    if (this.barometerInterval) {
      clearInterval(this.barometerInterval);
    }
    if (this.temperatureInterval) {
      clearInterval(this.temperatureInterval);
    }
  }

  loadData = async (dataSet) => {
    const result = await axios.get(baseUrl + deviceId + '/' + dataSet, {
      xrsfCookieName: 'x-xsrf-token',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).catch(console.log);
    console.log(result);
    if (result && result.data && (result.data.length > 0)) {
      this.setState({ [dataSet]: result.data[0] });
    }
  }

  loadAmbientLight = async () => {
    await this.loadData('ambientLight');
  }

  loadBarometer = async () => {
    await this.loadData('barometer');
  }

  loadTemperature = async () => {
    await this.loadData('temperature');
  }

  render() {
    return (
      <div className='App'>
        <Gauge label='Illuminance'
          value={ this.state.ambientLight.Illuminance ? this.state.ambientLight.Illuminance : 0 }
          min={0}
          max={1500}
          valueFormatter={(number) => (`${number} lux`)}
          valueLabelStyle={{fontSize: '15pt'}} />
        <Gauge label='Altitude'
          value={ this.state.barometer.Altitude ? this.state.barometer.Altitude : 0 }
          min={0}
          max={10000}
          valueFormatter={(number) => (`${number} m`)}
          valueLabelStyle={{fontSize: '15pt'}} />
        <Gauge label='Pressure'
          value={ this.state.barometer.Pressure ? this.state.barometer.Pressure : 0 }
          min={0}
          max={1500}
          valueFormatter={(number) => (`${number} mbar`)}
          valueLabelStyle={{fontSize: '15pt'}} />
        <Gauge label='Temperature'
          value={ this.state.temperature.Temperature ? this.state.temperature.Temperature : 0 }
          min={-30}
          max={50}
          valueFormatter={(number) => (`${number} ℃`)}
          valueLabelStyle={{fontSize: '15pt'}} />
      </div>
    );
  }
}

export default App;
