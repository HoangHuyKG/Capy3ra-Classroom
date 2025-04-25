import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const EditClassInfoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { classId } = route.params || {};
  const [showPassword, setShowPassword] = useState(false);
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classId) {
      fetch(`http://192.168.1.6:3000/class/${classId}`)
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

  const handleSave = async () => {
    if (!classInfo?.code) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Mã lớp không được để trống!',
      });
      return;
    }
    if (!classInfo?.name) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Tên lớp không được để trống!',
      });
      return;
    }
    try {
      const response = await fetch(`http://192.168.1.6:3000/class/${classId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classInfo)
      });
      const data = await response.json();
      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Cập nhật lớp học thành công!',
        });
        navigation.navigate('ClassroomList', { classId });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: data.message || "Có lỗi xảy ra!",
        });
      }
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật lớp học:", error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể cập nhật lớp học!',
      });
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa lớp học này không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa", style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`http://192.168.1.6:3000/class/${classId}`, { method: "DELETE" });
              if (response.status === 200) {
                Toast.show({
                  type: 'success',
                  text1: 'Thành công',
                  text2: 'Lớp học đã bị xóa!',
                });
                navigation.navigate('ClassroomList', { classId });
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Lỗi',
                  text2: 'Không thể xóa lớp học!',
                });
              }
            } catch (error) {
              console.error("❌ Lỗi khi xóa lớp học:", error);
              Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể xóa lớp học!',
              });
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0961F5" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#333" />
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
        {/* Mã lớp */}
        <View style={styles.inputWithIcon}>
          <MaterialCommunityIcons name="key-outline" size={24} color="#333" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder='Mã lớp (bắt buộc)'
            value={classInfo?.code}
            onChangeText={(text) => setClassInfo({ ...classInfo, code: text })}
          />
        </View>

        {/* Tên lớp */}
        <View style={styles.inputWithIcon}>
          <MaterialCommunityIcons name="book-outline" size={24} color="#333" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder='Tên lớp (bắt buộc)'
            value={classInfo?.name}
            onChangeText={(text) => setClassInfo({ ...classInfo, name: text })}
          />
        </View>

        {/* Chủ đề */}
        <View style={styles.inputWithIcon}>
          <MaterialCommunityIcons name="tag-outline" size={24} color="#333" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder='Chủ đề'
            value={classInfo?.topic}
            onChangeText={(text) => setClassInfo({ ...classInfo, topic: text })}
          />
        </View>

        {/* Mô tả */}
        <View style={styles.inputWithIconMulti}>
          <MaterialCommunityIcons name="text-box-outline" size={24} color="#333" style={styles.icona} />
          <TextInput
            style={styles.textArea}
            numberOfLines={10}
            multiline={true}
            placeholder='Mô tả'
            value={classInfo?.description}
            onChangeText={(text) => setClassInfo({ ...classInfo, description: text })}
          />
        </View>

        {/* Mật khẩu */}
        <View style={styles.inputWithIcon}>
          <MaterialCommunityIcons name="lock-outline" size={24} color="#333" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            value={classInfo?.password}
            secureTextEntry={!showPassword}
            onChangeText={(text) => setClassInfo({ ...classInfo, password: text })}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialCommunityIcons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#5f6368" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e7f3ff' },
  containersmall: { padding: 10 },
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
  title: { fontSize: 20, color: '#333', fontWeight: 'bold' },
  buttonContainer: { flexDirection: "row", gap: 10 },
  buttonSave: { backgroundColor: "#0961F5", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  deleteButton: { backgroundColor: "#D9534F", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0961F5',
    backgroundColor: '#fff',
    borderRadius: 30,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  inputWithIconMulti: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#0961F5',
    backgroundColor: '#fff',
    borderRadius: 30,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    height: 150,
    textAlignVertical: 'top'
  },
  icon: {
    marginRight: 10,
    marginTop: 4
  },
  icona: {
    marginRight: 10,
    marginTop: 10
  }
});

export default EditClassInfoScreen;
