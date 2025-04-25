import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useFonts, Jost_400Regular, Jost_700Bold } from '@expo-google-fonts/jost';
import AppLoading from 'expo-app-loading'; // để giữ màn hình loading khi font chưa tải xong
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function LoginScreen(props: any) {
  const { navigation } = props;
  const [showText, setShowText] = useState(false);

  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_700Bold
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.welcomeText}>
        Chào mừng đến với ứng dụng lớp học trực tuyến Capy3ra Classroom:
      </Text>
      <View style={styles.descriptionbox}>
        <MaterialCommunityIcons style={styles.icon} name="lightbulb-on" size={24} color="#F4E04D" />
        <Text style={styles.description}>Lớp học thông minh, học tập không giới hạn!</Text>
      </View>
      <View style={styles.descriptionbox}>
        <MaterialCommunityIcons style={styles.icon} name="bookmark" size={24} color="#3B82F6" />
        <Text style={styles.description}>Kết nối lớp học, tăng trải nghiệm học tập!</Text>
      </View>
      <View style={styles.descriptionbox}>
        <MaterialCommunityIcons style={styles.icon} name="earth" size={24} color="#10B981" />
        <Text style={styles.description}>Học tập dễ dàng, mọi lúc mọi nơi!</Text>
      </View>

      <TouchableOpacity
        style={[styles.nextButton, !showText && styles.disabledButton]}
        onPress={() => navigation.navigate('LoginDetail')}
        disabled={!showText}
      >
        <Text style={styles.nextText}>Tiếp theo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logo: {
    width: 250,
    height: 250,
  },
  nextButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    padding: 10,
    borderRadius: 30,
    backgroundColor: '#0961F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Jost_700Bold'
  },
  welcomeText: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    fontFamily: 'Jost_400Regular',
    fontWeight: 'bold'
  },
  description: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Jost_400Regular',
    textAlign: 'left',
    width: '100%',
    fontWeight: 'bold'
  },
  descriptionbox: {
    paddingLeft: 45,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    marginRight: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
