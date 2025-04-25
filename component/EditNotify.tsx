import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, FlatList,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import Toast from 'react-native-toast-message';

const EditNotifyScreen = (props: any) => {
  const navigation = useNavigation();
  const route = useRoute();
  const notificationId = route.params?.notificationId;
  const [removedOldFiles, setRemovedOldFiles] = useState([]);
  const classId = route.params?.classId;
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newFiles, setNewFiles] = useState([]);

  const removeOldFile = (url) => {
    setRemovedOldFiles([...removedOldFiles, url]);
  };

  useEffect(() => {
    if (notificationId) {
      fetchNotification();
    }
  }, [notificationId]);

  const fetchNotification = async () => {
    try {
      const response = await axios.get(`http://192.168.1.6:3000/notifications/${notificationId}`);
      setNotification(response.data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy thông báo:", error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể tải thông báo.',
      });
    } finally {
      setLoading(false);
    }
  };

  const pickNewFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (result.canceled) return;

      const file = result.assets ? result.assets[0] : result;
      setNewFiles([...newFiles, { uri: file.uri, name: file.name }]);
    } catch (error) {
      console.error("❌ Lỗi chọn tệp:", error);
    }
  };

  const removeNewFile = (index) => {
    setNewFiles(newFiles.filter((_, i) => i !== index));
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
  const handleSave = async () => {
    if (!notification.content || notification.content.trim() === '') {
      Toast.show({
        type: 'warning',
        text1: 'Cảnh báo',
        text2: 'Nội dung thông báo không được để trống.',
      });
      return;
    }
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append("content", notification.content);

      // Thêm tệp mới
      newFiles.forEach(file => {
        formData.append("files", {
          uri: file.uri,
          name: file.name,
          type: "application/octet-stream",
        });
      });

      // Thêm danh sách tệp cũ còn giữ lại
      const keptOldFiles = (notification.fileUrl || []).filter(url => !removedOldFiles.includes(url));
      formData.append("keptOldFiles", JSON.stringify(keptOldFiles));

      const response = await fetch(`http://192.168.1.6:3000/notifications/${notificationId}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Thông báo đã được cập nhật!',
              });
        navigation.navigate("DetailClassroom", { classId })
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Không thể cập nhật thông báo.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Đã xảy ra lỗi khi lưu.',
      });
      console.error("❌ Lỗi khi cập nhật:", error);
    }
  };

  if (loading || !notification) {
    return (
      <View style={styles.loadingOverlay}>
    <ActivityIndicator size="large" color="#0961F5" />
    <Text style={{ marginTop: 10 }}>Đang chỉnh sửa thông báo...</Text>
  </View>
    );
  }
  const fileListData = [
    ...(notification.fileUrl || [])
      .filter(url => !removedOldFiles.includes(url))
      .map(url => ({ type: 'old', url })),
    ...newFiles.map((file, index) => ({ type: 'new', file, index })),
  ];
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Chỉnh sửa thông báo</Text>
        <TouchableOpacity style={styles.buttonheader} onPress={handleSave}>
          <Text style={styles.buttonText}>Lưu</Text>
        </TouchableOpacity>
      </View>

      <FlatList
  contentContainerStyle={{ padding: 10, paddingBottom: 30 }}
  data={['input', 'button', ...fileListData]}
  keyExtractor={(_, index) => index.toString()}
  renderItem={({ item }) => {
    if (item === 'input') {
      return (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.attachTextb}
            placeholder='Thông báo tin gì cho lớp'
            value={notification.content}
            onChangeText={(text) => setNotification({ ...notification, content: text })}
            multiline
            textAlignVertical='top'
          />
        </View>
      );
    }

    if (item === 'button') {
      return (
        <TouchableOpacity style={styles.inputRow} onPress={pickNewFile}>
          <Ionicons name="attach" size={30} color="#333" />
          <Text style={styles.attachText}>Thêm tệp đính kèm</Text>
        </TouchableOpacity>
      );
    }

    if (item.type === 'old') {
      const fileName = item.url.split(/[\\/]/).pop();
      return (
        <View style={styles.fileItem}>
          {getFileIcon(fileName)}
          <Text style={styles.fileName} numberOfLines={1}>{fileName}</Text>
          <TouchableOpacity onPress={() => removeOldFile(item.url)}>
            <Ionicons name="close-circle" size={30} color="red" />
          </TouchableOpacity>
        </View>
      );
    }

    if (item.type === 'new') {
      return (
        <View style={styles.fileItem}>
          {getFileIcon(item.file.name)}
          <Text style={styles.fileName} numberOfLines={1}>{item.file.name}</Text>
          <TouchableOpacity onPress={() => removeNewFile(item.index)}>
            <Ionicons name="close-circle" size={30} color="red" />
          </TouchableOpacity>
        </View>
      );
    }

    return null;
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
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', fontFamily: "Jost_400Regular" },
  inputContainer: {padding: 10},
  inputRow: {
    flexDirection: 'row',
    color: '#333',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#0961F5',
    backgroundColor: '#fff',
    borderRadius: 30,
    marginTop: 10
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
export default EditNotifyScreen;
