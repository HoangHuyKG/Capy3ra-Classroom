import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import CryptoJS from "react-native-crypto-js";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const SignUpDetail = (props: any) => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { navigation } = props;


  const handleSignUp = async () => {
    if (!fullname || !email || !password || !confirmPassword) {
      Toast.show({
              type: 'warning',
              text1: 'Cảnh báo',
              text2: 'Vui lòng nhập đầy đủ thông tin!',
            });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'warning',
        text1: 'Cảnh báo',
        text2: 'Mật khẩu nhập lại không khớp!',
      });

      return;
    }

    try {
      const response = await fetch('http://10.10.10.10:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullname, email, password })
      });

      const data = await response.json();

      if (response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Đăng ký thành công!',
        });
        navigation.navigate('LoginDetail');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Có lỗi xảy ra!',
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
      <Text style={styles.title}>Đăng ký</Text>
      <Text style={styles.textdown}>Tạo một tài khoản để bắt đầu nào !</Text>
      <View style={styles.formlogin}>
        <View style={styles.inputbox}>
        <MaterialCommunityIcons name="account" size={24} color="#333" />
          <TextInput
            style={styles.input}
            placeholder="Họ tên"
            value={fullname}
            onChangeText={setFullname}
          />
        </View>

        <View style={styles.inputbox}>
          <MaterialCommunityIcons name="email" size={24} color="#333" />
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
        <View style={styles.inputbox}>
        <MaterialCommunityIcons name="lock-alert" size={24} color="#333" />
          <TextInput
            style={styles.input}
            placeholder="Nhập lại Mật khẩu"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity style={styles.buttona} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>


        <View style={styles.boxbottom}>
          <Text style={styles.textdownb}>Đã có tài khoản? </Text>
          <TouchableOpacity style={styles.buttonb} onPress={() => navigation.navigate("LoginDetail")}>
            <Text style={styles.textdownc}>ĐĂNG NHẬP</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  logo: {
    marginTop: 20,
    width: 200,
    height: 200,
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
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left',
    fontFamily: 'Jost_400Regular',
    
  },

  button: {
    backgroundColor: '#0961F5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,

  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  buttona: {
    marginTop: 20,
    backgroundColor: '#0961F5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: '100%',

  },
  buttonb: {
    marginLeft: 5,

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

  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontFamily: 'Jost_400Regular',
    fontSize: 16,
    fontWeight: 'bold'

  },
});

export default SignUpDetail;
