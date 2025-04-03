import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const EditClassInfoScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { classId } = route.params || {}; // Lấy classId từ navigation params
    const [showPassword, setShowPassword] = useState(false);
    const [classInfo, setClassInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (classId) {
            fetch(`http://10.0.2.2:3000/class/${classId}`)
                .then(response => response.json())
                .then(data => {
                    setClassInfo(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("❌ Lỗi khi lấy thông tin lớp:", error);
                    setLoading(false);
                });
        }
    }, [classId]);
    const handleDelete = async () => {
      Alert.alert(
          "Xác nhận",
          "Bạn có chắc chắn muốn xóa lớp học này không?",
          [
              { text: "Hủy", style: "cancel" },
              { 
                  text: "Xóa", 
                  style: "destructive", 
                  onPress: async () => {
                      try {
                          const response = await fetch(`http://10.0.2.2:3000/class/${classId}`, {
                              method: "DELETE",
                          });
  
                          if (response.status === 200) {
                              Alert.alert("Thành công", "Lớp học đã bị xóa!");
                              navigation.goBack();
                          } else {
                              Alert.alert("Lỗi", "Không thể xóa lớp học!");
                          }
                      } catch (error) {
                          console.error("❌ Lỗi khi xóa lớp học:", error);
                          Alert.alert("Lỗi", "Không thể xóa lớp học!");
                      }
                  }
              }
          ]
      );
  };
  
    const handleSave = async () => {
      if (!classInfo?.code) {
          Alert.alert("Lỗi", "Mã lớp không được để trống!");
          return;
      }
  
      if (!classInfo?.name) {
          Alert.alert("Lỗi", "Tên lớp không được để trống!");
          return;
      }
  
      try {
          const response = await fetch(`http://10.0.2.2:3000/class/${classId}`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  code: classInfo.code,
                  name: classInfo.name,
                  topic: classInfo.topic,
                  description: classInfo.description,
                  password: classInfo.password,
                  userId: classInfo.userId // Gửi userId để server kiểm tra
              })
          });
  
          const data = await response.json();
  
          if (response.status === 200) {
              Alert.alert("Thành công", "Cập nhật lớp học thành công!");
              navigation.goBack();
          } else if (response.status === 400) {
              Alert.alert("Lỗi", data.message || "Mã lớp học đã tồn tại!");
          } else {
              Alert.alert("Lỗi", data.message || "Có lỗi xảy ra!");
          }
      } catch (error) {
          console.error("❌ Lỗi khi cập nhật lớp học:", error);
          Alert.alert("Lỗi", "Không thể cập nhật lớp học!");
      }
  };
  

    if (loading) {
        return <ActivityIndicator size="large" color="#0641F0" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    return (
        <View style={styles.container}>
           <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#5f6368" />
    </TouchableOpacity>
    <Text style={styles.title}>Chỉnh sửa lớp</Text>
    <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
            <Text style={styles.buttonText}>Lưu</Text>
        </TouchableOpacity>
    </View>
</View>

            <View style={styles.containersmall}>
                <Text style={styles.label}>Mã lớp</Text>
                <TextInput 
                    style={styles.input}
                    value={classInfo?.code}
                    onChangeText={(text) => setClassInfo({ ...classInfo, code: text })}
                />

                <Text style={styles.label}>Tên lớp (bắt buộc)</Text>
                <TextInput
                    style={styles.input}
                    value={classInfo?.name}
                    onChangeText={(text) => setClassInfo({ ...classInfo, name: text })}
                />

                <Text style={styles.label}>Chủ đề</Text>
                <TextInput
                    style={styles.input}
                    value={classInfo?.topic}
                    onChangeText={(text) => setClassInfo({ ...classInfo, topic: text })}
                />

                <Text style={styles.label}>Mô tả</Text>
                <TextInput
                    style={styles.input}
                    value={classInfo?.description}
                    onChangeText={(text) => setClassInfo({ ...classInfo, description: text })}
                />

                <Text style={styles.label}>Mật khẩu lớp học</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        value={classInfo?.password}
                        secureTextEntry={!showPassword}
                        onChangeText={(text) => setClassInfo({ ...classInfo, password: text })}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <MaterialCommunityIcons name={showPassword ? "eye-off" : "eye"} size={24} color="#5f6368" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    containersmall: { padding: 20 },
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
    title: { fontSize: 20, color: '#5f6368' },
    buttonheader: { backgroundColor: '#0641F0', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'semibold' },
    label: { color: '#0641F0', fontSize: 16, marginBottom: 4 },
    input: { borderBottomWidth: 1, borderBottomColor: '#5f6368', fontSize: 16, marginBottom: 20, paddingVertical: 4 },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#5f6368',
        marginBottom: 20,
        paddingVertical: 4
    },
    passwordInput: {
        flex: 1,
        fontSize: 16
    },
    buttonContainer: {
      flexDirection: "row",
      gap: 10,
  },
  buttonSave: { 
      backgroundColor: "#0641F0", 
      paddingHorizontal: 20, 
      paddingVertical: 10, 
      borderRadius: 10 
  },
  deleteButton: { 
      backgroundColor: "#D9534F", 
      paddingHorizontal: 20, 
      paddingVertical: 10, 
      borderRadius: 10 
  },
  
});

export default EditClassInfoScreen;
