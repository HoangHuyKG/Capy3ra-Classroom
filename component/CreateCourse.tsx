import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const CreateClassScreen = () => {
  const navigation = useNavigation();
  const [classData, setClassData] = useState({
    code: "",
    name: "",
    topic: "",
    description: "",
    password: "",
    userId: ""
  });

  // Hàm hiển thị toast
  const showToast = (type, title, message) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 50,
    });
  };

  // Lấy userId từ AsyncStorage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          if (user._id) {
            setClassData(prevState => ({ ...prevState, userId: user._id }));
          } else {
            showToast("error", "Lỗi", "Không tìm thấy ID người dùng!");
          }
        } else {
          showToast("error", "Lỗi", "Không tìm thấy thông tin người dùng!");
        }
      } catch (error) {
        console.error("❌ Lỗi lấy user từ AsyncStorage:", error);
        showToast("error", "Lỗi", "Không thể lấy dữ liệu người dùng!");
      }
    };
    fetchUser();
  }, []);

  // Cập nhật state khi người dùng nhập dữ liệu
  const handleChange = (field, value) => {
    setClassData(prevState => ({ ...prevState, [field]: value }));
  };

  // Xử lý tạo lớp
  const handleCreateClass = async () => {
    if (!classData.code) {
      showToast("warning", "Thiếu thông tin", "Vui lòng nhập mã lớp học!");
      return;
    }
    if (!classData.name) {
      showToast("warning", "Thiếu thông tin", "Vui lòng nhập tên lớp học!");
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
        showToast("success", "Thành công", "Lớp học đã được tạo!");
        navigation.navigate("ClassroomList");
      } else {
        showToast("error", "Lỗi", data.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("❌ Lỗi kết nối server:", error);
      showToast("error", "Lỗi kết nối", "Không thể kết nối đến server!");
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
      <View style={styles.inputWrapper}>
  <MaterialCommunityIcons name="key-outline" size={24} color="#333" />
  <TextInput
    style={styles.input}
    placeholder='Mã lớp (bắt buộc)'
    value={classData.code}
    onChangeText={(text) => handleChange("code", text)}
  />
</View>

<View style={styles.inputWrapper}>
  <MaterialCommunityIcons name="book-outline" size={24} color="#333" />
  <TextInput
    style={styles.input}
    placeholder='Tên lớp (bắt buộc)'
    value={classData.name}
    onChangeText={(text) => handleChange("name", text)}
  />
</View>

<View style={styles.inputWrapper}>
  <MaterialCommunityIcons name="tag-outline" size={24} color="#333" />
  <TextInput
    style={styles.input}
    placeholder='Chủ đề'
    value={classData.topic}
    onChangeText={(text) => handleChange("topic", text)}
  />
</View>

<View style={styles.inputWrapperTextArea}>
  <MaterialCommunityIcons name="text-box-outline" size={24} color="#333" style={{ marginTop: 20 }} />
  <TextInput
    style={styles.inputc}
    multiline={true}
    numberOfLines={15}
    placeholder='Mô tả'
    value={classData.description}
    onChangeText={(text) => handleChange("description", text)}
  />
</View>

<View style={styles.inputWrapper}>
  <MaterialCommunityIcons name="lock-outline" size={24} color="#333" />
  <TextInput
    style={styles.input}
    placeholder='Mật khẩu lớp học'
    secureTextEntry
    value={classData.password}
    onChangeText={(text) => handleChange("password", text)}
  />
</View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e7f3ff' },
  containersmall: { padding: 10 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
    width: '100%'
  },
  buttonheader: {
    backgroundColor: '#0961F5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  title: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold'
  },
 
  
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0961F5',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginTop: 20
  },
  inputWrapperTextArea: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0961F5',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginTop: 20
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingLeft: 10,
    fontFamily: "Jost_400Regular",
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  inputc: {
    flex: 1,
    height: 300,
    paddingTop: 20,
    paddingLeft: 10,
    fontFamily: "Jost_400Regular",
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlignVertical: 'top',
  }
  
  
});

export default CreateClassScreen;
