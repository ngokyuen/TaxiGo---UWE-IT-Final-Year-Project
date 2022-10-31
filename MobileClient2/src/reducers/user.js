import {WS,SIGN} from '../actions/types';

const initialState = {
  isLogged: false,
  user: {},
}

export default function user(state = initialState, action){
  switch (action.type){

    // case TYPES.SIGN.SIGN_IN:
    //   return {
    //     ...state, isLogged: false, user: {}
    //   };
    case WS.UPDATE_USER_PROFILE:
      const {firstname, lastname, email, mobile, address,birthday} = action;
      const {user} = state;
        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.mobile = mobile;
        user.address = address;
        user.birthday = birthday;
        return {
          ...state,
        }
    case SIGN.SIGN_IN_SUCCESS:
      return {
        ...state, "isLogged": true, "user": action.user,
      };
    case SIGN.SIGN_IN_FAIL:
      return {
        ...state, "isLogged": false, "user": {},
      };

    case SIGN.SIGN_OUT:
      return {
        ...state, "isLogged": false, "user": {},
      };

    // case SIGN.SIGN_UP:
    //   return {
    //     ...state
    //   };
    case SIGN.SIGN_UP_SUCCESS:
      return {
        ...state
      };
    case SIGN.SIGN_UP_FAIL:
      return {
        ...state,
      };

    default:
      return state;
  }
}
