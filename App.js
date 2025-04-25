import * as React from 'react';
import { Text, View, ActivityIndicator, StyleSheet, Image } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import HomeLayout from './navigation/app.navigation';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Jost_400Regular, Jost_700Bold } from '@expo-google-fonts/jost';
import Toast, { BaseToast } from 'react-native-toast-message';

export default function App() {
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_700Bold,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  SplashScreen.hideAsync();

  return (
    <NavigationContainer>
      <HomeLayout />
      <Toast config={{
        success: (props) => (
          <BaseToast
            {...props}
            style={styles.successToast}
            contentContainerStyle={styles.toastContent}
            text1Style={styles.text1}
            text2Style={styles.text2}
            renderLeadingIcon={() => (
              <Image
                source={require('./assets/images/success-icon.png')} 
                style={styles.icon}
              />
            )}
            text1NumberOfLines={2} // Cho phép 2 dòng cho text1
            text2NumberOfLines={3} // Cho phép 3 dòng cho text2
          />
        ),
        error: (props) => (
          <BaseToast
            {...props}
            style={styles.errorToast}
            contentContainerStyle={styles.toastContent}
            text1Style={styles.text1}
            text2Style={styles.text2}
            renderLeadingIcon={() => (
              <Image
                source={require('./assets/images/error-icon.png')} 
                style={styles.icon}
              />
            )}
            text1NumberOfLines={2} // Cho phép 2 dòng cho text1
            text2NumberOfLines={3} // Cho phép 3 dòng cho text2
          />
        ),
        info: (props) => (
          <BaseToast
            {...props}
            style={styles.infoToast}
            contentContainerStyle={styles.toastContent}
            text1Style={styles.text1}
            text2Style={styles.text2}
            renderLeadingIcon={() => (
              <Image
                source={require('./assets/images/info-icon.png')} 
                style={styles.icon}
              />
            )}
            text1NumberOfLines={2} // Cho phép 2 dòng cho text1
            text2NumberOfLines={3} // Cho phép 3 dòng cho text2
          />
        ),
        warning: (props) => (
          <BaseToast
            {...props}
            style={styles.warningToast}
            contentContainerStyle={styles.toastContent}
            text1Style={styles.text1}
            text2Style={styles.text2}
            renderLeadingIcon={() => (
              <Image
                source={require('./assets/images/warning-icon.png')} 
                style={styles.icon}
              />
            )}
            text1NumberOfLines={2} // Cho phép 2 dòng cho text1
            text2NumberOfLines={3} // Cho phép 3 dòng cho text2
          />
        )
      }} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  successToast: {
    borderLeftColor: 'transparent',
    backgroundColor: '#f0fff4',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center', 
    justifyContent: 'center',
    minHeight: 100, 
  },
  errorToast: {
    borderLeftColor: 'transparent',
    backgroundColor: '#fff5f5',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center', 
    justifyContent: 'center',
    minHeight: 100, 
  },
  warningToast: {
    borderLeftColor: 'transparent',
    backgroundColor: '#fff3cd', // Light yellow background
    borderRadius: 10,
    padding: 15, // Increased padding for better spacing
    alignItems: 'center', 
    justifyContent: 'center',
    minHeight: 100,
    borderWidth: 1, // Added border
    borderColor: '#856404', // Darker yellow border
    shadowColor: '#000', // Shadow for depth
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  infoToast: {
    borderLeftColor: 'transparent',
    backgroundColor: '#e7f3ff', // Lighter blue background
    borderRadius: 10,
    padding: 15, // Increased padding for better spacing
    alignItems: 'center', 
    justifyContent: 'center',
    minHeight: 100,
    borderWidth: 1, // Added border
    borderColor: '#007BFF', // Border color matching the theme
    shadowColor: '#000', // Shadow for depth
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  toastContent: {
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center',
  },
  text1: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Jost_700Bold',
  },
  text2: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Jost_400Regular',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});