
import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import Header from './Header';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import axios from 'axios';

const DetailSubmissions = (props: any) => {
  const route = useRoute();
  const { navigation } = props;
  const classId = route.params?.classId; // Nhận classId từ params
  const [studentName, setStudentName] = useState('');
  const [fileName, setFileName] = useState('');
  const { submissionId } = route.params;
  const exerciseId = route.params?.exerciseId;
  const [score, setScore] = useState('');
const [comment, setComment] = useState('');

useEffect(() => {
  const fetchSubmission = async () => {
    try {
      const res = await axios.get(`http://10.10.10.10:3000/submission/${submissionId}`);
      const { name, filePath, score, comment } = res.data;
      setStudentName(name);
      setFileName(filePath.split('/').pop());
      setScore(score?.toString() || '');
      setComment(comment || '');
    } catch (error) {
      console.error('❌ Lỗi khi tải submission:', error);
    }
  };

  fetchSubmission();
}, [submissionId]);

const handleSubmit = async () => {
  try {
    await axios.put(`http://10.10.10.10:3000/submission/${submissionId}/grade`, {
      score: score,
      comment: comment,
    });

    alert('✅ Chấm điểm thành công!');
    navigation.goBack(); // hoặc điều hướng tới màn khác nếu muốn
  } catch (error) {
    console.error('❌ Lỗi khi chấm điểm:', error);
    alert('❌ Chấm điểm thất bại');
  }
};

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'pdf':
        return <MaterialCommunityIcons name="file-pdf-box" size={24} color="#E53935" />;
      case 'doc':
      case 'docx':
        return <MaterialCommunityIcons name="file-word-box" size={24} color="#1E88E5" />;
      case 'xls':
      case 'xlsx':
        return <MaterialCommunityIcons name="file-excel-box" size={24} color="#43A047" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <MaterialCommunityIcons name="file-image" size={24} color="#FB8C00" />;
      case 'ppt':
      case 'pptx':
        return <MaterialCommunityIcons name="file-powerpoint-box" size={24} color="#E64A19" />;
      case 'zip':
      case 'rar':
        return <MaterialCommunityIcons name="folder-zip" size={24} color="#6D4C41" />;
      default:
        return <MaterialCommunityIcons name="file-document" size={24} color="#607D8B" />;
    }
  };
  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("AssignmentScreen", { activeTab: 'clipboard', classId: classId, exerciseId})}>
          <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Bài nộp học viên</Text>
        <TouchableOpacity style={styles.buttonheader}>
        <TouchableOpacity style={styles.buttonheader} onPress={handleSubmit}>
  <Text style={styles.buttonText}>Gửi</Text>
</TouchableOpacity>

        </TouchableOpacity>
      </View>


      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
        <Text style={styles.name} numberOfLines={1}>{studentName}</Text>

        </View>



        <View style={styles.inputRowb}>
          <MaterialCommunityIcons name="message-reply-text-outline" size={24} color="#333" style={{marginTop: 10}}/>
          <TextInput
  style={styles.attachText}
  placeholder='Viết nhận xét của bạn'
  multiline={true}
  numberOfLines={4}
  textAlignVertical="top"
  value={comment}
  onChangeText={setComment}
/>
        </View>
        <View style={styles.inputRow}>
        <MaterialCommunityIcons name="trophy-outline" size={24} color="#333" />
        <TextInput
  style={styles.attachText}
  placeholder='Viết điểm bạn chấm vào đây'
  value={score}
  onChangeText={setScore}
  keyboardType='numeric'
/>
        </View>
          <Text style={styles.textfile}>Bài nộp của học viên: </Text>
        <View style={styles.fileItem}>
          {getFileIcon('Screenshot_20250419_144309_Tng S Mnh Nht.jpg')}
          <Text style={styles.fileName} numberOfLines={1}>{fileName}</Text>

          
        </View>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e7f3ff',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#0961F5',
    fontFamily: "Jost_400Regular",
    backgroundColor: '#fff',
    marginTop: 10
  },
  fileName: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    width: '80%',
    fontWeight: 'bold'
  },
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
    width: '100%',
  },
  textfile: {
    fontSize: 16,
    fontFamily: "Jost_400Regular",
    fontWeight: 'bold',
    padding: 10,
    marginTop: 10
  },
  buttonheader: {
    color: '#fff',
    backgroundColor: '#0961F5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: "Jost_400Regular",
    fontWeight: 'bold'
  },
  title: {
    fontSize: 20,
    color: '#333',
    fontFamily: "Jost_400Regular",
    fontWeight: 'bold'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  inputContainer: {
    padding: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#0961F5',
    backgroundColor: '#fff',
    borderRadius: 30,
    marginTop: 10,
    paddingHorizontal: 20,
    fontFamily: "Jost_400Regular",
    fontWeight: 'bold'
  },
  inputRowb: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#0961F5',
    backgroundColor: '#fff',
    borderRadius: 30,
    marginTop: 10,
    paddingHorizontal: 20,
    fontFamily: "Jost_400Regular",
    fontWeight: 'bold',
    height: 300
  },
  input: {
    marginLeft: 10,
    fontSize: 18,
    flex: 1,
    fontFamily: "Jost_400Regular",
    fontWeight: 'bold'

  },
  attachText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#555',
    fontFamily: "Jost_400Regular",
    width: '100%',
    fontWeight: 'bold'

  },
  name: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    fontFamily: "Jost_400Regular",
    width: '100%',
    textAlign: 'center'
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
