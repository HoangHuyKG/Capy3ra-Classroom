import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateClassScreen = () => {
  const navigation = useNavigation();
  const [classData, setClassData] = useState({
    code: "",
    name: "",
    topic: "",
    description: "",
    password: "",
    userId: "" // Thêm userId vào state
  });

  // Lấy userId từ AsyncStorage khi màn hình được load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
       
  
        if (userData) {
          const user = JSON.parse(userData);
          if (user._id) {
            setClassData(prevState => ({ ...prevState, userId: user._id }));
    
          } else {
            Alert.alert("Lỗi", "Không tìm thấy ID người dùng!");
          }
        } else {
          Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng!");
        }
      } catch (error) {
        console.error("❌ Lỗi lấy user từ AsyncStorage:", error);
      }
    };
  
    fetchUser();
  }, []);
  

  // Xử lý thay đổi dữ liệu nhập vào
  const handleChange = (field, value) => {
    setClassData(prevState => ({ ...prevState, [field]: value }));
  };

  // Gửi dữ liệu lên MongoDB qua API
  const handleCreateClass = async () => {
    if (!classData.name) {
      Alert.alert("Lỗi", "Vui lòng nhập tên lớp học!");
      return;
    }
  
  
  
    try {
      const response = await fetch('http://192.168.1.6:3000/create-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classData),
      });
  
      const data = await response.json();
  
     
      
  
      if (response.status === 201) {
        Alert.alert("Thành công", "Lớp học đã được tạo!");
        navigation.navigate("ClassroomList");
      } else {
        Alert.alert("Lỗi", data.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("❌ Lỗi kết nối server:", error);
      Alert.alert("Lỗi", "Không thể kết nối đến server!");
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("ClassroomList")}>
          <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#5f6368" />
        </TouchableOpacity>
        <Text style={styles.title}>Tạo lớp học</Text>
        <TouchableOpacity style={styles.buttonheader} onPress={handleCreateClass}>
          <Text style={styles.buttonText}>Tạo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containersmall}>
        <Text style={styles.label}>Mã lớp</Text>
        <TextInput style={styles.input} value={classData.code} onChangeText={(text) => handleChange("code", text)} />

        <Text style={styles.label}>Tên lớp (bắt buộc)</Text>
        <TextInput style={styles.input} value={classData.name} onChangeText={(text) => handleChange("name", text)} />

        <Text style={styles.label}>Chủ đề</Text>
        <TextInput style={styles.input} value={classData.topic} onChangeText={(text) => handleChange("topic", text)} />

        <Text style={styles.label}>Mô tả</Text>
        <TextInput style={styles.input} value={classData.description} onChangeText={(text) => handleChange("description", text)} />

        <Text style={styles.label}>Mật khẩu lớp học</Text>
        <TextInput style={styles.input} secureTextEntry value={classData.password} onChangeText={(text) => handleChange("password", text)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  containersmall: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 8, width: '100%' },
  buttonheader: { backgroundColor: '#0641F0', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'semibold' },
  title: { fontSize: 20, color: '#5f6368' },
  label: { color: '#0641F0', fontSize: 16, marginBottom: 4 },
  input: { borderBottomWidth: 1, borderBottomColor: '#5f6368', fontSize: 16, marginBottom: 20, paddingVertical: 4 }
});

export default CreateClassScreen;
