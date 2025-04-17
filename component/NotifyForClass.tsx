import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import { Platform } from "react-native"; // ⚡️ Import Platform

const PostNotificationScreen = () => {
  const navigation = useNavigation();
  const [notificationMessage, setNotificationMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

      if (result.canceled) return;

      const fileUri = result.assets ? result.assets[0].uri : result.uri;
      const fileName = result.assets ? result.assets[0].name : result.name;

      setSelectedFiles([...selectedFiles, { name: fileName, uri: fileUri }]);
    } catch (error) {
      console.error("Lỗi khi chọn tệp:", error);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
        alert("Vui lòng chọn ít nhất một tệp để đính kèm.");
        return;
    }

    const formData = new FormData();

    // Thêm thông báo và classId vào formData
    formData.append("message", notificationMessage); // Sử dụng giá trị từ TextInput
    formData.append("classId", "67e79535ddff8af6822ac056"); // Thay thế bằng classId thực tế

    // Thêm các tệp đã chọn vào formData
    selectedFiles.forEach((file) => {
        formData.append("files", {
            uri: file.uri,
            name: file.name,
            type: "application/octet-stream", // Hoặc loại MIME phù hợp
        });
    });

    try {
        const response = await fetch("http://10.0.2.2:3000/upload", {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const data = await response.json();
        if (response.ok) {
            alert("Đăng thông báo thành công!");
            // Reset selectedFiles và notificationMessage nếu cần
            setSelectedFiles([]);
            setNotificationMessage("");

        } else {
            alert(data.message || "Đã xảy ra lỗi khi đăng thông báo.");
        }
    } catch (error) {
        console.error("Lỗi khi upload:", error);
        alert("Đã xảy ra lỗi khi upload tệp.");
    }
};





  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#5f6368" />
        </TouchableOpacity>
        <Text style={styles.title}>Thông báo cho lớp</Text>
        <TouchableOpacity style={styles.buttonheader} onPress={handleUpload}>
          <Text style={styles.buttonText}>Đăng</Text>
        </TouchableOpacity>

      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <Ionicons name="menu-outline" size={30} color="gray" />
          <TextInput
            style={styles.attachText}
            placeholder='Thông báo tin gì cho lớp'
            value={notificationMessage}
            onChangeText={setNotificationMessage} // Cập nhật state khi người dùng nhập
          />
        </View>

        <TouchableOpacity style={styles.inputRow} onPress={pickDocument}>
          <Ionicons name="attach" size={30} color="gray" />
          <Text style={styles.attachText}>Thêm tệp đính kèm</Text>
        </TouchableOpacity>

        {/* Hiển thị danh sách tệp đã chọn */}
        <FlatList
          data={selectedFiles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.fileItem}>
              <Ionicons name="document" size={24} color="gray" />
              <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
              <TouchableOpacity onPress={() => removeFile(index)}>
                <Ionicons name="close-circle" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
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
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  fileName: { marginLeft: 10, fontSize: 16, color: '#333', width: '80%' },
});

export default PostNotificationScreen;
