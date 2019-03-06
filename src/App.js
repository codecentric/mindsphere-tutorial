import React, { Component } from 'react';
import Gauge from 'react-svg-gauge';
import AWS from 'aws-sdk/global';
import AWSMqttClient from 'aws-mqtt';
import './App.css';

AWS.config.region = 'eu-west-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'eu-west-1:4551bdb0-fa01-44f5-b8f1-81452a4057c7'
});

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
    this.client = new AWSMqttClient({
      region: AWS.config.region,
      credentials: AWS.config.credentials,
      endpoint: 'a3hwead7lubokm.iot.eu-west-1.amazonaws.com',
      expires: 600,
      connectTimeout: 60 * 1000,
      clientId: 'mqtt-client-' + (Math.floor((Math.random() * 100000) + 1)),
      will: {
        topic: 'abortMessage',
        payload: 'Connection closed abnormally',
        qos: 0,
        retain: false
      }
    });
    console.log('client initialised');
    this.client.on('connect', () => {
      console.log('connected');
      this.client.subscribe('test_topic');
    });
    this.client.on('message', (topic, message) => {
      const result = JSON.parse(message.toString('utf8'));
      console.log(result);
      if (topic === 'test_topic') {
        this.setState({
          ambientLight: { Illuminance: result.illuminance },
          barometer: { Pressure: Math.floor(result.airPressure / 10) },
          temperature: { Temperature: result.temperature }
        });
      }
    });
    this.client.on('close', () => {
      console.log('close');
    });
    this.client.on('offline', () => {
      console.log('offline');
    });
    this.client.on('error', (error) => {
      console.error(error);
    });
    this.client.on('reconnect', () => {
      console.log('reconnect');
    });
    this.client.on('end', () => {
      console.log('reconnect');
    });
  }

  componentWillUnmount() {
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
