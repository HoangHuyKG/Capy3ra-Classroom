import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import { Menu, Divider, Provider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from './Header';
import FooterBar from '../navigation/FooterBar';
import Entypo from '@expo/vector-icons/Entypo';
import axios from 'axios';
import { Alert } from 'react-native';


const DetailClassroom = () => {
    const route = useRoute();
    const activeTab = route.params?.activeTab || 'message';
    const classId = route.params?.classId;

    const navigation = useNavigation();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleMenu, setVisibleMenu] = useState(null); // ID của menu đang mở
    const [notifications, setNotifications] = useState([]); // Thay đổi từ mock data
    const [refreshing, setRefreshing] = useState(false);


    useEffect(() => {
        setLoading(true); // Reset loading về true khi component được mount
        if (classId) {
            fetchClassDetails();
            fetchNotifications(); // Gọi hàm để lấy thông báo
        }
    }, [classId]);
    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`http://10.0.2.2:3000/notifications/class/${classId}`); // Thay localhost bằng IP máy thật
            setNotifications(response.data); // Giả sử response.data là mảng thông báo
        } catch (error) {
            console.error("❌ Lỗi khi lấy dữ liệu thông báo:", error);
            setError("Không thể tải dữ liệu thông báo.");
        }
    };
    const fetchClassDetails = async () => {
        try {
            const response = await axios.get(`http://10.0.2.2:3000/class/${classId}`); // Thay localhost bằng IP máy thật
            setClassData(response.data);
        } catch (error) {
            console.error("❌ Lỗi khi lấy dữ liệu lớp học:", error);
            setError("Không thể tải dữ liệu lớp học.");
        } finally {
            setLoading(false);
        }
    };
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchClassDetails(); // Gọi lại hàm để lấy thông tin lớp học
        await fetchNotifications(); // Gọi lại hàm để lấy thông báo
        setRefreshing(false);
    };
    const openMenu = (id) => setVisibleMenu(id);
    const closeMenu = () => setVisibleMenu(null);
    const handleMenuItemPress = (action, id) => {
        if (action === "Xóa") {
            Alert.alert(
                "Xác nhận xóa",
                "Bạn có chắc chắn muốn xóa thông báo này?",
                [
                    { text: "Hủy", style: "cancel" },
                    { text: "Xóa", onPress: () => deleteNotification(id) }
                ]
            );
        } else {
            closeMenu();
        }
    };
    
    const deleteNotification = async (id) => {
      

        try {
            await axios.delete(`http://10.0.2.2:3000/notifications/${id}`);
            await fetchNotifications();
             Alert.alert("Thành công", "Lớp học đã bị xóa!");
        } catch (error) {
            console.error("❌ Lỗi khi xóa thông báo:", error);
        } finally {
            closeMenu();
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
                <View style={styles.containersmall}>
                    <ImageBackground
                        source={{ uri: classData?.imageUrl || 'https://via.placeholder.com/800x600' }}
                        style={styles.card}
                        imageStyle={{ borderRadius: 10 }}
                    >
                        <View style={styles.boxtext}>
                            <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                                {classData?.name || "Không có tên"}
                            </Text>
                        </View>
                    </ImageBackground>

                    <View style={styles.notify}>
                        <Image style={styles.imageuser} source={require("../assets/images/usernobackgr.jpg")} />
                        <TouchableOpacity onPress={() => navigation.navigate("PostNotificationScreen", { classId })}>
                            <Text style={styles.notifytext}>Thông báo tin gì đó cho lớp</Text>
                        </TouchableOpacity>
                    </View>


                    <FlatList
                        nestedScrollEnabled={true}
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
                        data={notifications}
                        keyExtractor={(item) => item._id ? item._id.toString() : Math.random().toString()}
                        renderItem={({ item }) => (
                            <View style={styles.cardtach}>
                                <View style={styles.cardtop}>
                                    <View style={styles.cardtopa}>
                                        <Image style={styles.imageuser} source={require("../assets/images/usernobackgr.jpg")} />
                                        <Text style={styles.textcardname}>{item.userName ?? "Người dùng"}</Text>
                                    </View>
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
                                        <Menu.Item onPress={() => navigation.navigate("EditNotifyScreen", { notificationId: item._id })} title="Chỉnh sửa" />
                                        <Divider />
                                        <Menu.Item onPress={() => handleMenuItemPress("Xóa", item._id)} title="Xóa" />
                                    </Menu>
                                </View>
                                <View>
                                    <Text style={styles.textcard}>{item.content}</Text>
                                </View>
                                {item.fileUrl && Array.isArray(item.fileUrl) && item.fileUrl.length > 0 && (
                                    <TouchableOpacity onPress={() => { }}>
                                        <Text style={styles.fileLink}>Tệp đính kèm: {item.fileUrl[0].split('\\').pop()}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                        refreshing={refreshing} // Thêm thuộc tính refreshing
                        onRefresh={onRefresh} // Thêm hàm onRefresh
                    />
                </View>
                <FooterBar activeTab={activeTab} classId={classId} />
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    containersmall: { flex: 1, margin: 10 },
    banner: { width: '100%', height: 150, borderRadius: 10 },
    imageuser: { width: 50, height: 50, borderRadius: 25 },
    notify: {
        marginVertical: 10,
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
    cardTitle: {
        fontSize: 24,
        marginTop: 10,
        fontWeight: 'bold',
        color: "#fff",
        fontFamily: "Nunito_400Regular",
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
    notifytext: { marginLeft: 10, fontSize: 16, fontWeight: "600", color: '#5f6368', fontFamily: "Nunito_400Regular" },
    textcardname: { marginLeft: 10, fontSize: 16, fontWeight: "bold", fontFamily: "Nunito_400Regular" },
    textcard: { marginTop: 20, fontSize: 16, fontWeight: "600", fontFamily: "Nunito_400Regular" },
    cardtop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cardtopa: { flexDirection: 'row', alignItems: 'center' },
    menu: { backgroundColor: '#fff' },
    cardtach: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    fileLink: {
        marginTop: 5,
        fontSize: 14,
        color: '#0641F0', // Màu sắc cho liên kết
        textDecorationLine: 'underline', // Gạch chân để hiển thị như một liên kết
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default DetailClassroom;
