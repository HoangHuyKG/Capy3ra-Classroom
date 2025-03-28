import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import CryptoJS from "react-native-crypto-js";
const SignUpDetail = (props: any) => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { navigation } = props;
  

  const handleSignUp = async () => {
    if (!fullname || !email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu nhập lại không khớp!');
      return;
    }
  
    try {
      const response = await fetch('http://10.0.2.2:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullname, email, password })  // ❌ Không mã hóa AES
      });
  
      const data = await response.json();
  
      if (response.status === 201) {
        Alert.alert('Thành công', 'Đăng ký thành công!');
        navigation.navigate('ClassroomList');
      } else {
        Alert.alert('Lỗi', data.message || 'Có lỗi xảy ra!');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến server!');
    }
  };
  
  
  // const handleSignUp = async () => {
  //   if (!fullname || !email || !password || !confirmPassword) {
  //     Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
  //     return;
  //   }
  
  //   if (password.length < 8) {
  //     Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 8 ký tự!');
  //     return;
  //   }
  
  //   if (password !== confirmPassword) {
  //     Alert.alert('Lỗi', 'Mật khẩu nhập lại không khớp!');
  //     return;
  //   }
  
  //   // 🔒 Mã hóa mật khẩu bằng AES
  //   const encryptedPassword = CryptoJS.AES.encrypt(password, "SECRET_KEY").toString();
  
  //   try {
  //     const response = await fetch('http://10.0.2.2:3000/signup', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ fullname, email, password: encryptedPassword })
  //     });
  
  //     const data = await response.json();
  
  //     if (response.status === 201) {
  //       Alert.alert('Thành công', 'Đăng ký thành công!');
  //       navigation.navigate('ClassroomList');
  //     } else {
  //       Alert.alert('Lỗi', data.message || 'Có lỗi xảy ra!');
  //     }
  //   } catch (error) {
  //     Alert.alert('Lỗi', 'Không thể kết nối đến server!');
  //   }
  // };
  
  return (
    <View style={styles.container}>
      <View style={styles.containersmall}>
        <Text style={styles.title}>Đăng ký</Text>
        <TextInput
          style={styles.input}
          placeholder="Họ tên"
          value={fullname}
          onChangeText={setFullname}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập lại Mật khẩu"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>
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
  containersmall: {
    width: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  button: {
    backgroundColor: '#0641F0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default SignUpDetail;
