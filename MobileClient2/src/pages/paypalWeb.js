import React, {Component} from 'react';
import {Linking, View, Text, Image, Button, TextInput,TouchableOpacity,
   Alert, ScrollView, WebView} from 'react-native';

import {connect} from 'react-redux';
import * as pageActions from '../actions/page';
import * as orderActions from '../actions/order';

import {WS, ORDER} from '../actions/types';
import { NavigationActions } from 'react-navigation'
import {URL} from '../../config';

class PaypalWebPage extends Component {

  webview = null;

  static navigationOptions = {
     title: 'Paypal',
   };

  constructor(props){
    super(props);
  }

  render(){
    const {token, order_id}  = this.props.navigation.state.params;
    // const patchPostMessageFunction = function() {
    //   var originalPostMessage = window.postMessage;
    //
    //   var patchedPostMessage = function(message, targetOrigin, transfer) {
    //     originalPostMessage(message, targetOrigin, transfer);
    //   };
    //
    //   patchedPostMessage.toString = function() {
    //     return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
    //   };
    //
    //   window.postMessage = patchedPostMessage;
    // };
    //
    // const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';


    return (
      <WebView
        ref={(webview)=>{this.webview = webview;}}
        source={{uri: URL.PAYPAL_URL + order_id + '/' + token}}
      />
    );
  }

  // onMessage = (e) => {
  //   Alert("Test");
  //   this.props.navigation.dispatch(NavigationActions.back({}));
  // }
}


export default connect(null, null)(PaypalWebPage);
