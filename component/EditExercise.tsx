import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Header from './Header';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const EditExercise = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { exerciseId } = route.params; // Nhận exerciseId từ params
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [points, setPoints] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [fileUrls, setFileUrls] = useState([]);

    useEffect(() => {
        // Lấy thông tin bài tập hiện tại
        const fetchExercise = async () => {
            try {
                const response = await axios.get(`http://10.0.2.2:3000/exercises/${exerciseId}`);
                const exercise = response.data;
                setTitle(exercise.title);
                setDescription(exercise.description);
                setPoints(exercise.points.toString());
                setDueDate(exercise.dueDate);
                setFileUrls(exercise.fileUrls);
            } catch (error) {
                console.error("Lỗi khi lấy bài tập:", error);
                Alert.alert("Lỗi", "Không thể lấy thông tin bài tập.");
            }
        };

        fetchExercise();
    }, [exerciseId]);

    const handleUpdateExercise = async () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("points", points);
        formData.append("dueDate", dueDate);
        // Nếu bạn có tệp đính kèm, hãy thêm vào formData

        try {
            const response = await axios.put(`http://10.0.2.2:3000/exercises/${exerciseId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Alert.alert("Thành công", "Bài tập đã được cập nhật thành công!");
            navigation.navigate("GiveExercise", { activeTab: 'clipboard' });
        } catch (error) {
            console.error("Lỗi khi cập nhật bài tập:", error);
            Alert.alert("Lỗi", "Không thể cập nhật bài tập. Vui lòng thử lại.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("GiveExercise", { activeTab: 'clipboard' })}>
                    <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#5f6368" />
                </TouchableOpacity>
                <Text style={styles.title}>Chỉnh sửa bài tập</Text>
                <TouchableOpacity style={styles.buttonheader} onPress={handleUpdateExercise}>
                    <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
            </View>

            {/* Input Section */}
            <View style={styles.inputContainer}>
                <View style={styles.inputRow}>
                    <MaterialIcons name="subtitles" size={24} color="gray" />
                    <TextInput
                        style={styles.input}
                        placeholder='Tiêu đề bài tập (bắt buộc)'
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                
                <View style={styles.inputRow}>
                    <MaterialIcons name="description" size={24} color="gray" />
                    <TextInput
                        style={[                        styles.input]}
                        placeholder="Nhập mô tả"
                        multiline
                        numberOfLines={10}
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Ionicons name="trophy-outline" size={24} color="gray" />
                    <TextInput
                        style={styles.input}
                        placeholder='Điểm'
                        value={points}
                        onChangeText={setPoints}
                        keyboardType="numeric" // Chỉ cho phép nhập số
                    />
                </View>
                <View style={styles.inputRow}>
                    <FontAwesome name="calendar-plus-o" size={24} color="gray" />
                    <TextInput
                        style={styles.input}
                        placeholder='Đặt ngày tới hạn'
                        value={dueDate}
                        onChangeText={setDueDate}
                    />
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
    buttonheader: {
        color: '#fff',
        backgroundColor: '#0641F0',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'semibold',
    },
    title: {
        fontSize: 20,
        color: '#5f6368',
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
    },
    attachText: {
        marginLeft: 10,
        fontSize: 18,
        color: '#555',
        width: '100%'
    },
    fileUrl: {
      marginLeft: 10,
      fontSize: 16,
      color: '#007BFF', // Màu cho đường dẫn tệp
      textDecorationLine: 'underline', // Gạch chân đường dẫn
  },
});

export default EditExercise;