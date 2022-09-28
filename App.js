
import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, View, TextInput, Button, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {API_KEY} from '@env';


export default function App() {

  let KEY = "your key here";

  if (API_KEY !== undefined) {
    // console.log("You have API_KEY from local config")
    KEY = API_KEY;
  } else {
    console.log("API_KEY is undefined. Set it in .env file or hardcode KEY variable")
  }
  
  const [latitude, setLatitude] = useState(60.201373);
  const [longitude, setLongitude] = useState(24.934041);
  const [latitudeDelta, setLatitudeDelta] = useState(0.0322)
  const [longitudeDelta, setLongitudeDelta] = useState(0.0322)
  const [searchedLocation, setSearchedLocation] = useState("")
  const [restaurantList, setRestaurantList] = useState([])

  const locateNearbyRestaurants = () => {

    const fetchRestaurants = async () => {
      let address = searchedLocation;
      let key = KEY;
      const locationResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`)
      const locationResponseJSON = await locationResponse.json();
      setLatitude(locationResponseJSON.results[0].geometry.location.lat)
      setLongitude(locationResponseJSON.results[0].geometry.location.lng)
      let lat = locationResponseJSON.results[0].geometry.location.lat;
      let lng = locationResponseJSON.results[0].geometry.location.lng;
  
      const restaurantsResponse = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=restaurant&location=${lat}%2C${lng}&radius=1000&type=restaurant&key=${key}`)
      const restaurantsResponseJSON = await restaurantsResponse.json();
      setRestaurantList(restaurantsResponseJSON.results)
    }

    fetchRestaurants()
  }




  return (
    <>
      <View style={styles.containerHeader}>
        <Text style={styles.assignmentHeaderText}>TEHT 9 RAVINTOLAHAKU</Text>
      </View>

      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={{latitude : latitude , longitude : longitude, latitudeDelta: latitudeDelta, longitudeDelta: longitudeDelta}}
        >
          {restaurantList.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{latitude: marker.geometry.location.lat, longitude: marker.geometry.location.lng}}
              title={marker.name}
            />
          ))}
        </MapView>
      
        <TextInput 
          style={styles.input} 
          onChangeText={setSearchedLocation} 
          value={searchedLocation}
        />

        <View style={{display: 'flex', flexDirection: 'row', margin: 10}}>
          <View style={{flex: 1, marginHorizontal: 5}}>
            <Button color="green" onPress={() => locateNearbyRestaurants()} title="Locate" />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  containerHeader: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: 'black',
  //   alignItems: 'center',
  // },
  container2: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  input: {
    width:"93%", 
    height:"5%",
    borderColor: 'gray', 
    borderWidth: 1,
    margin: 5,
    color:"white",
  },
  assignmentHeaderText: {
    fontSize: 40,
    color:"#6495ED",
  }
});
