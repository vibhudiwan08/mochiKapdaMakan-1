import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DashBoardScreen from '../Screens/DashBoard'
import SpScreen from "../Screens/SpScreen";

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="DashBoard" component={DashBoardScreen}/>
            <Stack.Screen name="SpScreen" component={SpScreen} />
        </Stack.Navigator>
    );
};

export default StackNavigator;
