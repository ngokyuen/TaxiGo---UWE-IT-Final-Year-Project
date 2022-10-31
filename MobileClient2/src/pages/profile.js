import React, {Component} from 'react';
import {View, Text, Image, Button, TextInput,TouchableOpacity, Alert,ScrollView} from 'react-native';
import {connect} from 'react-redux';
import styles from '../styles/app';
import CheckBox from 'react-native-checkbox-heaven';
import Snackbar from 'react-native-snackbar';
import PopupDialog, { DialogTitle }  from 'react-native-popup-dialog';
import * as userActions from '../actions/user';
import {WS, ORDER} from '../actions/types';
import DatePicker from 'react-native-datepicker'

var self;

class ProfilePage extends Component {

  static navigationOptions = ({navigation}) => ({
      title: 'Your Profile',
      headerRight:(
      <TouchableOpacity onPress={()=>{self.submit()}} style={{paddingRight:16,}}>
        <Image
          source={require('../images/save.png')} style={styles.icon}/>
      </TouchableOpacity>
    )
  });

  constructor(props){
    super(props);
    self=this;

    const {user} = this.props.userStore;
    const {id, firstname, lastname, email, mobile,
    address, birthday} = user;
    //Alert.alert(id);

    this.state = {
      "token": id,
      "firstname": firstname, "lastname": lastname, "email": email,
      "address": address, "birthday": birthday,
      "password": "", "new_password": "", "retype_password":"", "mobile":mobile
    }

  }

  componentWillUpdate(nextProps, nextState){

    const {type, response} = nextProps.wsStore;

    if (type == WS.UPDATE_USER_PROFILE){
      const {result} = response;
      if (result) {
          this.showSnackBar("Update User Profile Success");
         } else {
           this.showSnackBar("Update User Profile Fail");
         }
       nextProps.onUpdateUserProfileCompleted();
    }

  }

  componentDidUpdate(prevProps, prevState){
  }

  componentDidMount(){

  }

  chgBirthday(date){
    this.setState({birthday: date})
  }

  submit(){
    const {token, firstname, lastname, email, mobile, password, new_password, retype_password, address, birthday} = this.state;

    let verification = false;
    if (password !="" || new_password !="" || retype_password !=""){

      if (password == new_password){
        this.showSnackBar("New Password should not same as Retype Password");
      } else if (new_password != retype_password){
        this.showSnackBar("Retype Password is not same as New Password");
      } else if (password == "" || new_password == "" || retype_password == ""){
        this.showSnackBar("Password is empty");
      } else {
        verification = true;
      }
    } else {
      verification = true;
    }

    if (verification){
      const profileObj = {
        "firstname": firstname, "lastname": lastname, "email": email, "mobile": mobile,
        "address": address, "birthday": birthday, "new_password": new_password, "password": password,
      }

      //Alert.alert(profileObj);
      this.props.onUpdateUserProfile(token,profileObj);
    }

  }

  showSnackBar(msg){
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  render(){

    return (
      <View style={styles.center_container}>
            <View style={styles.div_container}>

            <View style={styles.normalInputView} >
              <Text style={styles.normalInputLabel}>First Name</Text>
              <TextInput style={styles.normalInputText}  value={this.state.firstname} onChangeText={(text)=>{this.setState({"firstname":text})}} />
            </View>

              <View style={styles.normalInputView} >
                <Text style={styles.normalInputLabel}>Last Name</Text>
                <TextInput style={styles.normalInputText}  value={this.state.lastname} onChangeText={(text)=>{this.setState({"lastname":text})}} />
              </View>

              <View style={styles.normalInputView} >
                <Text style={styles.normalInputLabel}>E-Mail</Text>
                <TextInput style={styles.normalInputText}  value={this.state.email} onChangeText={(text)=>{this.setState({"email":text})}} />
              </View>

              <View style={styles.normalInputView} >
                <Text style={styles.normalInputLabel}>Mobile</Text>
                <TextInput style={styles.normalInputText}  value={this.state.mobile} onChangeText={(text)=>{this.setState({"mobile":text})}} />
              </View>

              <View style={styles.normalInputView} >
                <Text style={styles.normalInputLabel}>Address</Text>
                <TextInput style={styles.normalInputText}  value={this.state.address} onChangeText={(text)=>{this.setState({"address":text})}} />
              </View>

              <View style={styles.normalInputView} >
                <Text style={styles.normalInputLabel}>Birthday</Text>
                <DatePicker
                  style={{flex: 1}} date={this.state.birthday}
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
                  onDateChange={(date) => {this.chgBirthday(date)}}
                />
              </View>

              <View style={styles.normalInputView} >
                <Text style={styles.normalInputLabel}>Old Password</Text>
                <TextInput style={styles.normalInputText} secureTextEntry={true}  value={this.state.password} onChangeText={(text)=>{this.setState({"password":text})}} />
              </View>

              <View style={styles.normalInputView} >
                <Text style={styles.normalInputLabel}>New Password</Text>
                <TextInput style={styles.normalInputText} secureTextEntry={true}  value={this.state.new_password} onChangeText={(text)=>{this.setState({"new_password":text})}} />
              </View>

              <View style={styles.normalInputView} >
                <Text style={styles.normalInputLabel}>Retype Password</Text>
                <TextInput style={styles.normalInputText} secureTextEntry={true}  value={this.state.retype_password} onChangeText={(text)=>{this.setState({"retype_password":text})}} />
              </View>
          </View>

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
    // onMapResultNaviBackClear: () => {dispatch(pageActions.mapResultNaviBackClear());},
    // onUpdateOpenedOrder: (order) => {dispatch(orderActions.updateOpenedOrder(order));},
    //  onGetUserOrders: (token) => {dispatch(orderActions.getUserOrders(token));},
    onUpdateUserProfile: (token, profileObj) => {dispatch(userActions.updateUserProfile(token, profileObj))},
    onUpdateUserProfileCompleted: () => {dispatch({type:WS.UPDATE_USER_PROFILE_COMPLETED});},
    // onSubmitNormalOrderSuccess: () => {dispatch(orderActions.submitNormalOrderSuccess());},
  }
}
export default connect(mapStateToProps, mapActionToProps)(ProfilePage);
