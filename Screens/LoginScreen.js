import React, { Component } from "react";
import { StyleSheet, View, Button,Platform,SafeAreaView,Image,Text,StatusBar,TouchableOpacity,TextInput, Alert } from "react-native";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";
import {RFValue} from 'react-native-responsive-fontsize'
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import DropDownPicker from 'react-native-dropdown-picker'


export default class LoginScreen extends Component {
  
  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = googleUser => {   
    var unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
      unsubscribe();
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        firebase
          .auth()
          .signInWithCredential(credential)
          .then(function (result) {
            if (result.additionalUserInfo.isNewUser) {
              firebase
                .database()
                .ref("/users/" + result.user.uid)
                .set({
                  gmail: result.user.email,
                  profile_picture: result.additionalUserInfo.profile.picture,
                  locale: result.additionalUserInfo.profile.locale,
                  first_name: result.additionalUserInfo.profile.given_name,
                  last_name: result.additionalUserInfo.profile.family_name,
                })
                .then(function (snapshot) { });
            }
          })
          .catch(error => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
          });
      } else {
        console.log("User already signed-in Firebase.");
      }
    });
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        behaviour: "web",
        androidClientId:
          "228013069316-1hp43ukjjie79dsdojdkfon45sfa6phb.apps.googleusercontent.com",
        iosClientId:
          "228013069316-bqnidncs79rmb7ts30v6knvotjnm4vmt.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });

      if (result.type === "success") {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log(e.message);
      return { error: true };
    }
  };

  constructor(){
    super();
    this.state={
      name:'',
      gmail:'',
      option:'Customer',
      dropdownHeight: 40
    }
  }

 async addUser() {
    if (
      this.state.option 
    ) {
      let userData = {
        option:this.state.option
      };
      await firebase
        .database()
        .ref(
          "/users/" +
            Math.random()
              .toString(36)
              .slice(2)
        )
        .set(userData)
        .then(function(snapshot) {});
      this.props.setUpdateToTrue();
      this.props.navigation.navigate("Profile");
    } else {
      Alert.alert(
        "Error",
        "All fields are required!",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
  }

async addUserandSignIn(){
  this.addUser();
  this.signInWithGoogleAsync();
}

  render() {
     return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
           <View style= {styles.appTextContainer}>
            <Text style={styles.appNameText}>MochiKapdaAurDukan</Text>
           </View>
           <View style={styles.textInputs}>
            <TextInput placeholder="Enter Your Name"
                       style={styles.textInput1}  >
            </TextInput>
          </View>
           <View style={{ height: RFValue(this.state.dropdownHeight) }}>
                <DropDownPicker
                  items={[
                    { label: "Customer", value: "Customer" },
                    { label: "Mochi", value: "Mochi" },
                    { label: "Tailor", value: "Tailor" },
                    { label: "Plumber", value: "Plumber" },
                  ]}
                  defaultValue={this.state.option}
                  containerStyle={{
                    height: 40,
                    borderRadius: RFValue(20),
                    marginBottom: RFValue(20),
                    marginHorizontal: RFValue(10)
                  }}
                  onOpen={() => {
                    this.setState({ dropdownHeight: 70 });
                  }}
                  onClose={() => {
                    this.setState({ dropdownHeight: 20 });
                  }}
                  style={{ backgroundColor: "black" }}
                  itemStyle={{
                    justifyContent: "flex-start"
                  }}
                  dropDownStyle={{
                    backgroundColor:"black"
                  }}
                  labelStyle={
                   styles.dropdownLabelLight
                  }
                  arrowStyle={
                    styles.dropdownLabelLight
                  }
                  onChangeItem={item =>
                    this.setState({
                      option: item.value
                    })
                  }
                />
              </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.addUserandSignIn()}
            >    
              <Text style={styles.text}>Sign in with Google</Text>
            </TouchableOpacity>
          </View>        
        </View>
     )
}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "darkblue"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    width: RFValue(250),
    height: RFValue(50),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: RFValue(30),
    backgroundColor: "white",
    marginTop:200,
  },
  text:{
    fontFamily:'algerian',
    fontSize:16,
    color:'grey',
  },
  appNameText:{
    fontSize:25,
    color:'white',
  },
  appTextContainer:{
    justifyContent: "center",
    alignItems: "center"
  },
  textInputs:{
    justifyContent:'center',
    alignItems:'center',
  },
  textInput1:{
    borderWidth:3,
    alignContent:'center',
    margin:20,
    padding:5,
    color:'black',
    backgroundColor:'white',
  },
  textInput2:{
    borderWidth:3,
    alignContent:'center',
    margin:20,
    padding:5,
    color:'black',
    backgroundColor:'white',
  },
  textInput3:{
    borderWidth:3,
    alignContent:'center',
    margin:20,
    padding:5,
    color:'black',
    backgroundColor:'white',
  },
  dropdownLabelLight: {
    color: "white",
    fontFamily: "Bubblegum-Sans"
  },
});