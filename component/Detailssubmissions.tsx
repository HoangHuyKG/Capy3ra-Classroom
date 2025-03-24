
import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import Header from './Header';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const DetailSubmissions = (props: any) => {
  const { navigation } = props;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("AssignmentScreen")}>
        <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#5f6368" />
        </TouchableOpacity>
        <Text style={styles.title}>Bài nộp của học viên</Text>

      </View>


      <View style={styles.inputContainer}>
      <View style={styles.inputRow}>
            <Text style={styles.name}>Nguyễn Duy Đạt</Text>
        </View>

        <View style={styles.inputRow}>
            <Ionicons name="document-text-outline" size={24} color="gray" />
            <Text style={styles.attachText}>Xem tệp đính kèm</Text>
        </View>

        <View style={styles.inputRow}>
        <MaterialCommunityIcons name="message-reply-text-outline" size={24} color="gray" />
          <TextInput style={styles.attachText} placeholder='Viết nhận xét của bạn'></TextInput>
        </View>
        <View style={styles.inputRow}>
        <Ionicons name="trophy-outline" size={24} color="gray" />
          <TextInput style={styles.attachText} placeholder='Viết điểm bạn chấm vào đây'></TextInput>
        </View>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
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
  buttonheader: { color: '#fff', backgroundColor: '#0641F0', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, alignItems: 'center', fontFamily: "Nunito_400Regular", },
  buttonText: { color: '#fff', fontSize: 16, fontFamily: "Nunito_400Regular", fontWeight: 'semibold' },
  title: {
    fontSize: 20,
    color: '#5f6368',
    fontFamily: "Nunito_400Regular",
    marginLeft: 50,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  inputContainer: {
    paddingHorizontal: 20,
    
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    marginLeft: 10,
    fontSize: 18,
    flex: 1,
    fontFamily: "Nunito_400Regular"

  },
  attachText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#555',
    fontFamily: "Nunito_400Regular",
    width: '100%'
  },
  name: {
    fontSize: 24,
    color: '#555',
    fontWeight: 'bold',
    fontFamily: "Nunito_400Regular"
  },
  postButton: {
    width: 100,
    backgroundColor: '#0D6EFD',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  postText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
  },
});

export default DetailSubmissions;
