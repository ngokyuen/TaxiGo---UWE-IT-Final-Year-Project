import React, {Component} from 'react';
import {Text, View,Alert,TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import MapView from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import * as pageActions from '../actions/page';

class MapPage extends Component {

  static navigationOptions = {
     title: 'Map',
   };

  constructor(props){
    super(props);

    this.state = {
      region: {
        latitude: 0.0,
        longitude: 0.0,
        latitudeDelta: 0.0,
        longitudeDelta: 0.0,
      },
      coordinate: null,
      geocode: null,
      // geocode : {
      //   position: {lat, lng},
      //   formattedAddress: String, // the full address
      //   feature: String | null, // ex Yosemite Park, Eiffel Tower
      //   streetNumber: String | null,
      //   streetName: String | null,
      //   postalCode: String | null,
      //   locality: String | null, // city name
      //   country: String,
      //   countryCode: String
      //   adminArea: String | null
      //   subAdminArea: String | null,
      //   subLocality: String | null
      // }
    }
  }

  componentDidMount(){
  }

  async getAddress(latitude, longitude){
    try {
      //this.state.geocode = null;
      let res = await Geocoder.geocodePosition({lat: latitude, lng: longitude});
      //const res = await Geocoder.geocodeAddress('London');
      this.state.geocode = res[0];
    } catch (err){
      console.log(err);
    }
  }

  onRegionChange(region){
    this.chgLocation(region.latitude, region.longitude, region.latitudeDelta, region.longitudeDelta);
    this.chgCenterMarker(region.latitude, region.longitude);
    this.getAddress(region.latitude, region.longitude);
  }

  chgCenterMarker(latitude, longitude){
    this.setState({coordinate: {latitude: latitude, longitude: longitude}})
  }

  chgLocation(latitude, longitude, latitudeDelta, longitudeDelta){
    if (!latitudeDelta){
      latitudeDelta = 0.05
    }
    if (!longitudeDelta){
      longitudeDelta = 0.05
    }

    this.setState({region: {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: latitudeDelta,
      longitudeDelta: longitudeDelta,
    }});
  }

  clickCurrentLocationButton(){
    navigator.geolocation.getCurrentPosition((position)=>{
      // const curr_position = JSON.stringify(position);
      const coords = position.coords;
      // Alert.alert(position);
      this.chgLocation(coords.latitude,coords.longitude);
      this.chgCenterMarker(coords.latitude,coords.longitude);
      this.getAddress(coords.latitude, coords.longitude);
    });
  }

  clickZoomInButton(){
    const {region} = this.state;
    let latitudeDelta = region.latitudeDelta * 0.75;
    let longitudeDelta = region.longitudeDelta  * 0.75;

    this.setState({region: {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: latitudeDelta,
      longitudeDelta: longitudeDelta,
    }});
  }

  clickZoomOutButton(){
    const {region} = this.state;
    let latitudeDelta = (region.latitudeDelta * 1.25 > 120)? 120: region.latitudeDelta * 1.25;
    let longitudeDelta = (region.longitudeDelta * 1.25 > 120)? 120: region.longitudeDelta * 1.25;

    this.setState({region: {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: latitudeDelta,
      longitudeDelta: longitudeDelta,
    }});
  }

  onSubmit(){
    const {onMapResultNaviBack} = this.props;
    const {navigation} = this.props;
    const {goBack, state} = navigation;
    const {params} = state;
    const {previous} = params;
    
    onMapResultNaviBack(previous, this.state.geocode.formattedAddress);
    goBack(null);
  }

  render(){

    return (
      <View style={{flex:1}}>
        <MapView style={{flex:1}} region={this.state.region} onRegionChange={(region)=>{this.onRegionChange(region)}}>
        { (this.state.coordinate != null) ? <MapView.Marker coordinate={this.state.coordinate} /> : null}
        </MapView>

        {(this.state.geocode)?
        <View style={{ position:'absolute', top:0,justifyContent: 'center',alignItems: 'center',}}>
          <Text style={{padding:5,}}>{this.state.geocode.formattedAddress}</Text>
        </View>
        : null
        }

        <View style={{position:'absolute', right:0, flexDirection:'row'}}>
          <TouchableOpacity onPress={(e)=>{this.clickZoomInButton(e)}}>
            <Text style={{fontSize: 18, padding: 10}}>+</Text>
          </TouchableOpacity>
            <TouchableOpacity onPress={(e)=>{this.clickZoomOutButton(e)}}>
            <Text style={{fontSize: 18, padding: 10}}>-</Text>
          </TouchableOpacity>
        </View>

        <View style={{position:'absolute', bottom:0}}>
          <TouchableOpacity onPress={(e)=>{this.onSubmit(e)}}>
            <Text style={{fontSize: 18, padding: 10}}>Submit</Text>
          </TouchableOpacity>
        </View>

        <View style={{position:'absolute', bottom:0, right:0}}>
          <TouchableOpacity onPress={(e)=>{this.clickCurrentLocationButton(e)}}>
            <Text style={{fontSize: 18, padding: 10}}>Current Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    ...state
  }
};

const mapActionToProps = (dispatch) => {
  return {
    onMapResultNaviBack: (previous, place) => {dispatch(pageActions.mapResultNaviBack(previous, place));},
    // onMapResultNaviBackClear: () => {dispatch(pageActions.mapResultNaviBackClear());},
  }
}

export default connect(mapStateToProps, mapActionToProps)(MapPage);
