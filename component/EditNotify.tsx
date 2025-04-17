import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, FlatList, Linking
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';

const EditNotifyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const notificationId = route.params?.notificationId;
  const [removedOldFiles, setRemovedOldFiles] = useState([]);

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
      const response = await axios.get(`http://10.0.2.2:3000/notifications/${notificationId}`);
      setNotification(response.data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy thông báo:", error);
      Alert.alert("Lỗi", "Không thể tải thông báo.");
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

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("content", notification.content);
  
      newFiles.forEach(file => {
        formData.append("files", {
          uri: file.uri,
          name: file.name,
          type: "application/octet-stream", // hoặc "application/pdf", "image/png" tùy loại
        });
      });
  
      const response = await fetch(`http://10.0.2.2:3000/notifications/${notificationId}`, {
        method: "PUT",
        body: formData,
        // ❌ KHÔNG thêm headers thủ công nhé!
      });
  
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Thành công", "Thông báo đã được cập nhật!");
        navigation.goBack();
      } else {
        Alert.alert("Lỗi", data.message || "Không thể cập nhật thông báo.");
      }
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi lưu.");
    }
  };
  
  if (loading || !notification) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#5f6368" />
        </TouchableOpacity>
        <Text style={styles.title}>Chỉnh sửa thông báo</Text>
        <TouchableOpacity style={styles.buttonheader} onPress={handleSave}>
          <Text style={styles.buttonText}>Lưu</Text>
        </TouchableOpacity>
      </View>

      {/* Nội dung chỉnh sửa */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <Ionicons name="menu-outline" size={30} color="gray" />
          <TextInput
            style={styles.input}
            placeholder='Thông báo tin gì cho lớp'
            value={notification.content}
            onChangeText={(text) => setNotification({ ...notification, content: text })}
            multiline
          />
        </View>

        {/* Chọn tệp mới */}
        <TouchableOpacity style={styles.inputRow} onPress={pickNewFile}>
          <Ionicons name="attach" size={30} color="gray" />
          <Text style={styles.attachText}>Chọn tệp đính kèm</Text>
        </TouchableOpacity>

        {/* Danh sách tệp (gồm tệp đã có và mới) */}
        <FlatList
         data={[
          ...(notification.fileUrl || [])
            .filter(url => !removedOldFiles.includes(url))  // ⚠️ Lọc ra các file chưa bị xoá
            .map((url) => ({ type: 'old', url })),
          ...newFiles.map((file, index) => ({ type: 'new', file, index })),
        ]}
        
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => {
            if (item.type === 'old') {
              const fileName = item.url.split(/[\\/]/).pop();
              return (
                <View style={styles.fileItem}>
                  <Ionicons name="document" size={24} color="gray" />
                  <Text style={styles.fileName} numberOfLines={1}>{fileName}</Text>
          
                  <TouchableOpacity onPress={() => removeOldFile(item.url)}>
  <Ionicons name="close-circle" size={24} color="red" />
</TouchableOpacity>

                  
                </View>
              );
            } else {
              return (
                <View style={styles.fileItem}>
                  <Ionicons name="document" size={24} color="gray" />
                  <Text style={styles.fileName} numberOfLines={1}>{item.file.name}</Text>
          
               
          
           
                  <TouchableOpacity onPress={() => removeNewFile(item.index)}>
                    <Ionicons name="close-circle" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              );
            }
          }}
          
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
  title: { fontSize: 20, color: '#5f6368', fontFamily: "Nunito_400Regular" },
  buttonheader: {
    backgroundColor: '#0641F0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'semibold' },
  inputContainer: {},
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  attachText: { marginLeft: 10, fontSize: 18, color: '#5f6368' },
  input: { marginLeft: 10, fontSize: 18, color: '#333', flex: 1 },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  fileName: { marginLeft: 10, fontSize: 16, color: '#333', flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButton: {
    marginRight: 10,
  },
  
});

export default EditNotifyScreen;
