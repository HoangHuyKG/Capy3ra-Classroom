import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import Header from './Header';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';

const DetailExercise = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const classId = route.params?.classId; // Nhận classId từ params

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [points, setPoints] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleCreateExercise = async () => {
        if (!title) {
            Alert.alert("Lỗi", "Tiêu đề bài tập là bắt buộc!");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("points", points);
        formData.append("dueDate", dueDate);
        formData.append("classId", classId);

        // Thêm các tệp đã chọn vào formData
        selectedFiles.forEach((file) => {
            formData.append("files", {
                uri: file.uri,
                name: file.name,
                type: "application/octet-stream", // Hoặc loại MIME phù hợp
            });
        });

        try {
            const response = await axios.post('http://10.0.2.2:3000/create-exercise', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Alert.alert("Thành công", response.data.message);
            navigation.navigate("GiveExercise", { activeTab: 'clipboard', classId });
        } catch (error) {
            console.error("Lỗi khi tạo bài tập:", error);
            Alert.alert("Lỗi", "Không thể tạo bài tập. Vui lòng thử lại.");
        }
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

    const removeFile = (index) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("GiveExercise", { activeTab: 'clipboard', classId })}>
                    <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#5f6368" />
                </TouchableOpacity>
                <Text style={styles.title}>Tạo bài tập cho lớp</Text>
                <TouchableOpacity style={styles.buttonheader} onPress={handleCreateExercise}>
                    <Text style={styles.buttonText}>Giao</Text>
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
                        style={[styles.input]}
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
        width: '100%',
    },
    title: {
        fontSize: 20,
        color: '#5f6368',
        fontFamily: "Nunito_400Regular"
    },
    buttonheader: {
        color: '#fff',
        backgroundColor: '#0641F0',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: "Nunito_400Regular",
        fontWeight: 'semibold'
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
    fileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    fileName: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
        width: '80%',
    },
});

export default DetailExercise;