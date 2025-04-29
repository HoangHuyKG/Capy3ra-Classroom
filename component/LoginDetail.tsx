import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const LoginDetail = (props: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { navigation } = props;



  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'warning',
        text1: 'Cảnh báo',
        text2: 'Vui lòng nhập email hoặc mật khẩu của bạn!',
      });
      return;
    }

    try {
      const response = await fetch('http://10.10.10.10:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.status === 200) {
        // ✅ Lưu token & thông tin user vào AsyncStorage
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        
        navigation.navigate('ClassroomList');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Đăng nhập thất bại',
          text2: 'Bạn nhập sai Email hoặc Mật khẩu!',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể kết nối đến server!',
      });
    }
  };


  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Đăng nhập</Text>
      <Text style={styles.textdown}>Đăng nhập vào tài khoản của bạn để bắt đầu !</Text>
      <View style={styles.formlogin}>
        <View style={styles.inputbox}>
          <MaterialCommunityIcons name="email" size={24} color="#333"  />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputbox}>
          <MaterialCommunityIcons name="lock" size={24} color="#333" />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.buttona} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>


        <View style={styles.boxbottom}>
          <Text style={styles.textdownb}>Bạn chưa có tài khoản?</Text>
          <TouchableOpacity style={styles.buttonb} onPress={()=>navigation.navigate("SignUpDetail")}>
            <Text style={styles.textdownc}>ĐĂNG KÝ</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  logo: {
    marginTop: 20,
    width: 250,
    height: 250,
  },
  textdown: {
    paddingHorizontal: 20,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Jost_400Regular',
    width: '100%',
    fontWeight: 'bold'
  },
  formlogin: {
    marginTop: 20,
    padding: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  boxbottom: {
    flexDirection: 'row'
  },
  title: {
    paddingHorizontal: 20,
    marginBottom: 10,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Jost_400Regular',
    width: '100%'
  },
  buttona: {
    marginTop: 20,
    backgroundColor: '#0961F5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: '100%'
  },
  buttonb: {
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Jost_400Regular',
  },
  inputbox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#0961F5',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '100%',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
   
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontFamily: 'Jost_400Regular',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },
  textdownb: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Jost_400Regular',
    marginVertical: 20,
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold'

  },
  textdownc: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Jost_400Regular',
    marginVertical: 20,
    color: '#0961F5',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold'

  }

});

export default LoginDetail;
