import React, { Component } from 'react';
import {connect} from 'react-redux';
 import {Alert} from 'react-native';
import {StackNavigator} from 'react-navigation';
import SignInPage from './pages/signin';
import MapPage from './pages/map';
import IndexPage from './pages/';
import DriverIndexPage from './pages/driverIndex';
import OrderDetailPage from './pages/orderDetail';
import EditOrderPage from './pages/editOrder';
import ProfilePage from './pages/profile';
import PaypalWebPage from './pages/paypalWeb';
import {WS} from './actions/types';

const Navi = StackNavigator({
  Index: {screen: IndexPage},
  Map: {screen: MapPage},
  OrderDetail: {screen: OrderDetailPage},
  EditOrder: {screen: EditOrderPage},
  Profile: {screen: ProfilePage},
  PaypalWeb: {screen: PaypalWebPage},
});

const DriverNavi = StackNavigator({
  DriverIndex: {screen: DriverIndexPage},
  Profile: {screen: ProfilePage},
  OrderDetail: {screen: OrderDetailPage},
});


class Routes extends Component {

  constructor(props){
    super(props);
  }

  componentDidMount(){
    const {ws} = this.props.wsStore;
    const {dispatch} = this.props;
    ws.onmessage = (evt) => {
      const {data} = evt;
      const json = JSON.parse(data);
      const {action} = json;
      if (action == WS.SUBMIT_NORMAL_ORDER_RESPONSE){
        dispatch({type: WS.SUBMIT_NORMAL_ORDER_RESPONSE, response: json});
      } else if (action == WS.UPDATE_USER_PROFILE_RESPONSE){
        dispatch({type: WS.UPDATE_USER_PROFILE_RESPONSE, response: json});
      } else if (action == WS.GET_USER_ORDERS_RESPONSE){
        dispatch({type: WS.GET_USER_ORDERS_RESPONSE, response: json});
      } else if (action == WS.SIGN_IN_RESPONSE){
        dispatch({type: WS.SIGN_IN_RESPONSE, response: json});
      } else if (action == WS.SIGN_UP_RESPONSE){
        dispatch({type: WS.SIGN_UP_RESPONSE, response: json});
      } else if (action == WS.GET_AVAILABLE_ORDERS_RESPONSE){
        dispatch({type: WS.GET_AVAILABLE_ORDERS_RESPONSE, response: json});
      } else if (action == WS.GET_SHARE_ORDERS_RESPONSE){
        dispatch({type: WS.GET_SHARE_ORDERS_RESPONSE, response: json});
      } else if (action == WS.CANCEL_ORDER_RESPONSE){
        dispatch({type: WS.CANCEL_ORDER_RESPONSE, response: json});
      } else if (action == WS.SUBMIT_EDIT_NORMAL_ORDER_RESPONSE){
        dispatch({type: WS.SUBMIT_EDIT_NORMAL_ORDER_RESPONSE, response: json});
      }  else if (action == WS.JOIN_ORDER_RESPONSE){
        dispatch({type: WS.JOIN_ORDER_RESPONSE, response: json});
      }  else if (action == WS.LEAVE_JOIN_ORDER_RESPONSE){
        dispatch({type: WS.LEAVE_JOIN_ORDER_RESPONSE, response: json});
      }  else if (action == WS.ACCEPT_ORDER_RESPONSE){
        dispatch({type: WS.ACCEPT_ORDER_RESPONSE, response: json});
      }  else if (action == WS.COMPLETE_ORDER_RESPONSE){
        dispatch({type: WS.COMPLETE_ORDER_RESPONSE, response: json});
      }  else if (action == WS.GET_ACCEPT_HISTORY_ORDERS_RESPONSE){
        dispatch({type: WS.GET_ACCEPT_HISTORY_ORDERS_RESPONSE, response: json});
      }  else if (action == WS.CHANGE_ARRIVAL_STATUS_RESPONSE){
        dispatch({type: WS.CHANGE_ARRIVAL_STATUS_RESPONSE, response: json});
      }  else if (action == WS.CHANGE_TRANSITION_STATUS_RESPONSE){
        dispatch({type: WS.CHANGE_TRANSITION_STATUS_RESPONSE, response: json});
      } else if (action == WS.SET_PAYMENT_METHOD_RESPONSE){
        dispatch({type: WS.SET_PAYMENT_METHOD_RESPONSE, response: json});
      }
    }
  }

  render(){
    // this.state.ws.onopen = () => {
    //   this.stat.ws.send('{"action":"signin", "username":"ted", "password":"ted"}');
    // }
    const {isLogged, user} = this.props.userStore;
    // Alert.alert(isLogged.toString());
    if (isLogged){
      if (user.type == "driver") {
        return (<DriverNavi />);
      } else {
        return (<Navi />);
      }

    } else {
      return (
        <SignInPage />
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    ...state
  }
};

const mapActionsToProps = (dispatch) => {
  return {
    dispatch:dispatch,
  }
}

export default connect(mapStateToProps, mapActionsToProps)(Routes);
