import * as React from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import HomeLayout from './navigation/app.navigation';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Nunito_400Regular, Nunito_700Bold } from "@expo-google-fonts/nunito";




export default function App() {
  const [fontsLoaded] = useFonts({
      Nunito_400Regular,
      Nunito_700Bold,
    });
  
    if (!fontsLoaded) {
      return <ActivityIndicator size="large" />;
    }
  
    SplashScreen.hideAsync();
  return (
    <NavigationContainer>
        <HomeLayout />
    </NavigationContainer>


  );
}

