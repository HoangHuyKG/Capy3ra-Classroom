import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const PostNotificationScreen = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  const route = useRoute();
  const navigation = useNavigation();
  const classId = route.params?.classId;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUsername(user.fullname);
        }
      } catch (error) {
        console.error("Lỗi khi lấy user từ AsyncStorage:", error);
      }
    };

    getUserData();
  }, []);

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const pickDocument = async () => {
    try {
      setUploadingFiles(true);
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

      if (result.canceled) {
        setUploadingFiles(false);
        return;
      }

      const fileUri = result.assets ? result.assets[0].uri : result.uri;
      const fileName = result.assets ? result.assets[0].name : result.name;

      setSelectedFiles((prev) => [...prev, { name: fileName, uri: fileUri }]);
    } catch (error) {
      console.error("Lỗi khi chọn tệp:", error);
    } finally {
      setUploadingFiles(false);
    }
  };

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return <MaterialCommunityIcons name="file-pdf-box" size={24} color="#E53935" />;
      case 'doc':
      case 'docx': return <MaterialCommunityIcons name="file-word-box" size={24} color="#1E88E5" />;
      case 'xls':
      case 'xlsx': return <MaterialCommunityIcons name="file-excel-box" size={24} color="#43A047" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif': return <MaterialCommunityIcons name="file-image" size={24} color="#FB8C00" />;
      case 'ppt':
      case 'pptx': return <MaterialCommunityIcons name="file-powerpoint-box" size={24} color="#E64A19" />;
      case 'zip':
      case 'rar': return <MaterialCommunityIcons name="folder-zip" size={24} color="#6D4C41" />;
      default: return <MaterialCommunityIcons name="file-document" size={24} color="#607D8B" />;
    }
  };

  const handleUpload = async () => {
    if (uploadingFiles) {
      Toast.show({
        type: 'info',
        text1: 'Đang tải tệp',
        text2: 'Vui lòng đợi tệp đính kèm được tải xong.',
      });
      return;
    }

    if (!notificationMessage.trim()) {
      Toast.show({
        type: 'warning',
        text1: 'Cảnh báo',
        text2: 'Vui lòng nhập nội dung thông báo đến lớp',
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("message", notificationMessage);
    formData.append("classId", classId);
    formData.append("username", username);

    selectedFiles.forEach((file) => {
      formData.append("files", {
        uri: file.uri,
        name: file.name,
        type: "application/octet-stream",
      });
    });

    try {
      const response = await fetch("http://192.168.1.6:3000/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Thành công!',
          text2: 'Đăng thông báo thành công cho lớp!',
        });
        setSelectedFiles([]);
        setNotificationMessage("");
        navigation.navigate("DetailClassroom", { classId });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: data.message || "Đăng thông báo thất bại",
        });
      }
    } catch (error) {
      console.error("Lỗi khi upload:", error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi mạng',
        text2: 'Không thể upload tệp',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0961F5" />
          <Text style={{ marginTop: 10, fontFamily: "Jost_400Regular" }}>Đang đăng thông báo...</Text>
        </View>
      )}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Thông báo cho lớp</Text>
        <TouchableOpacity style={styles.buttonheader} onPress={handleUpload}>
          <Text style={styles.buttonText}>Đăng</Text>
          {uploadingFiles && <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 10 }} />}
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.inputContainer}
        contentContainerStyle={{ paddingBottom: 20 }}
        data={['input', 'button', ...selectedFiles]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          if (item === 'input') {
            return (
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.attachTextb}
                  placeholder='Nhập thông báo ở đây'
                  value={notificationMessage}
                  onChangeText={setNotificationMessage}
                  multiline={true}
                  numberOfLines={20}
                  textAlignVertical="top"
                />
              </View>
            );
          }

          if (item === 'button') {
            return (
              <TouchableOpacity style={styles.inputRow} onPress={pickDocument}>
                <Ionicons name="attach" size={30} color="#333" />
                <Text style={styles.attachText}>Thêm tệp đính kèm</Text>
              </TouchableOpacity>
            );
          }

          return (
            <View style={styles.fileItem}>
              {getFileIcon(item.name)}
              <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
              <TouchableOpacity onPress={() => removeFile(index - 2)}>
                <Ionicons name="close-circle" size={30} color="red" />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e7f3ff' },
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
  title: { fontSize: 20, color: '#333', fontFamily: "Jost_400Regular", fontWeight: 'bold' },
  buttonheader: {
    backgroundColor: '#0961F5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', fontFamily: "Jost_400Regular" },
  inputContainer: { padding: 10 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#0961F5',
    backgroundColor: '#fff',
    borderRadius: 30,
    marginTop: 10,
  },
  attachText: { fontSize: 16, color: '#333', fontFamily: "Jost_400Regular", fontWeight: 'bold' },
  attachTextb: { fontSize: 16, color: '#333', fontFamily: "Jost_400Regular", height: 300, fontWeight: 'bold', flex: 1 },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#0961F5',
    backgroundColor: '#fff',
    marginTop: 10,
  },
  fileName: { marginLeft: 10, fontSize: 16, color: '#333', width: '80%', fontWeight: 'bold' },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

export default PostNotificationScreen;
