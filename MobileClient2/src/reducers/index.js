import {combineReducers} from 'redux';
import userReducer from './user';
import wsReducer from './ws';
import pageReducer from './page';
import orderReducer from './order';

export default combineReducers({
  userStore: userReducer,
  wsStore: wsReducer,
  pageStore: pageReducer,
  orderStore: orderReducer,
});
