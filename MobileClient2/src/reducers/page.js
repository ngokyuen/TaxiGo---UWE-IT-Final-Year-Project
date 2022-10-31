import {PAGE} from '../actions/types';

const initialState = {
  navigation: null,
  tab_navigation: null,
  previous: '',
  place: '',
}

export default function page(state = initialState, action){
  switch (action.type){

    case PAGE.ATTACH_MAIN_NAVIGATION:
      return {
        ...state, "navigation": action.navigation,
      };
    case PAGE.ATTACH_TAB_NAVIGATION:
      return {
        ...state, "tab_navigation": action.tab_navigation,
      };

    case PAGE.MAP_RESULT_NAVI_BACK:
      return {
        ...state, "previous": action.previous,
        "place": action.place,
      };

    case PAGE.MAP_RESULT_NAVI_BACK_CLEAR:
      return {
        ...state, "previous": '',
        "place": '',
      };

    default:
      return state;
  }
}
