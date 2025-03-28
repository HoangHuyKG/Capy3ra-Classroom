import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from './Header';

const ProfileSettingsScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({ fullname: "Tên người dùng", email: "Email" });

  useEffect(() => {
      const fetchUserData = async () => {
          try {
              const userData = await AsyncStorage.getItem('user');
              if (userData) {
                  setUser(JSON.parse(userData));
              }
          } catch (error) {
              console.error("Lỗi khi lấy dữ liệu user:", error);
          }
      };
      fetchUserData();
  }, []);
    
  return (
    <View style={styles.containersmall}>
        <Header />

      <View style={styles.box}>
      <Image style={styles.avatar} source={require("../assets/images/usernobackgr.jpg")} />

                <Text style={styles.name}>{user.fullname}</Text>
                <Text style={styles.email}>{user.email}</Text>
                <Text style={styles.switchAccount}>Chuyển đổi tài khoản</Text>

        <View style={styles.card}>
          <TouchableOpacity style={styles.row}>
            <Ionicons name="help-circle-outline" size={20} color="#333" />
            <Text style={styles.rowText}>Trợ giúp</Text>
          </TouchableOpacity>

         
      <TouchableOpacity style={styles.row} onPress={async () => {
          await AsyncStorage.removeItem('token'); // Xóa token đã lưu trong AsyncStorage
          await AsyncStorage.removeItem('user');  // Xóa thông tin user đã lưu
          navigation.navigate('LogOut'); // Chuyển hướng người dùng về màn hình đăng nhập
      }}>
          <Ionicons name="log-out-outline" size={20} color="#333" />
          <Text style={styles.rowText}>Đăng xuất</Text>
      </TouchableOpacity>

      </View>
      </View>

      </View>
  );
};

const styles = StyleSheet.create({
  containersmall: { 
    flex: 1,
    backgroundColor: '#fff', 
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 5, 
    alignItems: 'center',
  },  
  box: {
    marginTop: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  backIcon: { position: 'absolute', top: 100, left: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#000',fontFamily: "Nunito_400Regular", },
  email: { fontSize: 16, color: '#000' , fontFamily: "Nunito_400Regular",},
  switchAccount: { fontSize: 14, color: '#0641F0', marginVertical: 8,fontFamily: "Nunito_400Regular", },
  card: { width: '90%', backgroundColor: '#fff', borderRadius: 10, marginVertical: 10, paddingVertical: 10 },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 20, 
    paddingHorizontal: 20,
    backgroundColor: '#fff', 
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 5, 
    marginBottom: 10
  },
  
  rowText: { flex: 1, marginLeft: 10, fontSize: 16, fontFamily: "Nunito_400Regular" },
  rowValue: { color: '#0641F0', fontSize: 16, fontFamily: "Nunito_400Regular" },
});

export default ProfileSettingsScreen;