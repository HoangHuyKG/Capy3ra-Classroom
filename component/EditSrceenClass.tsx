import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Header from './Header';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const EditClassInfoScreen = () => {
    const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("ClassroomList")}>
        <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#5f6368" />
        </TouchableOpacity>
        <Text style={styles.title}>Chỉnh sửa lớp</Text>
        <TouchableOpacity style={styles.buttonheader}>
                  <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
      </View>
      <View style={styles.containersmall}>

      {/* Form Inputs */}
      <Text style={styles.label}>Mã lớp</Text>
      <TextInput style={styles.input} placeholder="" />
      <Text style={styles.label}>Tên lớp (bắt buộc)</Text>
      <TextInput style={styles.input} placeholder="" />
      <Text style={styles.label}>Chủ đề</Text>
      <TextInput style={styles.input} placeholder="" />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput style={styles.input} placeholder="" />

      <Text style={styles.label}>Mật khẩu lớp học</Text>
      <TextInput style={styles.input} placeholder="" />
      </View>
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
  disabledButton: {
    color: '#5f6368',
    fontSize: 16,
  },
  buttonheader: { color: '#fff', backgroundColor: '#0641F0', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, alignItems: 'center', fontFamily: "Nunito_400Regular", },
  buttonText: { color: '#fff', fontSize: 16, fontFamily: "Nunito_400Regular", fontWeight: 'semibold' },
  label: {
    color: '#0641F0',
    fontSize: 16,
    marginBottom: 4,
    fontFamily: "Nunito_400Regular"
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#5f6368',
    fontSize: 16,
    marginBottom: 20,
    paddingVertical: 4,
    fontFamily: "Nunito_400Regular"
  },
});

export default EditClassInfoScreen;
