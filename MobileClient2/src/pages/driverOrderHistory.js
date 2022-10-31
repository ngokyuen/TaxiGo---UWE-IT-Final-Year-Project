import React, {Component} from 'react';
import {View, Text, Image, Button, TextInput,TouchableOpacity, Alert,ScrollView,Platform} from 'react-native';
import {connect} from 'react-redux';
import styles from '../styles/app';
import CheckBox from 'react-native-checkbox-heaven';
import * as pageActions from '../actions/page';
import * as orderActions from '../actions/order';
import Snackbar from 'react-native-snackbar';
import PopupDialog, { DialogTitle }  from 'react-native-popup-dialog';

import {WS, ORDER} from '../actions/types';


class DriverOrderHistoryPage extends Component {

  static navigationOptions = {
      tabBarLabel: 'Order History',
      tabBarIcon: ({tinColor})=>(
        <Image
          source={require('../images/history.png')} style={styles.icon}
        />
    ),
  }

  constructor(props){
    super(props);
    this.state = {
      orders: null,
      openedOrderID: null,
    }
  }

  componentWillUpdate(nextProps, nextState){
    const {type, response} = nextProps.wsStore;
    if (type == WS.GET_ACCEPT_HISTORY_ORDERS_RESPONSE){
      const {result, orders} = response;
      if (result) {
           this.setState({orders: orders});
         } else {
           this.showSnackBar("Get Accept History Orders Fail");
         }
       nextProps.onGetAcceptHistoryOrdersCompleted();
    }
  }

  componentDidUpdate(prevProps, prevState){
  }

  componentDidMount(){
    this.getItems();
    if (Platform.OS === 'ios'){
      setInterval(
        () => {this.getItems()}, 5000);
    } else {
      setInterval(
        () => {this.getItems()}, 15000);
    }
  }

  showSnackBar(msg){
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  getItems(){
    const {id} = this.props.userStore.user;
    const token = id;
    this.props.onGetAcceptHistoryOrders(token, id);
  }

  render(){

    return (
      <ScrollView style={{flex:1}}>
        {this.state.orders && this.state.orders.map((val,key)=>{
          const {joinUsers_, departure, status, destination, startDateTime, isShare, shareSeat} = val;
          const startDateTimeObject = new Date(startDateTime);
          const date = startDateTimeObject.getFullYear() + "-" + ("0"+(startDateTimeObject.getMonth() + 1)).slice(-2) + "-" + ("0"+startDateTimeObject.getDate()).slice(-2)
          const time = ("0"+startDateTimeObject.getHours()).slice(-2) + ":" + ("0"+startDateTimeObject.getMinutes()).slice(-2);

          let count_share_seat = 0;
          if (joinUsers_){
            joinUsers_.map((val,key)=>{
              if ((val.isPrevious == false || !val.isPrevious) && val.status == 'JOIN'){
                count_share_seat++;
              }
            })
          }

          const {navigation} = this.props.pageStore;
          return (
            <TouchableOpacity key={key} onPress={(e)=>{
            this.state.openedOrderID=val.id;navigation.navigate('OrderDetail',{order:val})}}>
            <View style={{borderBottomWidth:1,padding:5,borderColor:'#d9d9d9'}}>
              <View style={{flexDirection:'row'}}>
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                  <Text style={{padding:5}} >{departure}</Text>
                </View>
                <View style={{flex:1,alignItems:'center',justifyContent:'center', flexDirection:'column'}}>
                  <View style={{flexDirection:'row'}}>
                    <Image style={{width: 23, height:25,margin:0,padding:0}} source={(status=='PICKED' || status=='TRANSITING' || status=='ARRIVAL' || status=='COMPLETED')?require('../images/arrow_active.png'):require('../images/arrow_blank.png')} />
                    <Image style={{width: 23, height:25,margin:0,padding:0}} source={(status=='TRANSITING' || status=='ARRIVAL' || status=='COMPLETED')?require('../images/arrow_active.png'):require('../images/arrow_blank.png')} />
                    <Image style={{width: 23, height:25,margin:0,padding:0}} source={(status=='ARRIVAL' || status=='COMPLETED')?require('../images/arrow_active.png'):require('../images/arrow_blank.png')} />
                    <Image style={{width: 23, height:25,margin:0,padding:0}} source={(status=='COMPLETED')?require('../images/arrow_active.png'):require('../images/arrow_blank.png')} />
                  </View>

                                  {(status=='PENDING')?<Text style={styles.pendingStatus}>{status}</Text>:null}
                  {(status=='PICKED')?<Text style={styles.pickedStatus}>{status}</Text>:null}
                  {(status=='TRANSITING')?<Text style={styles.transitingStatus}>{status}</Text>:null}
                  {(status=='ARRIVAL')?<Text style={styles.arrivalStatus}>{status}</Text>:null}
                  {(status=='COMPLETED')?<Text style={styles.completedStatus}>{status}</Text>:null}
                  {(status=='CANCELLED')?<Text style={styles.cancelledStatus}>{status}</Text>:null}
                </View>
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                  <Text style={{padding:5}}>{destination}</Text>
                </View>
              </View>
              <View style={{flexDirection:'row',alignItems:'center', justifyContent:'center'}}>
                  <Image style={{width: 30, height:30,margin:5,}} source={require('../images/calendar.png')} />
                  <View style={{flex:1.5,alignItems:'center',justifyContent:'center'}}>
                    <Text >{date}</Text>
                  </View>
                  <Image style={{width: 30, height:30,margin:5,}} source={require('../images/clock.png')} />
                  <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Text >{time}</Text>
                  </View>
              </View>
              { (isShare) ?
              <View style={{flexDirection:'row',alignItems:'center', justifyContent:'center'}}>
                  <Image style={{width: 30, height:30,margin:5,}} source={require('../images/share3.png')} />
                  <View style={{flex:1.5,alignItems:'center',justifyContent:'center'}}>
                    <Text >( {count_share_seat} / {shareSeat} ) Share Seat</Text>
                  </View>
              </View>
              : null}
            </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state
  }
};

const mapActionToProps = (dispatch) => {
  return {
     onGetAcceptHistoryOrders: (token, user_id) => {dispatch(orderActions.getAcceptHistoryOrders(token, user_id));},
     onGetAcceptHistoryOrdersCompleted: () => {dispatch({type:WS.GET_ACCEPT_HISTORY_ORDERS_RESPONSE_COMPLETED});},
  }
}
export default connect(mapStateToProps, mapActionToProps)(DriverOrderHistoryPage);
