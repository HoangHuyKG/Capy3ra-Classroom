import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import Header from './Header';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-toast-message';
import * as DocumentPicker from 'expo-document-picker';

const EditExercise = (props: any) => {
    const {navigation} = props;
    const route = useRoute();
    const { exerciseId, classId } = route.params;
    const [selectedFiles, setSelectedFiles] = useState([]);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [points, setPoints] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [fileUrls, setFileUrls] = useState([]);
    const [dueDateISO, setDueDateISO] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    useEffect(() => {
        if (exerciseId) {
            const fetchExercise = async () => {
                try {
                    const response = await axios.get(`http://10.10.10.10:3000/exercises/${exerciseId}`);
                    
                    const exercise = response.data;
                    const dateObj = new Date(exercise.dueDate);
                    setDueDate(dateObj.toLocaleString('vi-VN'));
                    setDueDateISO(dateObj.toISOString()); 
    
                    setTitle(exercise.title);
                    setDescription(exercise.description);
                    setPoints(exercise.points?.toString() || '');
                    setFileUrls(exercise.fileUrls);
                } catch (error) {
                    console.error("Lỗi khi lấy bài tập:", error);
                    Toast.show({
                        type: 'error',
                        text1: 'Lỗi',
                        text2: 'Không thể lấy thông tin bài tập.',
                    });
                }
            };
    
            fetchExercise();
        }
    }, [exerciseId]);
    

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({});
            if (!result.canceled) {
                setSelectedFiles([...selectedFiles, result.assets[0]]);
            }
        } catch (err) {
            console.error("Lỗi chọn file:", err);
        }
    };

    const handleUpdateExercise = async () => {
        if (!title.trim()) {
            Toast.show({
                type: 'warning',
                text1: 'Cảnh báo',
                text2: 'Tiêu đề bài tập không được để trống!',
            });
            return;
        }

        if (!dueDateISO) {
            Toast.show({
                type: 'warning',
                text1: 'Cảnh báo',
                text2: 'Vui lòng chọn ngày và giờ!',
            });
            return;
        }
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("points", points);
        formData.append("dueDate", dueDateISO);
        formData.append("classId", classId);
        formData.append("oldFileUrls", JSON.stringify(fileUrls));

        selectedFiles.forEach((file) => {
            formData.append("files", {
                uri: file.uri,
                name: file.name,
                type: file.mimeType || 'application/octet-stream',
            });
        });

        try {
            const response = await axios.put(`http://10.10.10.10:3000/exercises/${exerciseId}`, formData, {
                transformRequest: () => formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }

            });
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Bài tập đã được cập nhật thành công!',
            });
            navigation.navigate("GiveExercise", { activeTab: 'clipboard', classId });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể cập nhật bài tập. Vui lòng thử lại.',
            });
        }
    };


    const handleConfirm = (date) => {
        const now = new Date();
        if (date < now) {
            Toast.show({
                type: 'warning',
                text1: 'Cảnh báo',
                text2: 'Ngày tới hạn không thể là ngày hoặc giờ trong quá khứ!',
            });
            return;
        }

        const formatted = date.toLocaleString('vi-VN');
        setDueDate(formatted);
        setDueDateISO(date.toISOString());
        setDatePickerVisibility(false);
    };

    const removeOldFile = (index) => {
        setFileUrls(prev => prev.filter((_, i) => i !== index));
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const allFiles = [
        ...fileUrls.map((url, index) => ({
            type: 'old',
            name: url.split('\\').pop(), // chỉ lấy tên file cuối cùng
            fullPath: url,
            index
        })),
        ...selectedFiles.map((file, index) => ({
            type: 'new',
            name: file.name, // đã là tên file rồi
            fullPath: file.uri,
            index
        })),
    ];
    

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
                <TouchableOpacity onPress={() => navigation.navigate("GiveExercise", { activeTab: 'clipboard', classId: classId })}>
                    <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#5f6368" />
                </TouchableOpacity>
                <Text style={styles.title}>Chỉnh sửa bài tập</Text>
                <TouchableOpacity style={styles.buttonheader} onPress={handleUpdateExercise}>
                    <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
            </View>

            <FlatList
    data={[]} // Không có item chính
    keyExtractor={(item, index) => index.toString()}
    ListHeaderComponent={
        <>
            

            <View style={styles.inputContainer}>
                {/* Inputs */}
                <View style={styles.inputRow}>
                <MaterialCommunityIcons name="subtitles-outline" size={24} color="#333"  />
                    <TextInput
                        style={styles.input}
                        placeholder='Tiêu đề bài tập (bắt buộc)'
                        value={title}
                        onChangeText={setTitle}
                        placeholderTextColor="#333"
                    />
                </View>

                <View style={styles.inputRowc}>
    <MaterialCommunityIcons name="text-box-outline" size={24} color="#333" style={styles.descriptionIcon} />
    <TextInput
        style={styles.descriptionInput}
        placeholder="Nhập mô tả"
        multiline
        value={description}
        onChangeText={setDescription}
        placeholderTextColor="#333"
    />
</View>


                <View style={styles.inputRow}>
                <MaterialCommunityIcons name="trophy-outline" size={24} color="#333" />
                    <TextInput
                        style={styles.input}
                        placeholder='Điểm'
                        value={points}
                        onChangeText={setPoints}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputRowb}>
                <MaterialCommunityIcons name="calendar-blank-outline" size={24} color="#333"  />
                    <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={{ flex: 1 }}>
                        <Text style={styles.input}>{dueDate || 'Đặt ngày tới hạn'}</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="datetime"
                        locale="vi-VN"
                        onConfirm={handleConfirm}
                        onCancel={() => setDatePickerVisibility(false)}
                        minimumDate={new Date()}
                    />
                </View>

                <TouchableOpacity style={styles.inputRowb} onPress={pickDocument}>
                <MaterialCommunityIcons name="paperclip" size={24} color="#333"  />
                    <Text style={styles.attachText}>Thêm tệp đính kèm</Text>
                </TouchableOpacity>

                {allFiles.map((item, index) => (
                    <View key={`${item.type}-${index}`} style={styles.fileItem}>
                        {getFileIcon(item.name)}
                        <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
                        <TouchableOpacity onPress={() => {
                            if (item.type === 'old') {
                                removeOldFile(item.index);
                            } else {
                                removeFile(item.index);
                            }
                        }}>
                            <Ionicons name="close-circle" size={30} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </>
    }
    contentContainerStyle={{ paddingBottom: 10 }}
/>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7f3ff',
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
    inputRowc: {
        flexDirection: 'row',
        alignItems: 'flex-start', // đảm bảo input bắt đầu từ trên
        padding: 20,
        borderWidth: 1,
        borderColor: '#0961F5',
        backgroundColor: '#fff',
        borderRadius: 30,
        marginTop: 20,
    },
    descriptionInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: "Jost_400Regular",
        fontWeight: 'bold',
        color: '#333',
        minHeight: 200, // để nhìn thoáng, bạn có thể tăng giảm
        textAlignVertical: 'top',
        marginLeft: 10, // để tránh dính vào icon
    },
    descriptionIcon: {
        marginTop: 10, // đẩy icon xuống cho đều với dòng đầu tiên
    },
    
    
    title: {
        fontSize: 20,
        color: '#333',
        fontFamily: "Jost_400Regular",
        fontWeight: 'bold',

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
    inputContainer: {
        padding: 10,
    },
    inputRow: {
        flexDirection: 'row',
        color: '#333',
        alignItems: 'center',
        padding: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#0961F5',
        backgroundColor: '#fff',
        borderRadius: 30,
        marginTop: 10
      },
    inputRowb: {
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
    input: {
        marginLeft: 10,
        fontSize: 16,
        flex: 1,
        fontFamily: "Jost_400Regular",
        fontWeight: 'bold'

    },
    attachText: {
        marginLeft: 5,
        fontSize: 16,
        color: '#333',
        fontFamily: "Jost_400Regular",
        width: '100%',
        fontWeight: 'bold'
    },
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
});

export default EditExercise;