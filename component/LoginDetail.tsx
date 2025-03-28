import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LoginDetail = (props: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { navigation } = props;



  const handleLogin = async () => {
      if (!email || !password) {
          Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
          return;
      }
  
      try {
          const response = await fetch('http://10.0.2.2:3000/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
          });
  
          const data = await response.json();
  
          if (response.status === 200) {
              // ✅ Lưu token & thông tin user vào AsyncStorage
              await AsyncStorage.setItem('token', data.token);
              await AsyncStorage.setItem('user', JSON.stringify(data.user));
  
              Alert.alert('Thành công', 'Đăng nhập thành công!');
              navigation.navigate('ClassroomList');
          } else {
              Alert.alert('Lỗi', data.message || 'Có lỗi xảy ra!');
          }
      } catch (error) {
          Alert.alert('Lỗi', 'Không thể kết nối đến server!');
      }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.containersmall}>
        <Text style={styles.title}>Đăng nhập</Text>
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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
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
    textAlign: 'center',
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
    textAlign: 'center',
  },
});

export default LoginDetail;
