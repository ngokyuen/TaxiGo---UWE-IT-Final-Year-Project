import {ORDER} from '../actions/types';

import {View, Text, Image, Button, TextInput,TouchableOpacity, Alert,ScrollView} from 'react-native';

const initiateState = {
  openedOrder: null,
};

export default function order(state=initiateState, action){
  switch (action.type){
    // case ORDER.UPDATE_OPENED_ORDER:
    //   return {
    //     ...state, openedOrder: action.openedOrder, type: action.type,
    //   }
    // case ORDER.UPDATE_OPENED_ORDER_COMPLETED:
  //   case ORDER.CANCEL_UPDATE_OPENED_ORDER:
  //   case ORDER.CANCEL_UPDATE_OPENED_ORDER_COMPLETED:
  //     return {
  //       ...state, type: action.type,
  //     }
    default:
      return state;
  }
}
