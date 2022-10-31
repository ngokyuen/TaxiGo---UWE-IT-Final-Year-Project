import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import App from './src/index';

class MobileClient2 extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('MobileClient2', () => MobileClient2);
