import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; 
import Header from './Header';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from 'axios'; // thêm axios

const ProfileSettingsScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<any>({
    fullname: "Tên người dùng",
    email: "Email",
    image: null,
    _id: "",
  });
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getUserIdFromStorage();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserInfo();
    }

    const unsubscribe = navigation.addListener('focus', () => {
      if (userId) {
        fetchUserInfo();
      }
    });

    return unsubscribe;
  }, [userId]);

  const getUserIdFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const userObj = JSON.parse(userData);
        setUserId(userObj._id);
      }
    } catch (error) {
      console.error("Lỗi khi lấy userId từ AsyncStorage:", error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`http://10.10.10.10:3000/user/${userId}`);
      const userData = response.data;
      if (userData) {
        setUser(userData); // Cập nhật đầy đủ user mới nhất từ server
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin user:", error);
    }
  };

  return (
    <View style={styles.containersmall}>
      <Header />

      <View style={styles.box}>
        <Image
          style={styles.avatar}
          source={
            user.image
              ? { uri: user.image }
              : require("../assets/images/usernobackgr.png")
          }
        />
        <Text style={styles.name}>{user.fullname}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('EditProfile', { userId: user._id })}
          >
            <MaterialCommunityIcons name="account-edit-outline" size={25} color="#333" />
            <Text style={styles.rowText}>Chỉnh sửa thông tin</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <MaterialCommunityIcons name="help-circle-outline" size={25} color="#333" />
            <Text style={styles.rowText}>Trợ giúp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={async () => {
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('user');
              navigation.navigate('LoginDetail');
            }}
          >
            <MaterialCommunityIcons name="logout" size={25} color="#E53935" />
            <Text style={styles.rowTextb}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containersmall: {
    flex: 1,
    backgroundColor: '#e7f3ff',
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
    alignItems: 'center',
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  email: { fontSize: 16, color: '#000' },
  card: { width: '90%', backgroundColor: '#e7f3ff', borderRadius: 10, marginVertical: 10, paddingVertical: 10 },
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
    marginBottom: 10,
  },
  rowText: { flex: 1, marginLeft: 10, fontSize: 16, fontWeight: 'bold' },
  rowTextb: { flex: 1, marginLeft: 10, fontSize: 16, color: '#E53935', fontWeight: 'bold' },
});

export default ProfileSettingsScreen;
