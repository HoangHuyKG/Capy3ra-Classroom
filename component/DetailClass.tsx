import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import { Menu, Divider, Provider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from './Header';
import FooterBar from '../navigation/FooterBar';
import Entypo from '@expo/vector-icons/Entypo';
import axios from 'axios';

// Mock dữ liệu thông báo
const notifications = [
    { id: '1', text: 'Thứ 2 thi giữa kỳ' },
    { id: '2', text: 'Thứ 3 nộp bài tập nhóm' },
    { id: '3', text: 'Thứ 4 có tiết học trực tuyến' },
    { id: '4', text: 'Thứ 5 deadline báo cáo thực hành' },
    { id: '5', text: 'Thứ 6 kiểm tra giữa kỳ' },
    { id: '6', text: 'Thứ 7 họp nhóm dự án' },
];

const DetailClassroom = () => {
    const route = useRoute();
    const activeTab = route.params?.activeTab || 'message'; 
    const classId = route.params?.classId;

    const navigation = useNavigation();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleMenu, setVisibleMenu] = useState(null); // ID của menu đang mở

    useEffect(() => {
        if (classId) {
            fetchClassDetails();
        }
    }, [classId]);

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

    const openMenu = (id) => setVisibleMenu(id);
    const closeMenu = () => setVisibleMenu(null);
    const handleMenuItemPress = (action, id) => {
        console.log(`${action} ${id}`);
        closeMenu(); 
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
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.cardtach}>
                                <View style={styles.cardtop}>
                                    <View style={styles.cardtopa}>
                                        <Image style={styles.imageuser} source={require("../assets/images/usernobackgr.jpg")} />
                                        <Text style={styles.textcardname}>Hoàng Gia Huy</Text>
                                    </View>
                                    <Menu
                                        contentStyle={styles.menu}
                                        visible={visibleMenu === item.id}
                                        onDismiss={closeMenu}
                                        anchor={
                                            <TouchableOpacity onPress={() => openMenu(item.id)}>
                                                <Entypo name="dots-three-vertical" size={24} color="#5f6368" />
                                            </TouchableOpacity>
                                        }
                                    >
                                        <Menu.Item onPress={() => navigation.navigate("EditNotifyScreen")} title="Chỉnh sửa" />
                                        <Divider />
                                        <Menu.Item onPress={() => handleMenuItemPress("Xóa", item.id)} title="Xóa" />
                                    </Menu>
                                </View>
                                <Text style={styles.textcard}>{item.text}</Text>
                            </View>
                        )}
                    />
                </View>
                 <FooterBar activeTab={activeTab} />
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
    }
});

export default DetailClassroom;
