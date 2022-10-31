import {SIGN,WS} from './types';

export const updateUserProfile = (token, profileObj) => {
  const {firstname, lastname, email, mobile, address, password,birthday, new_password} = profileObj;

  return {
    "type": WS.UPDATE_USER_PROFILE,
    "firstname": firstname, "lastname": lastname, "email": email, "birthday": birthday,
    "mobile": mobile, "address": address, "password": password, "token": token,
    "new_password": new_password,
  }
}

export const signIn = (username, password) => {
  return {
    type: WS.SIGN_IN,
    username: username,
    password: password,
  }
}

export const signInSuccess = (userJSON) => {
  return {
    type: SIGN.SIGN_IN_SUCCESS,
    user: userJSON,
  }
}

export const signOut = () => {
  return {
    type: SIGN.SIGN_OUT,
  }
}

export const signUp = (username, password, user_type) => {
  return {
    type: WS.SIGN_UP,
    username: username,
    password: password,
    user_type: user_type,
  }
}

export const signUpSuccess = () => {
  return {
    type: SIGN.SIGN_UP_SUCCESS,
  }
}
