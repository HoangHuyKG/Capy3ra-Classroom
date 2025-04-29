import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import CustomModalMenu from "../navigation/ModalSlideBar"; 
import AsyncStorage from '@react-native-async-storage/async-storage'; // thêm dòng này
import axios from "axios";

const Header = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // Tạo thêm state để lưu userId

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

  // Lấy userId từ AsyncStorage
  const getUserIdFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user._id); // 👈 lấy _id từ user đã lưu
      }
    } catch (error) {
      console.error('Lỗi khi lấy userId từ AsyncStorage:', error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`http://10.10.10.10:3000/user/${userId}`);
      const user = response.data;
      if (user && user.image) {
        setUserImage(user.image);
      } else {
        setUserImage(null);
      }
    } catch (error) {
      console.error('Lỗi khi tải ảnh người dùng:', error);
      setUserImage(null);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.boxheader}>
        <View style={styles.boxheaderb}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <MaterialIcons name="menu" size={35} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("ClassroomList")} style={styles.textbox}>
            <Image style={styles.imagelogo} source={require('../assets/images/logohome.png')}/>
            <Text style={styles.textheadera}>Capy3ra </Text>
            <Text style={styles.textheaderb}>Classroom</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("ProfileSettingsScreen")}>
          <Image
            style={styles.imageuser}
            source={
              userImage
                ? { uri: userImage }
                : require("../assets/images/usernobackgr.png")
            }
          />
        </TouchableOpacity>
      </View>

      {/* Render modal */}
      <CustomModalMenu visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    backgroundColor: "#fff", 
    width: "100%", 
    height: 60, 
    justifyContent: "center", 
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
  },
  imagelogo: { 
    width: 40,
    height: 40
  },
  textbox: {
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  boxheaderb: {flexDirection: "row", alignItems: "center", width: '90%' },
  boxheader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '90%' },
  textheadera: { 
    fontFamily: "Jost_400Regular", 
    fontSize: 20,
    fontWeight: "bold", color: '#0961F5' },
  textheaderb: { fontFamily: "Jost_400Regular", fontSize: 18, fontWeight: "semibold", color: '#333' },
  imageuser: { width: 40, height: 40, borderRadius: 20 },
});

export default Header;
