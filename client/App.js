import { useState, useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MainTabs from "./screens/MainTabs";
import JoinOrgScreen from "./screens/JoinOrgScreen";
import { ActivityIndicator, View } from "react-native";
import * as Linking from "expo-linking";

const Stack = createNativeStackNavigator();

const prefix = Linking.createURL("/");

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#0f0f1a" }}>
        <ActivityIndicator color="#4f46e5" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="JoinOrg" component={JoinOrgScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="JoinOrg" component={JoinOrgScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const linking = {
    prefixes: [prefix, "stagecomm://"],
    config: {
      screens: {
        JoinOrg: "join",
        Login: "login",
        Register: "register",
        Main: "main",
      },
    },
  };

  return (
    <AuthProvider>
      <NavigationContainer linking={linking}>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
