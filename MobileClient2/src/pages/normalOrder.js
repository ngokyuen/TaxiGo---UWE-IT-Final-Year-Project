import React, {Component} from 'react';
import {View, Text, Image, Button, TextInput,TouchableOpacity, Alert, ScrollView, Platform} from 'react-native';
import {connect} from 'react-redux';

import styles from '../styles/app';
import DatePicker from 'react-native-datepicker'
 import CheckBox from 'react-native-checkbox-heaven';
// import CheckBox from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import PopupDialog, { DialogTitle }  from 'react-native-popup-dialog';
import Voice from 'react-native-voice';

import * as pageActions from '../actions/page';
import * as orderActions from '../actions/order';
import {WS, ORDER} from '../actions/types';

class NormalOrderPage extends Component {

  static navigationOptions = {
      tabBarLabel: 'Call Taxi',
      tabBarIcon: ({tinColor})=>(
        <Image
          source={require('../images/taxi.png')} style={styles.icon}
        />
    ),
  }

  constructor(props){
    super(props);
    this.state = {
      departure: '', destination: '', startDate: new Date(), startTime: new Date(),
      contactPerson: '', contactContactNo: '',
      isFiveSeat: false, isShare: false , shareSeat: '', popupDialog: null,
      popupVoiceDialog: null, voice_results:[],
      voice_option_department: false, voice_option_destination: false,
    }

    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
  }

  stopVoice(){
    this.showSnackBar("Voice Stop");
    Voice.stop();
  }

  onSpeechStart(e){
    this.showSnackBar("Voice Start");
  }

  onSpeechEnd(e){
    this.showSnackBar("Voice End");
  }

  onSpeechRecognized(e){
    this.showSnackBar("Voice Recognized");
    //Alert.alert(e);
    this.stopVoice();
  }

  onSpeechError(e){
    this.showSnackBar("Voice Error");
    this.stopVoice();
  }

  onSpeechResults(e){
    this.setState({
      voice_results: e.value,
    });
    //Alert.alert(JSON.stringify(e.value));
    this.stopVoice();
  }

  clickVoice(voice_option){
    if (voice_option){
      this.setState({"voice_option_destination": true});
      this.setState({"voice_option_department": false});
    } else {
      this.setState({"voice_option_destination": false});
      this.setState({"voice_option_department": true});
    }

    this.setState({"voice_results": []});
    this.state.popupVoiceDialog.show();
    Voice.start();
  }

  clickVoiceDialogCancel(){
    this.stopVoice();
    this.state.popupVoiceDialog.dismiss();
  }

  clickVoiceResult(result){
    if (this.state.voice_option_department){
      this.setState({departure: result});
    } else if (this.state.voice_option_destination){
      this.setState({destination: result});
    }
    this.state.popupVoiceDialog.dismiss({});
  }

  // async clickVoice(e){
  //   try {
  //     Voice.stop();
  //     const {voice_start} = this.state;
  //     const temp_voice_start = ! voice_start;
  //     this.setState({voice_start: temp_voice_start});
  //     if (temp_voice_start){
  //       await Voice.start('en');
  //     } else {
  //       await Voice.stop();
  //     }
  //
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

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
    if (type == WS.SUBMIT_NORMAL_ORDER_RESPONSE){
      const {result, user} = response;
      if (result) {
           this.showSnackBar("Create Order Successfully");
           //onSignInSuccess(user);
           // navigate('Main',{});
         } else {
           this.showSnackBar("Create Order Fail");
         }
         this.clickDialogCancel();
       nextProps.onSubmitNormalOrderCompleted();
    }
  }

  componentDidUpdate(prevProps, prevState){
  }

  componentDidMount(){
    const {ws} = this.props.wsStore;
    const {onSubmitNormalOrderSuccess} = this.props;
  }

  chgIsFiveSeat(){
    this.setState({isFiveSeat: !this.state.isFiveSeat});
  }

  chgIsShare(){
    this.setState({isShare: !this.state.isShare});
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

      const {
        departure,destination,startDate,
        startTime,contactPerson,contactContactNo,
        isFiveSeat, isShare, shareSeat,
      } = this.state;

      //id for token
      //temp
      const {id} = this.props.userStore.user;
      const token = id

      this.props.onSubmitNormalOrder(token, JSON.stringify({
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
    this.state.popupDialog.dismiss(()=>{});
  }

  verifyOrder(){
    let result = false;
    const {departure,destination,startDate,startTime, contactPerson,
      contactContactNo, isFiveSeat, isShare, shareSeat} = this.state;
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

  clickSubmitOrder(){
    if (this.verifyOrder()){
      this.state.popupDialog.show(() => {});
    }
  }

  render(){
    const {isFiveSeat} = this.state;
    //Alert.alert(isFiveSeat.toString());
    return (
      <View style={styles.center_container} voice_option_department voice_option_destination>
        <View style={styles.div_container}>
          <View style={styles.normalInputView} >
            <Text style={styles.normalInputLabel}>Departure</Text>
            <TextInput style={styles.normalInputText}  value={this.state.departure} onChangeText={(text)=>{this.setState({"departure":text})}} />

            <TouchableOpacity onPress={(e)=>{(Platform.OS === 'ios')?this.clickVoice(0):this.showSnackBar("Still not support Android")}} >
              <Image style={styles.normalInputIcon} source={require('../images/microphone.png')} />
            </TouchableOpacity>

            <TouchableOpacity  onPress={(e)=>{(Platform.OS === 'ios')?this.setDepartureMap(e):this.showSnackBar("Still not support Android")}} >
              <Image style={styles.normalInputIcon} source={require('../images/map.png')} />
            </TouchableOpacity>
          </View>

          <View style={styles.normalInputView} >
            <Text style={styles.normalInputLabel}>Destination</Text>
            <TextInput style={styles.normalInputText}  value={this.state.destination}  onChangeText={(text)=>{this.setState({"destination":text})}} />
            <TouchableOpacity onPress={(e)=>{(Platform.OS === 'ios')?this.clickVoice(1):this.showSnackBar("Still not support Android")}} >
              <Image style={styles.normalInputIcon} source={require('../images/microphone.png')} />
            </TouchableOpacity>
            <TouchableOpacity  onPress={(e)=>{(Platform.OS === 'ios')?this.setDestinationMap(e):this.showSnackBar("Still not support Android")}}>
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
              onDateChange={(date) => {this.setState({"startDate":date})}}
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
              onDateChange={(time) => {this.setState({"startTime":time})}}
            />
          </View>

          <View style={styles.normalInputView} >
            <Image style={styles.largeInputIcon} source={require('../images/contact_person.png')} />
            <TextInput style={styles.smallInputText} onChangeText={(text)=>{this.setState({"contactPerson":text})}} />
            <Image style={styles.largeInputIcon} source={require('../images/contact_no.png')} />
            <TextInput style={styles.smallInputText} keyboardType={'phone-pad'} onChangeText={(text)=>{this.setState({"contactContactNo":text})}} />
          </View>

          <View style={styles.normalInputView} >
            <Image style={styles.largeInputIcon} source={require('../images/setting.png')} />
            <View style={{flex:1, alignItems:'center',justifyContent:'center', flexDirection:'row'}}>
              <CheckBox style={styles.checkBox} checked={isFiveSeat} onChange={(val)=>{this.chgIsFiveSeat()}} />
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

            <TouchableOpacity style={styles.normalButtonView} onPress={(e)=>this.clickSubmitOrder(e)}>
              <Text style={styles.normalButton}>Submit</Text>
            </TouchableOpacity>
          </View>

          <PopupDialog dialogStyle={styles.popupDialogContainer} dialogTitle={<DialogTitle title="Hey!" />} ref={(popupVoiceDialog) => { this.state.popupVoiceDialog = popupVoiceDialog; }}>
            <View style={styles.popupDialogSubContainer}>
              { (this.state.voice_results.length > 0) ?
                this.state.voice_results.map((result, index) => {
                  return (
                    <TouchableOpacity key={`result-${index}`} onPress={(e)=>this.clickVoiceResult(result)}>
                      <Text style={styles.normalText}>
                        {result}
                      </Text>
                    </TouchableOpacity>
                  )
                })
                :
                <Text style={styles.normalText}>Please Speak Now!</Text>
              }

              <View style={{marginTop: 10, alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                <Text style={[styles.smallText, {padding:10}]}>Type:</Text>
                <Text style={(this.state.voice_option_department)?styles.selectedNormalText:styles.normalText} onPress={(e)=>this.setState({"voice_option_destination":false, "voice_option_department":true})}>Department</Text>
                <Text>   </Text>
                <Text style={(this.state.voice_option_destination)?styles.selectedNormalText:styles.normalText} onPress={(e)=>this.setState({"voice_option_destination":true, "voice_option_department":false})}>Destination</Text>
              </View>
              <View style={{marginTop: 10, alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                <TouchableOpacity onPress={(e)=>{this.clickVoiceDialogCancel(e)}}>
                  <Text style={[styles.smallText, {padding:10}]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </PopupDialog>

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
    onSubmitNormalOrder: (token,orderState) => {dispatch(orderActions.submitNormalOrder(token, orderState));},
    onSubmitNormalOrderSuccess: () => {dispatch(orderActions.submitNormalOrderSuccess());},
    onSubmitNormalOrderCompleted: () => {dispatch({type:WS.SUBMIT_NORMAL_ORDER_RESPONSE_COMPLETED})},
  }
}
export default connect(mapStateToProps, mapActionToProps)(NormalOrderPage);
