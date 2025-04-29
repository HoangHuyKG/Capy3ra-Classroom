import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const JoinClassScreen = (props) => {
  const { navigation } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [classPassword, setClassPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [teachingClasses, setTeachingClasses] = useState([]);

  const showToast = (type, title, message) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      topOffset: 50,
    });
  };
  useEffect(() => {
    const fetchTeachingClasses = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (!userData) return;

        const user = JSON.parse(userData);
        const userId = user?._id;
        if (!userId) return;

        const response = await fetch(`http://10.10.10.10:3000/classes/${userId}`);
        if (response.status === 404) {
          setTeachingClasses([]);
          return;
        }

        const data = await response.json();
        setTeachingClasses(data);
      } catch (error) {
        console.error("Lỗi khi lấy lớp đang dạy:", error);
        setTeachingClasses([]);
      }
    };

    fetchTeachingClasses();
  }, []);

  const handleJoinClass = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);
      const userId = user ? user._id : null;

      if (!userId) {
        showToast("error", "Lỗi", "Không tìm thấy thông tin người dùng!");
        return;
      }

      const response = await fetch('http://10.10.10.10:3000/join-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classCode, classPassword, userId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Kiểm tra nếu mã lớp nhập vào nằm trong danh sách lớp mà người dùng đang dạy
        const isTeachingThisClass = teachingClasses.some(cls => cls.code === classCode);
        if (isTeachingThisClass) {
          Toast.show({
            type: 'error',
            text1: 'Bạn là người tạo lớp này',
            text2: 'Không thể tham gia lớp học của chính mình.',
          });
          return;
        }

      } else {
        setErrorMessage(data.message || "Tham gia thất bại!");
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Lỗi khi tham gia lớp học:", error);
      setErrorMessage("Lỗi kết nối server!");
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("ClassroomList")}>
          <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Tham gia lớp học</Text>
        <TouchableOpacity style={styles.buttonheader} onPress={handleJoinClass}>
          <Text style={styles.buttonText}>Tham gia</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containerchild}>
        <Text style={styles.instruction}>
          Hỏi giáo viên của bạn để biết mã lớp, mật khẩu rồi nhập vào bên dưới.
        </Text>

        <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="key-outline" size={24} color="#333" style={styles.inputIcon} />
  <TextInput
    style={styles.input}
    placeholder="Nhập mã lớp"
    value={classCode}
    onChangeText={setClassCode}
    placeholderTextColor="#999"
  />
</View>

<View style={styles.inputContainer}>
<MaterialCommunityIcons name="lock-outline" size={24} color="#333" style={styles.inputIcon} />
  <TextInput
    style={styles.input}
    placeholder="Nhập mật khẩu"
    secureTextEntry
    value={classPassword}
    onChangeText={setClassPassword}
    placeholderTextColor="#999"
  />
</View>

      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thông báo</Text>
            <Text style={styles.modalMessage}>{errorMessage}</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalOk}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e7f3ff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 15, backgroundColor: '#fff',
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 8,
  },
  title: { fontSize: 20, color: '#333', fontWeight: 'bold' },
  buttonheader: {
    backgroundColor: '#0961F5', paddingHorizontal: 20,
    paddingVertical: 10, borderRadius: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  containerchild: { paddingHorizontal: 20 },
  instruction: {
    fontSize: 14, color: '#555', marginVertical: 20,
    fontWeight: 'bold',
  },
  
  modalContainer: {
    flex: 1, justifyContent: 'center',
    alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  modalContent: {
    width: '90%', backgroundColor: '#fff',
    padding: 20, borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 10,
  },
  modalMessage: { fontSize: 16, color: '#333', marginBottom: 15 },
  modalOk: { color: '#0961F5', fontSize: 20, fontWeight: 'bold' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0961F5',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginTop: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  
});

export default JoinClassScreen;
