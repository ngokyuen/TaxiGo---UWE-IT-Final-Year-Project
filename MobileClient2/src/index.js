import React, { Component } from 'react';
import {createStore} from 'redux';
import reducers from './reducers';
import {Provider} from 'react-redux';
import Routes from './routes';

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      store: createStore(reducers),
    }
  }

  render(){
    // this.state.ws.onopen = () => {
    //   this.stat.ws.send('{"action":"signin", "username":"ted", "password":"ted"}');
    // }

    return (
      <Provider store={this.state.store}>
        <Routes />
      </Provider>
    );
  }
}
