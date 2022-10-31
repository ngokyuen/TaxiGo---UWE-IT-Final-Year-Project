import {
  StyleSheet, Dimensions
} from 'react-native';

let {height, width} = Dimensions.get('window');

export default styles = StyleSheet.create({

  center_container: {
    flex: 1,justifyContent: 'center',
    alignItems: 'center',flexDirection: 'row',backgroundColor: '#e6e6e6'
  },
  container: {
    flex: 1,backgroundColor: '#e6e6e6'
  },

  div_container: {
    flex: 0.90, backgroundColor: '#e6e6e6'
  },
  logo: {
    flex: 0.3, width: width*0.9,
  },
  mircoText:{
    fontSize: 6,
  },
  smallText: {
    fontSize: 14,
  },
  normalText: {
    fontSize: 20,
  },
  selectedNormalText: {
    fontSize: 22,
    color: '#FFF',
    backgroundColor: '#FE2E2E',
    padding: 10,
  },
  largeText:{
    fontSize: 28,
  },
  normalInputView: {
    height: 50,
    borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1,
    borderColor: '#D8D8D8', borderRadius: 2, backgroundColor: '#F2F2F2',
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
  },
  normalInputLabel: {
    flex:0.3, fontSize: 10, margin: 8,
  },
  normalInputText: {
    flex:0.7, fontSize: 20,
    paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10,
    color: '#585858',
  },
  smallInputText: {
    flex:0.7, fontSize: 14,
    paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10,
    color: '#585858',
  },
  normalInputIcon: {
    height: 22, width: 22,
    marginLeft: 10, marginRight: 10, marginTop: 10, marginBottom: 10,
  },
  largeInputIcon: {
    height: 30, width: 30,
    marginLeft: 10, marginRight: 10, marginTop: 10, marginBottom: 10,
  },
  normalFooterView: {
    marginTop: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  normalFooterLabel: {
    fontSize: 12,
  },
  normalButtonView: {
    borderWidth: 1, borderRadius: 2,
    padding: 10,
    height: 50,
    borderColor: '#D8D8D8', backgroundColor: '#FE2E2E',
    justifyContent: 'center', alignItems: 'center',
  },
  normalButton: {
    color: '#fff', fontSize: 18, fontWeight: 'bold',
  },
  checkBox: {
    paddingLeft: 10,
  },
  checkBoxLabel: {
    fontSize: 12, paddingLeft: 5,
  },

  icon: {
    width: 26, height: 26,
  },

  popupDialogContainer: {
    marginTop:-150, width: width * 0.85,
  },
  popupDialogSubContainer: {
    alignItems:'center',justifyContent:'center',padding:20,
  },

  pendingStatus: {
    color:'#FF6D5B',padding:5, fontSize: 18
  },
  pickedStatus: {
    color:'#1992E5',padding:5, fontSize: 18
  },
  transitingStatus: {
    color:'#1992E5',padding:5, fontSize: 18
  },
  arrivalStatus: {
    color:'#1992E5',padding:5, fontSize: 18
  },
  completedStatus: {
    color:'#55B93D',padding:5, fontSize: 18
  },
  cancelledStatus: {
    padding:5, fontSize: 18
  },



});
