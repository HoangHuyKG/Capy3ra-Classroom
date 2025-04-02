import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Header from './Header';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const JoinClassScreen = (props) => {
  const { navigation } = props;
  const [modalVisible, setModalVisible] = useState(false);

  const handleJoinClass = () => {
    // Giả lập lỗi và bật modal
    setModalVisible(true);
  };
  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("ClassroomList")}>
          <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#5f6368" />
        </TouchableOpacity>
        <Text style={styles.title}>Tham gia lớp học</Text>
        <TouchableOpacity style={styles.buttonheader}>
          <Text style={styles.buttonText}>Tham gia</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containerchild}>

        <Text style={styles.instruction}>Hỏi giáo viên của bạn để biết mã lớp, mật khẩu rồi nhập vào bên dưới.</Text>

        <Text style={styles.label}>Mã Lớp</Text>
        <TextInput style={styles.input} placeholder="Nhập mã lớp" />
        <Text style={styles.label}>Mật Khẩu Lớp</Text>
        <TextInput style={styles.input} placeholder="Nhập mật khẩu" />

      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Không tìm thấy lớp học</Text>
            <Text style={styles.modalMessage}>Không có lớp học nào có mã lớp đó.</Text>
            <Text style={styles.modalMessage}>Vui lòng nhập lại</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containersmall: {
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff', // Thêm nền trắng cho header
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8, // Tăng elevation lên cao hơn để dễ thấy bóng
    width: '100%'
  },

  title: {
    fontSize: 20,
    color: '#5f6368',
    fontFamily: "Nunito_400Regular"
  },
  containerchild: { paddingHorizontal: 20 },
  imageuser: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    marginRight: 20,
  },
  userInfobox: { flexDirection: 'column', width: '100%' },
  profileSection: { marginBottom: 10, width: '100%' },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  userInfo: { flexDirection: 'row', width: '100%' },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  userEmail: { fontSize: 14, color: '#666' },
  switchAccount: { color: '#0061FF', fontSize: 16, marginBottom: 20, textAlign: 'center', fontFamily: "Nunito_400Regular", },
  instruction: { fontSize: 14, color: '#555', marginBottom: 20, fontFamily: "Nunito_400Regular", },
  label: { fontSize: 16, marginBottom: 5, color: '#333', fontFamily: "Nunito_400Regular" },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 5, padding: 10, marginBottom: 15, backgroundColor: '#fff', fontFamily: "Nunito_400Regular", marginTop: 10 },
  buttonheader: { color: '#fff', backgroundColor: '#0641F0', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, alignItems: 'center', fontFamily: "Nunito_400Regular", },
  buttonText: { color: '#fff', fontSize: 16, fontFamily: "Nunito_400Regular", fontWeight: 'semibold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' },
  modalContent: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 10, fontFamily: "Nunito_400Regular" },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, fontFamily: "Nunito_400Regular" },
  modalMessage: { fontSize: 16, color: '#333', marginBottom: 15, fontFamily: "Nunito_400Regular" },
  modalOk: { color: '#0641F0', fontSize: 20, fontWeight: 'bold', fontFamily: "Nunito_400Regular" },
});


export default JoinClassScreen;
