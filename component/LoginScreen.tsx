import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useFonts, Nunito_400Regular} from "@expo-google-fonts/nunito";

export default function LoginScreen(props: any) {
  const {navigation} = props;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={require("../assets/images/logo.png")} style={styles.image} />

        <View  style={styles.carddescription}>

        <Text style={styles.description}><FontAwesome style={styles.icon} name="lightbulb-o" size={20} color="black" /> Quản lý lớp học thông minh – Học tập không giới hạn!</Text>
        <Text style={styles.description}><FontAwesome style={styles.icon} name="book" size={16} color="black" /> Kết nối lớp học, nâng cao trải nghiệm học tập!</Text>
        <Text style={styles.description}><FontAwesome6 style={styles.icon} name="earth-americas" size={16} color="black" /> Học tập dễ dàng, mọi lúc mọi nơi!</Text>
        
            <TouchableOpacity style={styles.googleButton} onPress={()=> navigation.navigate("LoginDetail")}>
              <Text style={styles.googleText}>Đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.googleButton} onPress={()=> navigation.navigate("SignUpDetail")}>
              <Text style={styles.googleText}>Đăng ký</Text>
            </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#74AFF0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  card: {
    paddingHorizontal: 30,
    width: "100%",
    height: 550,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    borderRadius: 10,
  },
  carddescription: {
    width: '100%'
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  description: {
    marginBottom: 20,
    fontSize: 14,
    color: '#444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "Nunito_400Regular",
    fontWeight: 600
  },
  googleButton: {

    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  googleIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    color: '#333',
    fontFamily: "Nunito_400Regular",
    fontWeight: 'semibold'

  },
});
