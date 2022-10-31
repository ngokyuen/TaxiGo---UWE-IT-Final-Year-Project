import React, {Component} from 'react';
import {View, Text, Image, Alert} from 'react-native';
import {connect} from 'react-redux';
import NormalOrderPage from './normalOrder';
import OrderHistoryPage from './orderHistory';
import ShareOrderPage from './shareOrder';
import {TabNavigator,StackNavigator} from 'react-navigation';
import * as pageActions from '../actions/page';
import * as userActions from '../actions/user';
import ModalDropdown from 'react-native-modal-dropdown';

const TabNavi = TabNavigator(
    {
      NormalOrder: {
        screen: NormalOrderPage,
      },
      ShareOrder: {
        screen: ShareOrderPage,
      },
      OrderHistory: {
        screen: OrderHistoryPage,
      },
    }, {
      tabBarOptions: {
        activeTintColor: '#000',
      },

});


var self;
class IndexPage extends Component {

  static navigationOptions = ({navigation}) => ({
      title: 'Taxi Go',
      headerRight:(
      <ModalDropdown
          onSelect={(i)=>{selectSetting(i)}}
        dropdownTextStyle={{ fontSize: 16,paddingRight: 100,alignItems:'center',}} defaultValue="..." options={['Profile', 'Sign out']}>
        <Image style={styles.largeInputIcon} source={require('../images/if_setting_46837.png')} />
      </ModalDropdown>
    )
  });

  constructor(props){
    super(props);
    self = this;
  }

  componentDidMount(){
    const {navigation} = this.props;
    this.props.onAttachNavigation(navigation);
  }

  signout(){
    this.props.onSignOut();
  }

  render(){
    return (
      <TabNavi />
    );
  }
};

const selectSetting = (i) => {
  if (i == 1){
    self.signout();
  } else if (i == 0){
    const {navigation} = self.props.pageStore;
    navigation.navigate('Profile');
  }

}

const mapStateToProps = (state) => {
  return {
    ...state
  }
};

const mapActionToProps = (dispatch) => {
  return {
    onSignOut: () => {dispatch(userActions.signOut())},
    onAttachNavigation: (navigation) => {dispatch(pageActions.attach_main_navigation(navigation))},
    //onAttachTabNavigation: (navigation) => {dispatch(pageActions.attach_tab_navigation(navigation))},
  }
}

export default connect(mapStateToProps,mapActionToProps)(IndexPage);
