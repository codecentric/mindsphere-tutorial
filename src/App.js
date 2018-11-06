import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
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
    this.setState({ data: result.data });
    console.log(result);
  }

  render() {
    return (
      <div className="App">
        <p>{JSON.stringify(this.state.data, null, 2)}</p>
      </div>
    );
  }
}

export default App;
