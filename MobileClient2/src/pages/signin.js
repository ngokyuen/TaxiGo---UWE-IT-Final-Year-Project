import React, { Component } from 'react';
import {View, Text, TextInput, Button, Image, Alert, TouchableOpacity, } from 'react-native';
import {connect} from 'react-redux';
import Snackbar from 'react-native-snackbar';
import styles from '../styles/app';
import {WS, SIGN} from '../actions/types';
import * as userActions from '../actions/user';
import IndexPage from './index';

class SignInPage extends Component {

  // static navigationOptions = {
  //   title: 'Sign Now',
  // };

  shouldComponentUpdate(nextProps, nextState){
    return true;
  }

  componentWillUpdate(nextProps, nextState){
    const {type, response} = nextProps.wsStore;
    if (type == WS.SIGN_IN_RESPONSE){
      const {result, user} = response;
      if (result) {
           this.showSnackBar("Sign in Successfully");
           nextProps.onSignInSuccess(user);
           // navigate('Main',{});
         } else {
           this.showSnackBar("Wrong Account");
         }

         nextProps.onSignInCompleted();
    } else if (type == WS.SIGN_UP_RESPONSE){
        const {result, result_message} = response;
        //return false;
        if (result) {
           this.showSnackBar("Sign up Successfully");
           nextProps.onSignUpSuccess();
           // navigate('Main',{});
         } else {
           if (result_message != undefined && result_message != ''){
             this.showSnackBar(result_message);
           } else {
             this.showSnackBar("Sign up Fail");
           }

         }
         nextProps.onSignUpCompleted();
      }
  }

  componentDidUpdate(prevProps, prevState){
  }

  componentDidMount(){
  }

  constructor(props){
    super(props);
    this.state = {
      username: "",
      password: "",
      retype_password: "",
      isSignInPage: true,
      isDriverRegister: false,
    }
  }

  submitSign(){
    let msg = '';
     const {username, password,retype_password, isDriverRegister} = this.state;
     const user_type = (isDriverRegister)?"driver":"";

    if (username == ""){
      msg = 'Empty Username';
    } else if (password == ""){
      msg = 'Empty Password';
    } else if (!this.state.isSignInPage && password != retype_password){
      msg = 'Password & Confirm Password is not the same';
    } else {

      if (this.state.isSignInPage){
        this.props.onSignIn(username, password);
        //msg = 'Sign in Successfully';
      } else {

          this.props.onSignUp(username, password, user_type);
        //msg = 'Sign up Successfully';
      }
    }

    if (msg != "") {
      this.showSnackBar(msg);
    }
  }

  showSnackBar(msg){
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  chgSign(){
    if (this.state.isSignInPage){
      this.setState({retype_password: ""});
    }
    this.setState({isSignInPage: !this.state.isSignInPage });
  }

  render(){
    return (
      <View style={styles.center_container}>

          <View style={styles.div_container}>
            <Image style={styles.logo} source={require('../images/background.jpg')} />
            <View style={styles.normalInputView} >
              <Text style={styles.normalInputLabel}>Username</Text>
              <TextInput style={styles.normalInputText} onChangeText={(text)=>this.setState({username: text})} value={this.state.username} />
            </View>
            <View style={styles.normalInputView} >
              <Text style={styles.normalInputLabel}>Password</Text>
              <TextInput secureTextEntry={true} style={styles.normalInputText} onChangeText={(text)=>this.setState({password:text})}  />
            </View>
            { (!this.state.isSignInPage) ?
            <View style={styles.normalInputView} >
              <Text style={styles.normalInputLabel}>Confirm  Password</Text>
              <TextInput secureTextEntry={true} style={styles.normalInputText} onChangeText={(text)=>this.setState({retype_password:text})}  />
            </View>
            : null }
            <TouchableOpacity style={styles.normalButtonView} onPress={(e)=>this.submitSign(e)}>
              <Text style={styles.normalButton}>Submit</Text>
            </TouchableOpacity>
            <View style={styles.normalFooterView} >
              <TouchableOpacity onPress={(e)=> this.chgSign(e)}>
                { (this.state.isSignInPage) ?
                  <Text style={styles.normalFooterLabel}>Sign Up</Text>
                :
                  <View style={{flexDirection:'row'}}>
                    <Text style={styles.normalFooterLabel}>Sign In</Text>
                    <Text style={styles.normalFooterLabel}> or </Text>
                    { (!this.state.isSignInPage && !this.state.isDriverRegister) ?
                    <TouchableOpacity onPress={(e)=> this.setState({"isDriverRegister":true})}>
                        <Text style={styles.normalFooterLabel}>You're Driver</Text>
                    </TouchableOpacity>
                    :
                      (!this.state.isSignInPage) ?
                      <TouchableOpacity onPress={(e)=> this.setState({"isDriverRegister":false})}>
                          <Text style={styles.normalFooterLabel}>You're Passenager</Text>
                      </TouchableOpacity>
                       : null
                   }
                  </View>
                }
              </TouchableOpacity>


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

const mapDispatchToProps = (dispatch) => {
  return {
    onSignIn: (username,password) => {dispatch(userActions.signIn(username, password));},
    onSignInSuccess: (userJSON) => {dispatch(userActions.signInSuccess(userJSON));},
    onSignInCompleted: () => {dispatch({type:WS.SIGN_IN_RESPONSE_COMPLETED})},
    onSignUp: (username,password, user_type) => {dispatch(userActions.signUp(username, password, user_type));},
    onSignUpSuccess: () => {dispatch(userActions.signUpSuccess());},
    onSignUpCompleted: () => {dispatch({type:WS.SIGN_UP_RESPONSE_COMPLETED})},
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInPage);
