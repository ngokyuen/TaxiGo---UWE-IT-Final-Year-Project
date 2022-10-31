import React, {Component} from 'react';
import {Linking, View, Text, Image, Button, TextInput,TouchableOpacity,
   Alert, ScrollView, Platform} from 'react-native';
import {connect} from 'react-redux';
import styles from '../styles/app';
import CheckBox from 'react-native-checkbox-heaven';
import * as pageActions from '../actions/page';
import * as orderActions from '../actions/order';
import Snackbar from 'react-native-snackbar';
import PopupDialog, { DialogTitle }  from 'react-native-popup-dialog';
import {WS, ORDER} from '../actions/types';
import { NavigationActions } from 'react-navigation';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import call from 'react-native-phone-call'

class OrderDetailPage extends Component {

  static navigationOptions = {
    title: 'Order Detail',
  };

  constructor(props){
    super(props);

    this.state = {
      order: null,
      popupDialog: null, popupLeaveDialog: null, popupPriceDialog: null, popupCompleteDialog: null,
      price: "",
    }

    const {state} = props.navigation;
    const {params} = state;
    const {order} = params;
    this.state.order = order;

    //Alert.alert(order);
  }

  onClickEditButton(){
     //const {navigation} = this.props.pageStore;
     const {navigation} = this.props;
     //Alert.alert(this.state.order);
     navigation.navigate('EditOrder', {order: this.state.order});
  }

  onClickCancelButton(){
    this.state.popupDialog.show({});
  }

  onClickAcceptOrder(){
    const user_id = this.props.userStore.user.id;
    const token = user_id;
    const order_id = this.state.order.id;
    Alert.alert(
      'TaxiGo', 'Do you confirm to accept this order?',
      [
        {text:'Cancel', onPress: ()=>{}},
        {text:'Ok', onPress: ()=>{ this.props.onAcceptOrder(token, order_id, user_id)}},
      ]
    )
  }

  onClickJoinButton(){
      const token = this.props.userStore.user.id;
      const order_id = this.state.order.id;
      this.props.onJoinOrder(token, order_id);
  }

  onClickLeaveButton(){
    this.state.popupLeaveDialog.show({});
  }

  clickCancelDialogCancel(){
    this.state.popupDialog.dismiss({});
  }

  clickCancelDialogSubmit(){
    const token = this.props.userStore.user.id;
    const order_id = this.state.order.id;
    this.props.onCancelOrder(token, order_id);
  }

  onClickChangeTransitionStatus(){
    const token = this.props.userStore.user.id;
    const order_id = this.state.order.id;
    this.props.onChangeTransitionStatus(token, order_id);
  }

  onClickChangeArrivalStatus(){
    const token = this.props.userStore.user.id;
    const order_id = this.state.order.id;
    const price = this.state.price;
    this.props.onChangeArrivalStatus(token, order_id, price);
  }

  clickLeaveDialogCancel(){
    this.state.popupLeaveDialog.dismiss({});
  }

  clickLeaveDialogSubmit(){
      const token = this.props.userStore.user.id;
      const order_id = this.state.order.id;
      this.props.onLeaveJoinOrder(token, order_id);
  }

  clickCompleteDialogCancel(){
    this.state.popupCompleteDialog.dismiss({});
  }

  clickCompleteDialogSubmit(){
      const token = this.props.userStore.user.id;
      const order_id = this.state.order.id;
      this.props.onCompleteOrder(token, order_id);
  }

  onClickCashButton(){
    const token = this.props.userStore.user.id;
    const order_id = this.state.order.id;
    this.props.onSetPaymentMethod(token, order_id, "CASH");
  }

  onClickPaypalButton(){
    const token = this.props.userStore.user.id;
    const order_id = this.state.order.id;
    const {navigation} = this.props.pageStore;
    navigation.navigate('PaypalWeb', {order_id:order_id, token:token});

  }

  componentWillUpdate(nextProps, nextState){
    const {type, response} = nextProps.wsStore;
      //const orderType = nextProps.orderStore.type;

    //reload data to order detail
    if (type == WS.GET_SHARE_ORDERS_RESPONSE || type == WS.GET_USER_ORDERS_RESPONSE || type ==WS.GET_AVAILABLE_ORDERS_RESPONSE || type == WS.GET_ACCEPT_HISTORY_ORDERS_RESPONSE){
        const {result, orders} = response;
        if (result){
          if (orders != null){
            orders.map((val,key)=>{
              if (val.id == nextState.order.id){
                nextState.order = val;
              }
            });
          }
        }
    }

      if (type == WS.CANCEL_ORDER_RESPONSE){
      const {result, orders} = response;
      //Alert.alert(type);
      if (result) {
           //this.showSnackBar("Get Orders Successfully");
           //this.setState({orders: orders});
           // navigate('Main',{});
          this.showSnackBar("Cancel Order Successfully");
          this.state.popupDialog.dismiss({});
          this.props.navigation.dispatch(NavigationActions.back({}));
         } else {
           this.showSnackBar("Cancel Order Fail");
           //this.showSnackBar("Get Orders Fail");
         }
       //nextProps.onGetUserOrdersCompleted();
    }

     if (type == WS.JOIN_ORDER_RESPONSE){
      const {result, orders} = response;
      if (result) {
           this.showSnackBar("Join Order Successfully");
         } else {
           this.showSnackBar("Join Order Fail");
         }
       nextProps.onJoinOrderCompleted();
    }

     if (type == WS.LEAVE_JOIN_ORDER_RESPONSE){
      const {result, orders} = response;
      if (result) {
          this.state.popupLeaveDialog.dismiss({});
          this.showSnackBar("Leave Join Order Successfully");
         } else {
           this.showSnackBar("Leave Join Order Fail");
         }
       nextProps.onLeaveJoinOrderCompleted();
     }

     if (type == WS.COMPLETE_ORDER_RESPONSE){
      const {result, orders} = response;
      if (result) {
          this.state.popupCompleteDialog.dismiss({});
          this.showSnackBar("Complete Order Successfully");
         } else {
           this.showSnackBar("Complete Order Fail");
         }
       nextProps.onCompleteOrderCompleted();
     }


     if (type == WS.ACCEPT_ORDER_RESPONSE){
       const {result, orders} = response;
       if (result) {
           this.showSnackBar("Accept Order Successfully");
          } else {
            this.showSnackBar("Accept Order Fail");
          }
        nextProps.onAcceptOrderCompleted();
     }

      if (type == WS.CHANGE_TRANSITION_STATUS_RESPONSE){
       const {result, orders} = response;
       if (result) {
            this.showSnackBar("Change to TRANSITING Successfully");
          } else {
            this.showSnackBar("Change to TRANSITING Fail");
          }
        nextProps.onChangeTransitionStatusCompleted();
      }

       if (type == WS.CHANGE_ARRIVAL_STATUS_RESPONSE){
        const {result, orders} = response;
        if (result) {
             this.showSnackBar("Change to Arrival Successfully");
           } else {
             this.showSnackBar("Change to Arrival Fail");
           }
         nextProps.onChangeArrivalStatusCompleted();
       }

        if (type == WS.SET_PAYMENT_METHOD_RESPONSE){
           const {result, orders} = response;
           if (result) {
                this.showSnackBar("Set Payment Successfully");
              } else {
                this.showSnackBar("Set Payment Fail");
              }
            nextProps.onSetPaymentMethodCompleted();
       }
    // else if (orderType == ORDER.UPDATE_OPENED_ORDER){
    //   const {openedOrder} = nextProps.orderStore;
    //   //Alert.alert(openedOrder);
    //   nextState.order = openedOrder;
    //   nextProps.onUpdateOpenedOrderCompleted();
    // }

  }

  callContactNo(contactContactNo){
    // const {contactContactNo} = this.state.order;
    // Linking.canOpenURL("tel:"+contactContactNo);
    if (Platform.OS === 'ios')
      RNImmediatePhoneCall.immediatePhoneCall(contactContactNo)
    else {

      const args = {
        number: contactContactNo, // String value with the number to call
        prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call
      }

      call(args).catch(console.error)
    }

  }

  chgPrice(text){
    this.state.price = text;
    let newText = '';
    let numbers = '0123456789';
    for(var i=0;i<text.length;i++){
      if(numbers.indexOf(text[i]) > -1){
        newText = newText + text[i];
      } else {
        alert("Please enter numbers only");
      }
    }
    this.setState({"price":newText});
  }

  componentDidUpdate(prevProps, prevState){
  }

  componentDidMount(){
  }

  showSnackBar(msg){
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  render(){
    const {id, type} = this.props.userStore.user;
    const token = id;
    if (this.state.order){

      const {joinUsers_, user, status, departure,destination, startDateTime,
        contactPerson, contactContactNo, isFiveSeat, isShare, shareSeat,
        isPrevious, driver, driver_, price, paymentMethod, paymentStatus} = this.state.order;
      const startDateTimeObject = new Date(startDateTime);
      const date = startDateTimeObject.getFullYear() + "-" + ("0"+(startDateTimeObject.getMonth() + 1)).slice(-2) + "-" + ("0"+startDateTimeObject.getDate()).slice(-2)
      const time = ("0"+startDateTimeObject.getHours()).slice(-2) + ":" + ("0"+startDateTimeObject.getMinutes()).slice(-2);

      let count_share_seat = 0;
      let isJoinUser = false;
      if (joinUsers_){
        joinUsers_.map((val,key)=>{
          if ((val.isPrevious == false || !val.isPrevious) && val.status == 'JOIN'){
            if (token == val.user){
              isJoinUser = true;
            }
            count_share_seat++;
          }
        })
      }
      // let share_seat_index = 1;

      return (
        <View style={{flex:1}}>
          <ScrollView style={{flex:1}}>

            {/* Departure */}
            <View style={{flexDirection:'row', borderColor:'#DCDCDC',borderBottomWidth: 1,}}>
              <View style={{flex:1, padding:10}}>
                <Text>Departure</Text>
              </View>
              <View style={{flex:3, paddingTop:20, paddingBottom:10, alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize: 18}}>{departure}</Text>
              </View>
            </View>

            {/* Destination */}
            <View style={{flexDirection:'row', borderColor:'#DCDCDC',borderBottomWidth: 1,}}>
              <View style={{flex:1, padding:10}}>
                <Text>Destination</Text>
              </View>
              <View style={{flex:3, paddingTop:20, paddingBottom:10, alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize: 18}}>{destination}</Text>
              </View>
            </View>

            {/* Price */}
            { (price != null && price != "") ? <View style={{flexDirection:'row', borderColor:'#DCDCDC',borderBottomWidth: 1,}}>
              <View style={{flex:1, padding:10}}>
                <Text>Price</Text>
              </View>
              <View style={{flex:3, paddingTop:20, paddingBottom:10, alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize: 18}}>${price}</Text>
              </View>
            </View>
            : null }

            {/* Payment Method & Status */}
            { (paymentMethod != null && paymentMethod != "") ? <View style={{flexDirection:'row', borderColor:'#DCDCDC',borderBottomWidth: 1,}}>
              <View style={{padding:10}}>
                <Text>Payment</Text>
              </View>
              <View style={{flex:3, paddingTop:10, paddingBottom:10, alignItems:'center', justifyContent:'center'}}>
                { (paymentMethod=='CASH')?
                  <Image style={{height:40,width:40}} source={require('../images/cash.png')} />
                  :
                  (paymentMethod=='PAYPAL')?
                  <Image style={{height:80,width:80}} source={require('../images/paypal.png')} />
                  :null
                }
              </View>

              { (paymentStatus != null && paymentStatus != "" && paymentMethod != 'CASH') ?
                <View style={{flex:3, paddingTop:20, paddingBottom:10, alignItems:'center', justifyContent:'center'}}>
                  <Text style={{fontSize: 18}}>{paymentStatus}</Text>
                </View>
              : null }

            </View>
            : null }

            {/* Status */}
            <View style={{flexDirection:'row', borderColor:'#DCDCDC',borderBottomWidth: 1,}}>
              <View style={{flex:1, padding:10}}>
                <Text>Status</Text>
              </View>
              <View style={{flex:3, paddingTop:20, paddingBottom:10, alignItems:'center', justifyContent:'center'}}>
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
            </View>

            {/* Date Time */}
            <View style={{flexDirection:'row', borderColor:'#DCDCDC',borderBottomWidth: 1,}}>
              <View style={{flex:1, padding:10}}>
                  <Image style={{width: 40, height:40,margin:5,}} source={require('../images/calendar.png')} />
              </View>
              <View style={{flex:3, paddingTop:20, paddingBottom:10, alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize: 18}}>{date}</Text>
              </View>
              <View style={{flex:1, padding:10}}>
                <Image style={{width: 40, height:40,margin:5,}} source={require('../images/clock.png')} />
              </View>
              <View style={{flex:3, paddingTop:20, paddingBottom:10, alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize: 18}}>{time}</Text>
              </View>
            </View>

            {/* Contact Person */}
            <View style={{flexDirection:'row', borderColor:'#DCDCDC',borderBottomWidth: 1,}}>
              <View style={{flex:1, padding:10}}>
                <Image style={{width: 40, height:40,margin:5,}} source={require('../images/contact_person.png')} />
              </View>
              <View style={{flex:3, paddingTop:20, paddingBottom:10, alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize: 18}}>{contactPerson}</Text>
              </View>
              <View style={{flex:1, padding:10}}>
                <Image style={{width: 40, height:40,margin:5,}} source={require('../images/contact_no.png')} />
              </View>
              <View style={{flex:3, paddingTop:20, paddingBottom:10,alignItems:'center', justifyContent:'center'}}>
                <TouchableOpacity onPress={(e)=>this.callContactNo(contactContactNo)} >
                  <Text style={{fontSize: 18}}>{contactContactNo}</Text>
                </TouchableOpacity>
              </View>
            </View>

            { (driver) ?  <View style={{flexDirection:'row', borderColor:'#DCDCDC',borderBottomWidth: 1,}}>
                <View style={{flex:1, padding:10}}>
                  <Image style={{width: 40, height:40,margin:5,}} source={require('../images/taxi-driver.png')} />
                </View>
                <View style={{flex:3, paddingTop:20, paddingBottom:10,alignItems:'center', justifyContent:'center'}}>
                  <Text style={{fontSize: 18}}>{driver_.lastname} </Text>
                </View>
                <View style={{flex:1, padding:10}}>
                  <Image style={{width: 40, height:40,margin:5,}} source={require('../images/contact_no.png')} />
                </View>
                <View onPress={(e)=>{this.callContactNo(driver_.mobile)} } style={{flex:3, paddingTop:20, paddingBottom:10,alignItems:'center', justifyContent:'center'}}>
                  <TouchableOpacity onPress={(e)=>this.callContactNo(driver_.mobile)} >
                    <Text style={{fontSize: 18}}>{driver_.mobile}</Text>
                  </TouchableOpacity>
                </View>
              </View> : null }

            <View style={{flexDirection:'row', borderColor:'#DCDCDC',borderBottomWidth: 1,}}>
              <View style={{flex:1, padding:10}}>
                <Image style={{width: 36, height:36,margin:5,}} source={require('../images/setting.png')} />
              </View>
              <View style={{flex:3, paddingTop:20, paddingBottom:10, alignItems:'center', justifyContent:'center'}}>
                { (isFiveSeat)?
                  <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <Image style={{height:30,width:30}} source={require('../images/tick.png')} />
                    <Text style={{padding: 10,fontSize: 18}}>Five Seat</Text>
                  </View>
               : null }

               { (isShare)?
                 <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                   <Image style={{height:30,width:30}} source={require('../images/tick.png')} />
                   <Text style={{padding: 10,fontSize: 18}}>Share</Text>
                 </View>
               : null }
              </View>

            </View>

            { (isShare) ?
              <View style={{flexDirection: 'row'}}>
                <View style={{flex:1}}>
                  <View style={{borderWidth:2,borderColor:'#d9d9d9',alignItems:'center',justifyContent:'center',backgroundColor:'#3385ff',padding:10,}}>
                    <Text style={{fontSize:18,fontWeight: 'bold',color:'#fff'}}>( {count_share_seat} / {shareSeat} ) Share Seat</Text>
                  </View>
                  {joinUsers_ && joinUsers_.map((val,key)=>{
                    if ((val.isPrevious == false || !val.isPrevious) && val.status == 'JOIN'){
                    const joinDateTimeObject = new Date(val.joinDateTime);
                    const joinDate = joinDateTimeObject.getFullYear() + "-" + ("0"+(joinDateTimeObject.getMonth() + 1)).slice(-2) + "-" + ("0"+joinDateTimeObject.getDate()).slice(-2)
                    const joinTime = ("0"+joinDateTimeObject.getHours()).slice(-2) + ":" + ("0"+joinDateTimeObject.getMinutes()).slice(-2);

                      return (
                        <View key={key} style={{flexDirection:'row', padding:10,}}>
                          {/*<View>
                            <Text style={{fontSize:18}}>{share_seat_index++}.</Text>
                          </View>
                          */}
                          <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontSize:18}}>{val.user_.lastname}</Text>
                          </View>
                          <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontSize:16}}>{joinDate} {joinTime}</Text>
                          </View>

                          { (val.paymentMethod != null && val.paymentMethod != "") ?
                            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                              { (val.paymentMethod=='CASH')?
                                <Image style={{height:40,width:40}} source={require('../images/cash.png')} />
                                :
                                (val.paymentMethod=='PAYPAL')?
                                <Image style={{height:80,width:80}} source={require('../images/paypal.png')} />
                                :null
                              }
                            </View>
                          : null }
                          { (val.paymentMethod != null && val.paymentStatus != null && val.paymentMethod != "" && val.paymentMethod != "CASH" && val.paymentStatus != "") ?
                            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                              <Text style={{fontSize: 16}}>{val.paymentStatus}</Text>
                            </View>
                          : null }

                        </View>
                      )
                    }
                  })}
                </View>
              </View>
            : null }
          </ScrollView>

          {/*accept button*/}
          { (type =="driver" && status == "PENDING")?
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={{flex:1}} onPress={(e)=>{this.onClickAcceptOrder(e);}}>
              <View style={[styles.normalButtonView, {backgroundColor:'#008000', flexDirection:'row',justifyContent:'center',alignItems:'center'}]}>
                <Text style={styles.normalButton}>Accept Order</Text>
              </View>
            </TouchableOpacity>
          </View>
          : null}

          {/*change to transition button*/}
          { (type =="driver" && status == "PICKED")?
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={{flex:1}} onPress={(e)=>{this.onClickChangeTransitionStatus(e);}}>
              <View style={[styles.normalButtonView, {backgroundColor:'#008000', flexDirection:'row',justifyContent:'center',alignItems:'center'}]}>
                <Text style={styles.normalButton}>Drive to Destination</Text>
              </View>
            </TouchableOpacity>
          </View>
          : null}

          {/*change to Arrival button*/}
          { (type =="driver" && status == "TRANSITING")?
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={{flex:1}} onPress={(e)=>{this.state.popupPriceDialog.show();}}>
              <View style={[styles.normalButtonView, {backgroundColor:'#008000', flexDirection:'row',justifyContent:'center',alignItems:'center'}]}>
                <Text style={styles.normalButton}>Arrival & Ready Receive Payment</Text>
              </View>
            </TouchableOpacity>
          </View>
          : null}

          {/*change to completed button*/}
          { (type =="driver" && status == "ARRIVAL")?
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={{flex:1}} onPress={(e)=>{this.state.popupCompleteDialog.show();}}>
              <View style={[styles.normalButtonView, {backgroundColor:'#008000', flexDirection:'row',justifyContent:'center',alignItems:'center'}]}>
                <Text style={styles.normalButton}>Received Payment & Complete Order</Text>
              </View>
            </TouchableOpacity>
          </View>
          : null}

          {/*change to payment button for passenger*/}
          { (type !="driver" && status == "ARRIVAL" && (token == user|| isJoinUser))?
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={{flex:1}} onPress={(e)=>{this.onClickPaypalButton()}}>
              <View style={[styles.normalButtonView, {backgroundColor:'#008000', flexDirection:'row',justifyContent:'center',alignItems:'center'}]}>
                <Image style={{height:50,width:50}} source={require('../images/paypal.png')} />
                <Text style={styles.normalButton}> Paypal</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1}} onPress={(e)=>{this.onClickCashButton()}}>
              <View style={[styles.normalButtonView, {backgroundColor:'#008000', flexDirection:'row',justifyContent:'center',alignItems:'center'}]}>
                <Image style={{height:40,width:40}} source={require('../images/cash.png')} />
                <Text style={styles.normalButton}> Pay Cash</Text>
              </View>
            </TouchableOpacity>
          </View>
          : null}

          {/*join and leave*/}
          { (type != "driver" && (status == 'PENDING' || status == 'PICKED') && token != user && isShare) ?

          <View style={{flexDirection:'row'}}>
            { (!isJoinUser) ?
              <TouchableOpacity style={{flex:1}} onPress={(e)=>{this.onClickJoinButton(e);}}>
                <View style={[styles.normalButtonView, {backgroundColor:'#008000', flexDirection:'row',justifyContent:'center',alignItems:'center'}]}>
                  <Text style={styles.normalButton}>Join</Text>
                </View>
              </TouchableOpacity>
            : null }

            { (status == 'PENDING' && isJoinUser) ?
              <TouchableOpacity style={{flex:1}} onPress={(e)=>{this.onClickLeaveButton(e);} }>
                <View style={[styles.normalButtonView, {flexDirection:'row',justifyContent:'center',alignItems:'center'}]}>
                  <Text style={styles.normalButton}>Leave</Text>
                </View>
              </TouchableOpacity>
            : null}
          </View>
          : null }

          {/* Edit & Cancel*/}
          { (type != "driver" && status == 'PENDING' && token == user) ?
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={{flex:1.5}} onPress={(e)=>{this.onClickEditButton(e);}}>
              <View style={[styles.normalButtonView, {backgroundColor:'#008000', flexDirection:'row',justifyContent:'center',alignItems:'center'}]}>
                <Text style={styles.normalButton}>Edit</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1}} onPress={(e)=>{this.onClickCancelButton(e);} }>
              <View style={[styles.normalButtonView, {flexDirection:'row',justifyContent:'center',alignItems:'center'}]}>
                <Text style={styles.normalButton}>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
          : null }

          {/* Cancel Dialog */}
          <PopupDialog dialogStyle={styles.popupDialogContainer}  dialogTitle={<DialogTitle title="Hey!" />} ref={(popupDialog) => { this.state.popupDialog = popupDialog; }}>
            <View style={styles.popupDialogSubContainer}>
              <Text style={styles.normalText}>Do you confirm to cancel？</Text>
              <View style={{marginTop: 10, alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                <TouchableOpacity onPress={(e)=>{this.clickCancelDialogCancel(e)}}>
                  <Text style={[styles.smallText, {padding:10}]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={(e)=>{this.clickCancelDialogSubmit(e)}} style={{borderWidth: 1, borderRadius: 2,borderColor: '#D8D8D8',}}>
                  <View style={styles.normalButtonView}>
                  <Text style={styles.normalButton}>Submit</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </PopupDialog>

          {/* Leave Dialog */}
          <PopupDialog dialogStyle={styles.popupDialogContainer}  dialogTitle={<DialogTitle title="Hey!" />} ref={(popupDialog) => { this.state.popupLeaveDialog = popupDialog; }}>
            <View style={styles.popupDialogSubContainer}>
              <Text style={styles.normalText}>Do you confirm to leave？</Text>
              <View style={{marginTop: 10, alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                <TouchableOpacity onPress={(e)=>{this.clickLeaveDialogCancel(e)}}>
                  <Text style={[styles.smallText, {padding:10}]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={(e)=>{this.clickLeaveDialogSubmit(e)}} style={{borderWidth: 1, borderRadius: 2,borderColor: '#D8D8D8',}}>
                  <View style={styles.normalButtonView}>
                  <Text style={styles.normalButton}>Submit</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </PopupDialog>

          {/* Leave Dialog */}
          <PopupDialog dialogStyle={styles.popupDialogContainer}  dialogTitle={<DialogTitle title="Hey!" />} ref={(popupDialog) => { this.state.popupCompleteDialog = popupDialog; }}>
            <View style={styles.popupDialogSubContainer}>
              <Text style={styles.normalText}>Do you confirm to complete order？</Text>
              <View style={{marginTop: 10, alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                <TouchableOpacity onPress={(e)=>{this.clickCompleteDialogCancel(e)}}>
                  <Text style={[styles.smallText, {padding:10}]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={(e)=>{this.clickCompleteDialogSubmit(e)}} style={{borderWidth: 1, borderRadius: 2,borderColor: '#D8D8D8',}}>
                  <View style={styles.normalButtonView}>
                  <Text style={styles.normalButton}>Complete</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </PopupDialog>

          {/* Price Dialog */}
          <PopupDialog dialogStyle={styles.popupDialogContainer}  dialogTitle={<DialogTitle title="Hey!" />} ref={(popupDialog) => { this.state.popupPriceDialog = popupDialog; }}>
            <View style={styles.popupDialogSubContainer}>
              <Text style={styles.normalText}>Please enter price.</Text>
              <View style={styles.normalInputView}>
                <TextInput style={styles.normalInputText}  value={this.state.price} onChangeText={(text)=>{ this.chgPrice(text); }} />
              </View>
              <View style={{marginTop: 10, alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                <TouchableOpacity onPress={(e)=>{this.state.popupPriceDialog.dismiss()}}>
                  <Text style={[styles.smallText, {padding:10}]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={(e)=>{ if(this.state.price != "") { this.state.popupPriceDialog.dismiss(); this.onClickChangeArrivalStatus(); } }} style={{borderWidth: 1, borderRadius: 2,borderColor: '#D8D8D8',}}>
                  <View style={styles.normalButtonView}>
                  <Text style={styles.normalButton}>Submit</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </PopupDialog>

        </View>);
      } else {
        return (
          <View></View>
        )
      }
  }
}

const mapStateToProps = (state) => {
  return {
    ...state
  }
};

const mapActionToProps = (dispatch) => {
  return {
    onAcceptOrder: (token, order_id, user_id) => {dispatch({type:WS.ACCEPT_ORDER,"token":token,"order_id":order_id,"user_id":user_id}) },
    onAcceptOrderCompleted: () => {dispatch({type:WS.ACCEPT_ORDER_RESPONSE_COMPLETED}) },
    onUpdateOpenedOrderCompleted: () => {dispatch({type:ORDER.UPDATE_OPENED_ORDER_COMPLETED}) },
    onCancelOrder: (token, order_id) => {dispatch({type:WS.CANCEL_ORDER,"token":token,"order_id":order_id}) },
    onCancelOrderCompleted: () => {dispatch({type:WS.CANCEL_ORDER_RESPONSE_COMPLETED}) },
    onJoinOrder: (token, order_id) => {dispatch({type:WS.JOIN_ORDER,"token":token,"order_id":order_id}) },
    onJoinOrderCompleted: () => {dispatch({type:WS.JOIN_ORDER_RESPONSE_COMPLETED}) },
    onLeaveJoinOrder: (token, order_id) => {dispatch({type:WS.LEAVE_JOIN_ORDER,"token":token,"order_id":order_id}) },
    onLeaveJoinOrderCompleted: () => {dispatch({type:WS.LEAVE_JOIN_ORDER_RESPONSE_COMPLETED}) },
    onCompleteOrder: (token, order_id) => {dispatch({type:WS.COMPLETE_ORDER,"token":token,"order_id":order_id}) },
    onCompleteOrderCompleted: () => {dispatch({type:WS.COMPLETE_ORDER_RESPONSE_COMPLETED}) },

    onChangeTransitionStatus: (token, order_id) => {dispatch({type:WS.CHANGE_TRANSITION_STATUS,"token":token,"order_id":order_id}) },
    onChangeTransitionStatusCompleted: () => {dispatch({type:WS.CHANGE_TRANSITION_STATUS_RESPONSE_COMPLETED}) },
    onChangeArrivalStatus: (token, order_id, price) => {dispatch({type:WS.CHANGE_ARRIVAL_STATUS,"token":token,"order_id":order_id, "price": price}) },
    onChangeArrivalStatusCompleted: () => {dispatch({type:WS.CHANGE_ARRIVAL_STATUS_RESPONSE_COMPLETED}) },
    onSetPaymentMethod: (token, order_id, payment_method) => {dispatch({type:WS.SET_PAYMENT_METHOD,"token":token,"order_id":order_id, "payment_method": payment_method}) },
    onSetPaymentMethodCompleted: () => {dispatch({type:WS.SET_PAYMENT_METHOD_RESPONSE_COMPLETED}) },

  }
}
export default connect(mapStateToProps, mapActionToProps)(OrderDetailPage);
