import React, {Component} from 'react';
import {View, Text, Image, Button, TextInput,TouchableOpacity, Alert, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import styles from '../styles/app';
import DatePicker from 'react-native-datepicker'
import CheckBox from 'react-native-checkbox-heaven';
import * as pageActions from '../actions/page';
import * as orderActions from '../actions/order';
import Snackbar from 'react-native-snackbar';
import { NavigationActions } from 'react-navigation';
import PopupDialog, { DialogTitle }  from 'react-native-popup-dialog';

import {WS, ORDER} from '../actions/types';

class EditOrderPage extends Component {

  // static navigationOptions = {
  //     tabBarLabel: 'Call Taxi',
  //     tabBarIcon: ({tinColor})=>(
  //       <Image
  //         source={require('../images/taxi.png')} style={styles.icon}
  //       />
  //   ),
  // }

  static navigationOptions = {
    title: 'Edit Order',
  };

  constructor(props){
    super(props);
    const {state} = props.navigation;
    const {params} = state;
    const {order} = params;
    //Alert.alert(order);
    this.state = {
      ...order, popupDialog: null,
    }
  }

  componentWillUpdate(nextProps, nextState){
        const {previous, place} = nextProps.pageStore;
        if (previous == 'departure'){
          this.setState({departure: place});
          this.props.onMapResultNaviBackClear();
        } else if (previous == 'destination'){
          this.setState({destination: place});
          this.props.onMapResultNaviBackClear();
        }

        const {type, response} = nextProps.wsStore;
        if (type == WS.SUBMIT_EDIT_NORMAL_ORDER_RESPONSE){
          const {result, user} = response;
          if (result) {
               this.showSnackBar("Edit Order Successfully");
               //onSignInSuccess(user);
               // navigate('Main',{});
               this.props.navigation.dispatch(NavigationActions.back({}));
             } else {
               this.showSnackBar("Edit Order Fail");
             }
           this.clickDialogCancel();
           nextProps.onSubmitEditNormalOrderCompleted();
        }
  }

  componentDidUpdate(prevProps, prevState){
  }

  componentDidMount(){
    const {ws} = this.props.wsStore;
    const {onSubmitEditNormalOrderSuccess} = this.props;
  }

  chgDeparture(text){
    this.setState({departure: text});
  }

  chgDestination(text){
    this.setState({destination: text});
  }

  chgStartDate(date){
    this.setState({startDate: date});
  }

  chgStartTime(time){
    this.setState({startTime: time});
  }

  chgContactPerson(text){
    this.setState({contactPerson: text});
  }

  chgContactNo(text){
    this.setState({contactContactNo: text});
  }

  chgIsFiveSeat(){
    this.setState({isFiveSeat: ((this.state.isFiveSeat)? false:true) });
  }

  chgIsShare(){
    this.setState({isShare: ((this.state.isShare)? false:true) });
  }

  chgShareSeat(text){
    let valInt = parseInt(text);
    let val = "";
    if (valInt >= 4){
      //this.setState({isFiveSeat: true});
      val = "4";
    } else if (valInt >= 1){
      val = valInt.toString();
    } else {
      val="";
    }

    this.setState({shareSeat: val});
  }

  setDepartureMap(){
   const {navigation} = this.props.pageStore;
   navigation.navigate('Map', {previous: 'departure'});
  }

  setDestinationMap(){
   const {navigation} = this.props.pageStore;
   navigation.navigate('Map', {previous: 'destination'});
  }

  showSnackBar(msg){
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  clickDialogSubmit(){
    if (this.verifyOrder()){

      //id for token
      //temp
      const user_id = this.props.userStore.user.id;
      const token = user_id;

      const {
        id,departure,destination,startDate,
        startTime,contactPerson,contactContactNo,
        isFiveSeat, isShare, shareSeat,
      } = this.state;

      this.props.onSubmitEditNormalOrder(token, JSON.stringify({
        id: id,
        departure: departure, destination: destination,
        startDate: startDate, startTime: startTime,
        contactPerson: contactPerson, contactContactNo: contactContactNo,
        isFiveSeat: isFiveSeat, isShare: isShare, shareSeat: shareSeat,
      }));

    } else {
      this.clickDialogCancel();
    }
  }

  clickDialogCancel(){
    this.state.popupDialog.dismiss(()=>{

    })
  }

  verifyOrder(){
    let result = false;
    const {orderId,departure,destination,startDate,startTime, contactPerson,
      contactContactNo,isFiveSeat, isShare, shareSeat} = this.state;
      if (departure == ''){
        this.showSnackBar('Empty Departure');
      } else if (destination == ''){
        this.showSnackBar('Please input Destination');
      } else if (startDate == '' || startDate == null){
        this.showSnackBar('Please Select Date');
      } else if (startTime == '' || startTime == null){
        this.showSnackBar('Please Select Date');
      } else if (contactPerson == ''){
        this.showSnackBar('Please input Contact Person');
      } else if (contactContactNo == ''){
        this.showSnackBar('Please input Contact No');
      } else {
        result = true
      }
      return result;
  }

  clickSubmitEditOrder(){
    if (this.verifyOrder()){
      this.state.popupDialog.show(() => {
      });
    }
  }

  render(){
    return (
      <View style={styles.center_container}>
        <View style={styles.div_container}>
          <View style={styles.normalInputView} >
            <Text style={styles.normalInputLabel}>Departure</Text>
            <TextInput style={styles.normalInputText}  value={this.state.departure} onChangeText={(text)=>{this.chgDeparture(text)}} />
            <TouchableOpacity  onPress={(e)=>{this.setDepartureMap(e)}} >
              <Image style={styles.normalInputIcon} source={require('../images/map.png')} />
            </TouchableOpacity>
          </View>
          <View style={styles.normalInputView} >
            <Text style={styles.normalInputLabel}>Destination</Text>
            <TextInput style={styles.normalInputText}  value={this.state.destination}  onChangeText={(text)=>{this.chgDestination(text)}} />
            <TouchableOpacity  onPress={(e)=>{this.setDestinationMap(e)}}>
              <Image style={styles.normalInputIcon} source={require('../images/map.png')} />
            </TouchableOpacity>
          </View>
          <View style={styles.normalInputView} >
            <DatePicker
        style={{flex: 1}} date={this.state.startDate}
        mode="date" placeholder="Select Date"
        // format="YYYY-MM-DD" minDate="2017-01-01"
        confirmBtnText="Confirm" cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute', left: 0,top: 4,marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={(date) => {this.chgStartDate(date)}}
      />

      </View>

          <View style={styles.normalInputView} >
            <DatePicker
              style={{flex: 1}} date={this.state.startTime}
              mode="time" placeholder="Select Time"
              // format="YYYY-MM-DD" minDate="2017-01-01"
              confirmBtnText="Confirm" cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute', left: 0, top: 4, marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(time) => {this.chgStartTime(time)}}
            />
          </View>

          <View style={styles.normalInputView} >
            <Image  style={styles.largeInputIcon} source={require('../images/contact_person.png')} />
            <TextInput style={styles.smallInputText} value={this.state.contactPerson} onChangeText={(text)=>{this.chgContactPerson(text)}} />
            <Image  style={styles.largeInputIcon} source={require('../images/contact_no.png')} />
            <TextInput style={styles.smallInputText}  keyboardType={'phone-pad'} value={this.state.contactContactNo} onChangeText={(text)=>{this.chgContactNo(text)}} />
          </View>

          <View style={styles.normalInputView} >
            <Image  style={styles.largeInputIcon} source={require('../images/setting.png')} />
            <View style={{flex:1, alignItems:'center',justifyContent:'center', flexDirection:'row'}}>
              <CheckBox checked={this.state.isFiveSeat} onChange={(val)=>{this.chgIsFiveSeat()}} />
              <Text style={styles.checkBoxLabel}>Five Seat</Text>
              <CheckBox style={styles.checkBox} checked={this.state.isShare} onChange={(val)=>{this.chgIsShare()}} />
              <Text style={styles.checkBoxLabel}>Share Car</Text>
            </View>
          </View>

          { (this.state.isShare)?
          <View style={styles.normalInputView} >
            <Image  style={styles.largeInputIcon} source={require('../images/share3.png')} />
            <View style={{flex:1, alignItems:'center',justifyContent:'center', flexDirection:'row'}}>
            <Text >Share </Text>
            <TextInput style={styles.normalInputText}  keyboardType={'numeric'}  value={this.state.shareSeat} onChangeText={(text)=>{this.chgShareSeat(text)}} />
            <Text >Seat </Text>
            </View>
          </View>
          : null
          }

            <TouchableOpacity style={styles.normalButtonView} onPress={(e)=>this.clickSubmitEditOrder(e)}>
              <Text style={styles.normalButton}>Submit</Text>
            </TouchableOpacity>
          </View>

          <PopupDialog dialogStyle={styles.popupDialogContainer}  dialogTitle={<DialogTitle title="Hey!" />} ref={(popupDialog) => { this.state.popupDialog = popupDialog; }}>
            <View style={styles.popupDialogSubContainer}>
              <Text style={styles.normalText}>Do you confirm to submit？</Text>
              <View style={{marginTop: 10, alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                <TouchableOpacity onPress={(e)=>{this.clickDialogCancel(e)}}>
                  <Text style={[styles.smallText, {padding:10}]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={(e)=>{this.clickDialogSubmit(e)}} style={{borderWidth: 1, borderRadius: 2,borderColor: '#D8D8D8',}}>
                  <View style={styles.normalButtonView}>
                  <Text style={styles.normalButton}>Submit</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </PopupDialog>

        </View>
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
    onMapResultNaviBackClear: () => {dispatch(pageActions.mapResultNaviBackClear());},
    onSubmitEditNormalOrder: (token,orderState) => {dispatch(orderActions.submitEditNormalOrder(token, orderState));},
    onSubmitEditNormalOrderSuccess: () => {dispatch(orderActions.submitEditNormalOrderSuccess());},
    onSubmitEditNormalOrderCompleted: () => {dispatch({type:WS.SUBMIT_EDIT_NORMAL_ORDER_RESPONSE_COMPLETED})},
  }
}
export default connect(mapStateToProps, mapActionToProps)(EditOrderPage);
