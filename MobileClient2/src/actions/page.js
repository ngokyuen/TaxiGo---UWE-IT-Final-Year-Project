import {PAGE} from './types';

export const attach_main_navigation = (navigation) => {
  return {
    type: PAGE.ATTACH_MAIN_NAVIGATION,
    "navigation": navigation,
  }
}

export const attach_tab_navigation = (navigation) => {
  return {
      type: PAGE.ATTACH_TAB_NAVIGATION,
      "tab_navigation": navigation,
  }
}

export const mapResultNaviBack = (previous, place) => {
  return {
    type: PAGE.MAP_RESULT_NAVI_BACK,
    "previous": previous, "place": place,
  }
}

export const mapResultNaviBackClear = () => {
  return {
    type: PAGE.MAP_RESULT_NAVI_BACK_CLEAR,
  }
}
