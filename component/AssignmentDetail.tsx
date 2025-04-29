import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ScrollView, ActivityIndicator, Alert
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Linking } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';

const AssignmentDetail = (props: any) => {
    const { navigation } = props;
    const route = useRoute();
    const [assignment, setAssignment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [submittedFiles, setSubmittedFiles] = useState<{ name: string, uri: string }[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<{ name: string, url: string }[]>([]);
    const [score, setScore] = useState<number | null>(null);
    const [comment, setComment] = useState<string>('');
    
    const exerciseId = route.params.exerciseId;
    const classId = route.params.classId;

    const SERVER_URL = 'http://10.10.10.10:3000/';

    useEffect(() => {
        const fetchUserFromStorage = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser !== null) {
                    const parsedUser = JSON.parse(storedUser);
                    setUserId(parsedUser._id);
                }
            } catch (error) {
                console.error('❌ Lỗi lấy user từ AsyncStorage:', error);
            }
        };
        fetchUserFromStorage();
    }, []);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}exercises/${exerciseId}`);
                setAssignment(response.data);
            } catch (error) {
                console.error('Error fetching assignment:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignment();
    }, [exerciseId]);

    useEffect(() => {
        if (userId) {
            fetchUploadedFiles();
        }
    }, [userId]);

    const fetchUploadedFiles = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}submitted-files`, {
                params: {
                    userId,
                    exerciseId,
                },
            });
    
            const filesWithId = response.data.files.map((file: any) => ({
                id: file._id,
                name: file.name,
                url: file.url,
                score: file.score,
                comment: file.comment,
            }));
    
            setUploadedFiles(filesWithId);
    
            if (filesWithId.length > 0) {
                // Lấy nhận xét và điểm của bài nộp mới nhất
                const latestSubmission = filesWithId[filesWithId.length - 1];
                setScore(latestSubmission.score);
                setComment(latestSubmission.comment);
            } else {
                setScore(null);
                setComment('');
            }
        } catch (error) {
            console.error('❌ Lỗi lấy file đã nộp:', error);
        }
    };
    
    

    const handleRemoveFile = (indexToRemove: number) => {
        setSubmittedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    const getFileIcon = (filename: string) => {
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

    const handleAddAssignment = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: "*/*", multiple: false });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                setSubmittedFiles(prev => [...prev, { name: file.name, uri: file.uri }]);
            }
        } catch (error) {
            console.error('❌ Error picking file:', error);
            alert("Lỗi khi chọn file.");
        }
    };

    const handleSubmitAssignment = async () => {
        if (submittedFiles.length === 0) {
            alert("Bạn cần chọn ít nhất 1 file để nộp.");
            return;
        }

        if (!userId) {
            alert("Không tìm thấy thông tin người dùng.");
            return;
        }

        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("classId", classId);
        formData.append("exerciseId", exerciseId);
        formData.append("submittedAt", new Date().toISOString());

        for (const file of submittedFiles) {
            const fileUri = file.uri;
            formData.append("file", {
                uri: fileUri,
                name: file.name,
                type: "application/octet-stream",
            } as any);
        }

        try {
            const response = await axios.post(`${SERVER_URL}submit-exercise`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert("Nộp bài thành công!");
            setSubmittedFiles([]);
            fetchUploadedFiles();
            navigation.goBack();
        } catch (error) {
            console.error('❌ Lỗi nộp bài:', error);
            alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.");
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#00695C" />
            </View>
        );
    }
    

    // Sửa đổi hàm handleDeleteSubmission
    const handleDeleteSubmission = (submissionId: string) => {
        // Hiển thị hộp thoại xác nhận
        Alert.alert(
            "Xóa bài nộp",
            "Bạn có chắc chắn muốn xóa bài nộp này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await axios.delete(`${SERVER_URL}delete-submission/${submissionId}`);
                            alert("Đã xóa bài nộp!");
                            fetchUploadedFiles(); // refresh lại danh sách
                        } catch (error) {
                            console.error('❌ Lỗi xóa bài nộp:', error);
                            alert("Có lỗi khi xóa bài nộp.");
                        }
                    }
                }
            ]
        );
    };
    
    
    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.titlea}>Chi tiết bài tập</Text>
                    <TouchableOpacity style={styles.buttonheader} onPress={handleSubmitAssignment}>
                        <Text style={styles.buttonText}>Nộp</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.containersmall}>
                    <Text style={styles.title}>{assignment.title}</Text>
                    <Text style={styles.points}>{assignment.points} điểm</Text>

                    <View style={styles.commentBox}>
                        <Text style={styles.commentText}>{assignment.description}</Text>
                    </View>

                    <View style={styles.attachmentContainer}>
                        <Text style={styles.attachmentTitle}>Tệp đính kèm</Text>
                        {assignment.fileUrls && assignment.fileUrls.length > 0 ? (
                            assignment.fileUrls.map((fileUrl: string, index: number) => {
                                const formattedUrl = fileUrl.startsWith('http')
                                    ? fileUrl
                                    : `${SERVER_URL}${fileUrl.replace(/\\/g, '/')}`;

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.fileBox}
                                        onPress={() => Linking.openURL(formattedUrl).catch(err => console.error("Can't open file:", err))}
                                    >
                                        {getFileIcon(fileUrl)}
                                        <Text style={styles.fileName} numberOfLines={1}>
                                            {fileUrl.split('\\').pop()}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })
                        ) : (
                            <Text>Không có tệp đính kèm.</Text>
                        )}
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Ngày đến hạn:{assignment.dueDate ? ` ${new Date(assignment.dueDate).toLocaleString()}` : ' Không có ngày đến hạn'}
                        </Text>

                        <TouchableOpacity style={styles.addButton} onPress={handleAddAssignment}>
                            <Text style={styles.addButtonText}>Thêm bài tập</Text>
                        </TouchableOpacity>

                        {submittedFiles.map((file, index) => (
                            <View key={index} style={[styles.fileBox, { borderColor: '#0961F5' }]}>
                                {getFileIcon(file.name)}
                                <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                                <TouchableOpacity onPress={() => handleRemoveFile(index)}>
                                    <Ionicons name="close-circle" size={30} color="red" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    <Text style={styles.textgv}>File đã nộp: </Text>
                    {uploadedFiles.length > 0 ? (
                      uploadedFiles.map((file, index) => (
                        <View key={index} style={[styles.fileBox, { borderColor: '#0961F5' }]}>
                            <TouchableOpacity
                                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                                onPress={() => Linking.openURL(`${SERVER_URL}${file.url.replace(/\\/g, '/')}`)}
                            >
                                {getFileIcon(file.name)}
                                <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                            </TouchableOpacity>
                    
                            <TouchableOpacity onPress={() => handleDeleteSubmission(file.id)}>
                                <Ionicons name="trash-bin" size={28} color="red" />
                            </TouchableOpacity>
                        </View>
                    ))
                    
                    ) : (
                        <Text>Chưa có file nộp.</Text>
                    )}

<Text style={styles.textgv}>Nhận xét của giáo viên:</Text>
<Text style={styles.commentText}>{comment || 'Chưa có nhận xét.'}</Text>

<Text style={styles.textgv}>Điểm của bạn:</Text>
<Text style={styles.commentText}>{score !== null ? `${score} điểm` : 'Chưa có điểm.'}</Text>

                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7f3ff',
        paddingBottom: 20,
    },
    scrollViewContainer: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#ffffff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    titlea: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    buttonheader: {
        backgroundColor: '#0961F5',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    containersmall: {
        paddingHorizontal: 20,
        paddingTop: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0961F5',
        marginBottom: 5,
    },
    points: {
        fontSize: 16,
        color: '#4B5563',
    },
    commentBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    commentText: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 22,
    },
    attachmentContainer: {
        marginTop: 25,
    },
    attachmentTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    fileBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 30,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
    },
    fileName: {
        marginLeft: 10,
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
        flex: 1,
    },
    footer: {
        marginTop: 30,
    },
    footerText: {
        fontSize: 15,
        color: '#555',
        marginBottom: 15,
    },
    addButton: {
        backgroundColor: '#10B981',
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 20,
    },
    addButtonText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textgv: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 15,
        color: '#374151',
    },
});

export default AssignmentDetail;
