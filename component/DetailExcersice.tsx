import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, FlatList, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DetailExercise = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const classId = route.params?.classId;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [points, setPoints] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [dueDate, setDueDate] = useState('');
    const [dueDateISO, setDueDateISO] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);



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



    const handleCreateExercise = async () => {
        if (!title) {
            Toast.show({
                type: 'warning',
                text1: 'Cảnh báo',
                text2: 'Tiêu đề bài tập là bắt buộc!',
            });
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("points", points);
        formData.append("dueDate", dueDateISO);
        formData.append("classId", classId);

        selectedFiles.forEach((file) => {
            formData.append("files", {
                uri: file.uri,
                name: file.name,
                type: "application/octet-stream",
            });
        });

        try {
            const response = await axios.post('http://10.10.10.10:3000/create-exercise', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: response.data.message,
            });
            navigation.navigate("GiveExercise", { activeTab: 'clipboard', classId });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể tạo bài tập. Vui lòng thử lại.',
            });
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
    const renderInputRow = ({ icon, placeholder, value, onChangeText, multiline, numberOfLines, style, iconStyle }) => (
        <View style={[styles.inputRow, style]}>
            <View style={[{ marginTop: multiline ? 5 : 0 }, iconStyle]}>
                {icon}
            </View>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                multiline={multiline}
                numberOfLines={numberOfLines}
                textAlignVertical={multiline ? 'top' : 'center'}
                placeholderTextColor="#333"
            />
        </View>
    );



    return (
        <FlatList
            style={styles.container}
            data={['dummy']}
            keyExtractor={(item, index) => index.toString()}
            renderItem={() => (
                <View>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.navigate("GiveExercise", { activeTab: 'clipboard', classId: classId })}>
                            <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Tạo bài tập cho lớp</Text>
                        <TouchableOpacity style={styles.buttonheader} onPress={handleCreateExercise}>
                            <Text style={styles.buttonText}>Giao</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        {renderInputRow({
                            icon: <MaterialCommunityIcons name="subtitles-outline" size={24} color="#333" />,
                            placeholder: 'Tiêu đề bài tập (bắt buộc)',
                            value: title,
                            onChangeText: setTitle,
                            multiline: true,
                            numberOfLines: 3,
                            style: styles.inputRow,
                            iconStyle: { marginTop: 0 },


                        })}
                        {renderInputRow({
                            icon: <MaterialCommunityIcons name="text-box-outline" size={24} color="#333" />,
                            placeholder: "Nhập mô tả",
                            value: description,
                            onChangeText: setDescription,
                            multiline: true,
                            numberOfLines: 8,
                            style: styles.inputRowc,
                            iconStyle: { marginTop: 10 },
                        })}


                        {renderInputRow({
                            icon: <MaterialCommunityIcons name="trophy-outline" size={24} color="#333" />,
                            placeholder: 'Điểm',
                            value: points,
                            onChangeText: setPoints,
                            multiline: false,
                            numberOfLines: 1,
                            style: styles.inputRow,
                            iconStyle: { marginTop: 0 },


                        })}
                        <View style={styles.inputRowb}>
                            <MaterialCommunityIcons name="calendar-blank-outline" size={24} color="#333" />
                            <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={{ flex: 1 }}>

                                <Text style={styles.input}>
                                    {dueDate || 'Đặt ngày tới hạn'}
                                </Text>
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
                            <MaterialCommunityIcons name="paperclip" size={24} color="#333" />
                            <Text style={styles.attachText}>Thêm tệp đính kèm</Text>
                        </TouchableOpacity>
                        <FlatList
                            data={selectedFiles}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View style={styles.fileItem}>
                                    {getFileIcon(item.name)}
                                    <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
                                    <TouchableOpacity onPress={() => removeFile(index)}>
                                        <Ionicons name="close-circle" size={24} color="red" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>
                </View>
            )}
        />
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
    title: {
        fontSize: 20,
        color: '#333',
        fontFamily: "Jost_400Regular",
        fontWeight: 'bold'
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
        marginTop: 10,
        fontFamily: "Jost_400Regular",
        fontWeight: 'bold',

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
        marginTop: 10,
        fontFamily: "Jost_400Regular",
        fontWeight: 'bold',

    },
    inputRowc: {
        flexDirection: 'row',
        alignItems: 'flex-start', // quan trọng để TextInput bắt đầu từ trên
        padding: 20,
        borderWidth: 1,
        borderColor: '#0961F5',
        backgroundColor: '#fff',
        borderRadius: 30,
        marginTop: 20,
        minHeight: 300, // đủ cao để nhập mô tả
    },

    input: {
        marginLeft: 10,
        fontSize: 16,
        flex: 1,
        fontFamily: "Jost_400Regular",
        fontWeight: 'bold',
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

export default DetailExercise;
