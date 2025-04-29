import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ImageBackground, ActivityIndicator, Alert, Linking } from 'react-native';
import { Menu, Divider, Provider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from './Header';
import FooterBar from '../navigation/FooterBar';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailClassroom = () => {
    const route = useRoute();
    const activeTab = route.params?.activeTab || 'message';
    const classId = route.params?.classId;
    const navigation = useNavigation();

    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleMenu, setVisibleMenu] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [userImage, setUserImage] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        if (classId) {
            fetchClassDetails();
            fetchNotifications();
        }
    }, [classId]);

    useEffect(() => {
        if (classData && classData.userId) {
            fetchUserImage(classData.userId);
        }
    }, [classData]);

    const fetchClassDetails = async () => {
        try {
            const response = await axios.get(`http://10.10.10.10:3000/class/${classId}`);
            setClassData(response.data);
        } catch (error) {
            if (!classId) {
                setError("Lỗi: Không có classId!");
                setLoading(false);
                return;
            }
            
            console.error("❌ Lỗi khi lấy dữ liệu lớp học:", error);
            console.log("📌 classId từ route:", classId);
            setError("Không thể tải dữ liệu lớp học.");
        } finally {
            setLoading(false);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`http://10.10.10.10:3000/notifications/class/${classId}`);
            setNotifications(response.data);
        } catch (error) {
            console.error("❌ Lỗi khi lấy dữ liệu thông báo:", error);
            setError("Không thể tải dữ liệu thông báo.");
        }
    };

    const fetchUserImage = async (userId) => {
        try {
            const response = await axios.get(`http://10.10.10.10:3000/user/${userId}`);
            const user = response.data;
            if (user && user.image) {
                setUserImage(user.image);
            } else {
                setUserImage(null);
            }
        } catch (error) {
            console.error('❌ Lỗi khi tải ảnh người dùng:', error);
            setUserImage(null);
        }
    };

    const openFile = async (fileUrl) => {
        try {
            const formattedUrl = fileUrl.replace(/\\/g, '/');
            const fullUrl = `http://10.10.10.10:3000/${formattedUrl}`;
            const supported = await Linking.canOpenURL(fullUrl);
            if (supported) {
                await Linking.openURL(fullUrl);
            } else {
                Alert.alert("Không thể mở file", "Thiết bị không hỗ trợ mở loại tệp này.");
            }
        } catch (error) {
            console.error("❌ Lỗi khi mở file:", error);
            Alert.alert("Lỗi", "Không thể mở file.");
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchClassDetails();
        await fetchNotifications();
        setRefreshing(false);
    };

    const openMenu = (id) => setVisibleMenu(id);
    const closeMenu = () => setVisibleMenu(null);

    const handleMenuItemPress = (action, id) => {
        if (action === "Xóa") {
            Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa thông báo này?", [
                { text: "Hủy", style: "cancel" },
                { text: "Xóa", onPress: () => deleteNotification(id) }
            ]);
        } else {
            closeMenu();
        }
    };

    const deleteNotification = async (id) => {
        try {
            await axios.delete(`http://10.10.10.10:3000/notifications/${id}`);
            await fetchNotifications();
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Thông báo đã được xóa!',
            });
        } catch (error) {
            console.error("❌ Lỗi khi xóa thông báo:", error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Xảy ra lỗi khi xóa thông báo!',
            });
        } finally {
            closeMenu();
        }
    };

    const getFileIcon = (filename) => {
        const extension = filename.split('.').pop().toLowerCase();
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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Đang tải...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <Provider>
            <View style={styles.container}>
                <Header />
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
                    contentContainerStyle={{ paddingBottom: 70, paddingHorizontal: 10 }}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    ListHeaderComponent={
                        <View style={styles.containersmall}>
                            <ImageBackground
                                source={{ uri: classData?.imageUrl || 'https://via.placeholder.com/800x600' }}
                                style={styles.card}
                                imageStyle={{ borderRadius: 10 }}
                            >
                                <View style={styles.overlay}>
                                    <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                                        {classData?.name || "Không có tên"}
                                    </Text>
                                </View>
                            </ImageBackground>

                            <TouchableOpacity style={styles.notify} onPress={() => navigation.navigate("PostNotificationScreen", { classId })}>
                                <Image
                                    style={styles.imageuser}
                                    source={
                                        userImage
                                        ? { uri: userImage }
                                        : require("../assets/images/usernobackgr.png")
                                    }
                                    />
                                <Text style={styles.notifytext}>Thông báo tin gì đó cho lớp</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.cardtach}>
                            <View style={styles.cardtop}>
                                <View style={styles.cardtopa}>
                                    <Image
                                        style={styles.imageuser}
                                        source={
                                            userImage
                                            ? { uri: userImage }
                                            : require("../assets/images/usernobackgr.png")
                                        }
                                    />
                                    <Text style={styles.textcardname}>{item.username ?? "Người dùng"}</Text>
                                </View>
                                {classData?.userId === item.userId && (
                                    <Menu
                                        contentStyle={styles.menu}
                                        visible={visibleMenu === item._id}
                                        onDismiss={closeMenu}
                                        anchor={
                                            <TouchableOpacity onPress={() => openMenu(item._id)}>
                                                <Entypo name="dots-three-vertical" size={24} color="#5f6368" />
                                            </TouchableOpacity>
                                        }
                                    >
                                        <Menu.Item onPress={() => navigation.navigate("EditNotifyScreen", { notificationId: item._id, classId })} title="Chỉnh sửa" />
                                        <Divider />
                                        <Menu.Item onPress={() => handleMenuItemPress("Xóa", item._id)} title="Xóa" />
                                    </Menu>
                                )}
                            </View>

                            <Text style={styles.textcard} selectable={true}>{item.content}</Text>

                            {item.fileUrl && Array.isArray(item.fileUrl) && item.fileUrl.length > 0 && (
                                <View>
                                    {item.fileUrl.map((file, index) => (
                                        <TouchableOpacity style={styles.buttonfile} key={index} onPress={() => openFile(file)}>
                                            {getFileIcon(file)}
                                            <Text style={styles.fileLink} numberOfLines={1} ellipsizeMode="tail">
                                                {file.split(/[\\/]/).pop()}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}
                />
                <FooterBar activeTab={activeTab} classId={classId} />
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e7f3ff' },
    containersmall: { flex: 1, backgroundColor: '#e7f3ff' },
    imageuser: { width: 50, height: 50, borderRadius: 25 },
    notify: {
        marginVertical: 10,
        marginBottom: 20,
        flexDirection: "row",
        backgroundColor: "#fff",
        width: "100%",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 10,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 10,
        justifyContent: 'center',
        alignContent: 'center',
        padding: 15,
    },

    cardTitle: {
        fontSize: 24,
        marginTop: 10,
        fontWeight: 'bold',
        color: "#fff",
        fontFamily: "Jost_400Regular",
        textAlign: 'center',
    },
    boxtext: {
        position: "absolute",
        bottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    card: {
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: "100%",
        height: 150,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginVertical: 10,
    },
    notifytext: { marginLeft: 10, fontSize: 16, fontWeight: "bold", color: '#333', fontFamily: "Jost_400Regular" },
    textcardname: { marginLeft: 20, fontSize: 16, fontWeight: "bold", fontFamily: "Jost_400Regular" },
    textcard: { marginTop: 20, fontSize: 16, fontWeight: "600", fontFamily: "Jost_400Regular", textAlign: 'justify' },
    cardtop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cardtopa: { flexDirection: 'row', alignItems: 'center' },
    menu: { backgroundColor: '#fff' },
    cardtach: {
        marginBottom: 15,
        padding: 15,
        backgroundColor: "#f9fbff",
        borderRadius: 10,
        borderLeftWidth: 5,
        borderLeftColor: "#007bff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 6,
    },

    buttonfile: {
        marginTop: 10,
        borderRadius: 30,
        padding: 8,
        borderWidth: 1,
        borderColor: '#0961F5',
        alignItems: 'center',
        flexDirection: 'row'
    },
    fileLink: {
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: "Jost_400Regular",
        marginLeft: 5,
        width: '90%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default DetailClassroom;
