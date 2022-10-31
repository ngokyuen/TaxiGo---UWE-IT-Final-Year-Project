import {SIGN, WS} from '../actions/types';
import {Alert} from 'react-native';
import {URL} from '../../config';

let ws = new WebSocket(URL.WEBSOCKET_URL);

const initialState = {
  "ws": ws,
  response: null,
};

export default function ws(state = initialState, action){
  const {username, password, order, token, type, response, order_id,
    firstname, lastname, email, address, mobile, birthday, new_password, position,
    user_id, user_type, price, payment_method
  } = action;
  switch (type){
    case WS.JOIN_ORDER:
    case WS.LEAVE_JOIN_ORDER:
    case WS.COMPLETE_ORDER:
    case WS.CANCEL_ORDER:
    case WS.CHANGE_TRANSITION_STATUS:
      state.ws.send(JSON.stringify({action: type,"token":token, "order_id":order_id}));
      return {
        ...state, type: type,
      };
    case WS.CHANGE_ARRIVAL_STATUS:
      state.ws.send(JSON.stringify({action: type,"token":token, "order_id":order_id, "price":price}));
      return {
        ...state, type: type,
      };
    case WS.ACCEPT_ORDER:
      state.ws.send(JSON.stringify({action: type,"token":token, "order_id":order_id, "user_id":user_id}));
      return {
        ...state, type: type,
      };
    case WS.SET_PAYMENT_METHOD:
      state.ws.send(JSON.stringify({action: type,"token":token, "order_id":order_id, "payment_method": payment_method}));
      return {
        ...state, type: type,
      };
    // case SIGN.SIGN_IN_SUCCESS:
    //   const {_id} = action.user;
    //   // Alert.alert(_id);
    //   return {
    //     ...state, token: _id,
    //   };
  case WS.SIGN_IN:
      state.ws.send(JSON.stringify({action: type,"username":username, "password":password,}));
      return {
        ...state, type: type,
      };
  case WS.SIGN_UP:
      state.ws.send(JSON.stringify({action: type, "user_type": user_type, "username":username, "password":password,}));
      return {
        ...state, type: type,
      };
    case WS.SUBMIT_NORMAL_ORDER:
    case WS.SUBMIT_EDIT_NORMAL_ORDER:
      state.ws.send(JSON.stringify({action: type,"order":order, "token":token}));
      return {
        ...state, type: type,
      };
    case WS.GET_ACCEPT_HISTORY_ORDERS:
      state.ws.send(JSON.stringify({action: type,"token":token, "user_id":user_id}));
      return {
        ...state, type: type,
      };
    case WS.GET_USER_ORDERS:
    case WS.GET_SHARE_ORDERS:
      state.ws.send(JSON.stringify({action: type,"token":token}));
      return {
        ...state, type: type,
      };
    case WS.GET_AVAILABLE_ORDERS:
      state.ws.send(JSON.stringify({action: type, "token":token, "position":position}));
      return {
        ...state, type: type,
      };
    case WS.UPDATE_USER_PROFILE:
      state.ws.send(JSON.stringify({
        action: type,"token":token, "firstname": firstname, "lastname": lastname,
        "email":email, "address":address, "mobile":mobile, "birthday": birthday,
        "password": password, "new_password": new_password,
      }));
      return {
        ...state, type: type,
      };
      //repsonse case
    case WS.ACCEPT_ORDER_RESPONSE:
    case WS.SIGN_UP_RESPONSE:
    case WS.SIGN_IN_RESPONSE:
    case WS.SUBMIT_NORMAL_ORDER_RESPONSE:
    case WS.SUBMIT_EDIT_NORMAL_ORDER_RESPONSE:
    case WS.UPDATE_USER_PROFILE_RESPONSE :
    case WS.GET_USER_ORDERS_RESPONSE:
    case WS.GET_SHARE_ORDERS_RESPONSE:
    case WS.GET_AVAILABLE_ORDERS_RESPONSE:
    case WS.GET_ACCEPT_HISTORY_ORDERS_RESPONSE:
    case WS.CANCEL_ORDER_RESPONSE:
    case WS.JOIN_ORDER_RESPONSE:
    case WS.LEAVE_JOIN_ORDER_RESPONSE:
    case WS.COMPLETE_ORDER_RESPONSE:
    case WS.CHANGE_TRANSITION_STATUS_RESPONSE:
    case WS.CHANGE_ARRIVAL_STATUS_RESPONSE:
    case WS.SET_PAYMENT_METHOD_RESPONSE:
      return {
        ...state, response: response, type: type,
      };

    case WS.ACCEPT_ORDER_RESPONSE_COMPLETED:
    case WS.SUBMIT_NORMAL_ORDER_RESPONSE_COMPLETED:
    case WS.SUBMIT_EDIT_NORMAL_ORDER_RESPONSE_COMPLETED:
    case WS.UPDATE_USER_PROFILE_COMPLETED:
    case WS.GET_USER_ORDERS_RESPONSE_COMPLETED:
    case WS.GET_AVAILABLE_ORDERS_RESPONSE_COMPLETED:
    case WS.GET_ACCEPT_HISTORY_ORDERS_RESPONSE_COMPLETED:
    case WS.GET_SHARE_ORDERS_RESPONSE_COMPLETED:
    case WS.SIGN_UP_RESPONSE_COMPLETED:
    case WS.SIGN_IN_RESPONSE_COMPLETED:
    case WS.CANCEL_ORDER_RESPONSE_COMPLETED:
    case WS.JOIN_ORDER_RESPONSE_COMPLETED:
    case WS.LEAVE_JOIN_ORDER_RESPONSE_COMPLETED:
    case WS.COMPLETE_ORDER_RESPONSE_COMPLETED:
    case WS.CHANGE_ARRIVAL_STATUS_RESPONSE_COMPLETED:
    case WS.CHANGE_TRANSITION_STATUS_RESPONSE_COMPLETED:
    case WS.SET_PAYMENT_METHOD_RESPONSE_COMPLETED:
    return {
      ...state, type: type
    }
    default:
      return {
      ...state,
    }
  }
}
