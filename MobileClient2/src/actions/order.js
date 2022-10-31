import {WS,ORDER} from './types';

export const submitNormalOrder = (token, orderState) => {
  const orderTemp = JSON.parse(orderState);

  const order = {
    departure: orderTemp.departure,
    destination: orderTemp.destination,
    startDate: orderTemp.startDate,
    startTime: orderTemp.startTime,
    contactPerson: orderTemp.contactPerson,
    contactContactNo: orderTemp.contactContactNo,
    isFiveSeat: orderTemp.isFiveSeat,
    isShare: orderTemp.isShare,
    shareSeat: orderTemp.shareSeat,
  }

  return {
    type: WS.SUBMIT_NORMAL_ORDER,
    order: order,
    token: token,
  }
}

export const submitEditNormalOrder = (token, orderState) => {
  const orderTemp = JSON.parse(orderState);

  const order = {
    id: orderTemp.id,
    departure: orderTemp.departure,
    destination: orderTemp.destination,
    startDate: orderTemp.startDate,
    startTime: orderTemp.startTime,
    contactPerson: orderTemp.contactPerson,
    contactContactNo: orderTemp.contactContactNo,
    isFiveSeat: orderTemp.isFiveSeat,
    isShare: orderTemp.isShare,
    shareSeat: orderTemp.shareSeat,
  }

  return {
    type: WS.SUBMIT_EDIT_NORMAL_ORDER,
    order: order,
    token: token,
  }
}

// export const updateOpenedOrder = (order) => {
//   return {
//     type: ORDER.UPDATE_OPENED_ORDER,
//     openedOrder: order,
//   }
// }
export const getAcceptHistoryOrders = (token, user_id) => {
  return {
    type: WS.GET_ACCEPT_HISTORY_ORDERS,
    token: token,
    user_id: user_id,
  }
}

export const getAvailableOrders = (token, position) => {
  return {
    type: WS.GET_AVAILABLE_ORDERS,
    token: token,
    position: position,
  }
}

export const getUserOrders = (token) => {
    return {
      type: WS.GET_USER_ORDERS,
      token: token,
    }
}

export const getShareOrders = (token) => {
    return {
      type: WS.GET_SHARE_ORDERS,
      token: token,
    }
}

// export const cancelOrder = (token, order_id) => {
//   return {
//     type: WS.CANCEL_ORDER,
//     token: token, order_id: order_id,
//   }
// }

export const cancelOrderSuccess = () => {
  return {
    type: ORDER.CANCEL_ORDER_SUCCESS,
  }
}
