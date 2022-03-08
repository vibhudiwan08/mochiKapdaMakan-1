import React, { Component } from "react";
import { StyleSheet, View, Button,Platform,SafeAreaView,Image,Text,StatusBar,TouchableOpacity } from "react-native";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";
import {RFValue} from 'react-native-responsive-fontsize'
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

export default class LogOut extends Component {
  componentDidMount(){
   firebase.auth().signOut()
  }
   render() {
    return (
      <View>
        <Text>Profile</Text>
      </View>
    );
  }
}
