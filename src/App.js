import React, { Component } from 'react';
import Gauge from 'react-svg-gauge';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: {}
    };
  }

  async componentDidMount() {
    await this.loadData();
  }

  loadData = async () => {
    const baseUrl = '/api/iottimeseries/v3/timeseries/';
    const deviceId = '1310450cbc204d238c8f4662987aa01f';
    const dataSet = 'ambientLight';
    const result = await axios.get(baseUrl + deviceId + '/' + dataSet, {
      xrsfCookieName: 'x-xsrf-token',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).catch(console.log);
    console.log(result);
    if (result && result.data && (result.data.length > 0)) {
      this.setState({ data: result.data[0] });
    }
  }

  render() {
    return (
      <div className='App'>
        { this.state.data.Illuminance ?
          <Gauge label='Illuminance'
            value={this.state.data.Illuminance}
            min={0}
            max={1500}
            valueFormatter={(number) => (`${number} lux`)}
            valueLabelStyle={{fontSize: '15pt'}} /> :
          <p>Keine Daten gefunden.</p>
        }
      </div>
    );
  }
}

export default App;
