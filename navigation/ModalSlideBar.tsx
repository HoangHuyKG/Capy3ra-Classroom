import React, { useEffect, useRef } from "react";
import { Modal, View, Text, TouchableOpacity, Image, StyleSheet, Animated, FlatList } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from "@react-navigation/native";

const CustomModalMenu = ({ visible, onClose }) => {
    const slideAnim = useRef(new Animated.Value(-200)).current;
  const navigation = useNavigation();

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: -200,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const courses = [
        "Lập trình di động",
        "Lập trình web",
        "Trí tuệ nhân tạo",
        "Phát triển phần mềm",
        "Hệ thống nhúng",
        "Khoa học dữ liệu",
        "An toàn thông tin",
        "Lập trình Python",
        "Phân tích dữ liệu",
        "Máy học"
    ];

    return (
        <Modal transparent={true} visible={visible} onRequestClose={onClose} statusBarTranslucent={true}>
            <View style={styles.container}>
                <Animated.View style={[styles.modalContent, { transform: [{ translateX: slideAnim }] }]}>
                    <View style={styles.boxlogo}>
                        <Image style={styles.imagelogo} source={require("../assets/images/logo.png")} />
                        <Text style={styles.title}>Capy3ra Classroom</Text>
                    </View>

                    <TouchableOpacity style={styles.menuItem} onPress={()=> navigation.navigate("ClassroomList")}>
                        <Feather name="home" size={24} color="black" />
                        <Text style={styles.menuText}>Lớp học</Text>
                    </TouchableOpacity>

                    <Text style={styles.subTitle}>Đang giảng dạy</Text>
                    <FlatList
                        data={courses}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.boxitem}>
                                <Image style={styles.imagelogo} source={{ uri: "https://picsum.photos/800/600?random=58" }} />
                                <Text style={styles.course} numberOfLines={1} ellipsizeMode="tail">{item}</Text>
                            </TouchableOpacity>
                        )}
                    />

                    <TouchableOpacity style={styles.menuItem}>
                        <Feather name="settings" size={24} color="black" />
                        <Text style={styles.menuText}>Cài đặt chung</Text>
                    </TouchableOpacity>

                    <View style={styles.profileSection}>
                        <Image style={styles.imageuser} source={require("../assets/images/usernobackgr.jpg")} />
                        <View>
                            <Text style={styles.profileName}>Thành Võ</Text>
                            <Text style={styles.profileEmail}>hoangthanh@gmail.com</Text>
                        </View>
                    </View>

                    <TouchableOpacity>
                        <Text style={styles.switchAccount}>Chuyển đổi tài khoản</Text>
                    </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}></TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
    },
    boxitem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    modalContent: {
        width: "75%",
        height: "100%",
        backgroundColor: "#fff",
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    overlay: {
        width: "25%",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    title: { fontSize: 18, fontWeight: 'semibold', marginBottom: 10, fontFamily: "Nunito_400Regular" },
    subTitle: { color: "#666", marginTop: 10, marginBottom: 5, fontFamily: "Nunito_400Regular" },
    menuItem: { paddingVertical: 20, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderTopWidth: 1, borderColor: '#ddd'},
    menuText: { fontSize: 18, marginLeft: 20, fontFamily: "Nunito_400Regular" },
    course: { fontSize: 16, color: "#333", marginBottom: 5, fontFamily: "Nunito_400Regular", paddingVertical: 20 },
    profileSection: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    profileName: { fontWeight: "bold", fontSize: 16, fontFamily: "Nunito_400Regular" },
    profileEmail: { color: "#555", fontFamily: "Nunito_400Regular" },
    switchAccount: { color: "blue", textDecorationLine: "underline", fontFamily: "Nunito_400Regular" },
    imagelogo: { width: 40, height: 40, marginRight: 10, borderRadius: 20},
    boxlogo: { flexDirection: "row", alignItems: "center"},
    imageuser: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
});

export default CustomModalMenu;