import React, { useEffect, useRef, useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Animated,
    FlatList,
    ActivityIndicator,
} from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const CustomModalMenu = ({ visible, onClose }) => {
    const slideAnim = useRef(new Animated.Value(-200)).current;
    const navigation = useNavigation();
    const [teachingClasses, setTeachingClasses] = useState([]);
    const [joinedClasses, setJoinedClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({ fullname: "Tên người dùng", email: "Email" });

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
            }
        };

        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
            fetchUserInfo();
            fetchClasses();
        } else {
            Animated.timing(slideAnim, {
                toValue: -200,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const userData = await AsyncStorage.getItem('user');
            if (!userData) {
                setTeachingClasses([]);
                setJoinedClasses([]);
                setLoading(false);
                return;
            }

            const user = JSON.parse(userData);
            const userId = user._id;

            try {
                const teachingClassesResponse = await axios.get(`http://192.168.1.6:3000/classes/${userId}`);
                setTeachingClasses(teachingClassesResponse.data);
            } catch {
                setTeachingClasses([]);
            }

            try {
                const joinedClassesResponse = await axios.get(`http://192.168.1.6:3000/joined-classes/${userId}`);
                setJoinedClasses(joinedClassesResponse.data);
            } catch {
                setJoinedClasses([]);
            }

        } catch (error) {
            console.error("Lỗi lấy dữ liệu người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal transparent={true} visible={visible} onRequestClose={onClose} statusBarTranslucent={true}>
            <View style={styles.container}>
                <Animated.View style={[styles.modalContent, { transform: [{ translateX: slideAnim }] }]}>
                    <View style={styles.boxlogo}>
                        <Image style={styles.imagelogo} source={require("../assets/images/logohome.png")} />
                        <Text style={styles.textheadera}>Capy3ra </Text>
                                  <Text style={styles.textheaderb}>Classroom</Text>
                    </View>

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("ClassroomList")}>
                        <Feather name="home" size={25} color="black" />
                        <Text style={styles.menuText}>Lớp học</Text>
                    </TouchableOpacity>

                    <Text style={styles.subTitle}>Lớp học đang giảng dạy</Text>

                    {loading ? (    
                        <ActivityIndicator size="small" color="#000" />
                    ) : teachingClasses.length === 0 ? (
                        <Text style={{ fontStyle: 'italic', color: '#888', marginBottom: 10 }}>Hiện chưa có lớp học</Text>
                    ) : (
                        <View style={{ flexShrink: 1 }}>
                            <FlatList
                                data={teachingClasses}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.boxitem}
                                        onPress={() => {
                                            onClose();
                                            navigation.navigate("DetailClassroom", { classId: item._id });
                                        }}
                                    >
                                        <Image
                                            style={styles.imagelogo}
                                            source={{ uri: item.imageUrl || "https://picsum.photos/200" }}
                                        />
                                        <Text style={styles.course} numberOfLines={1} ellipsizeMode="tail">
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}

                    <Text style={styles.subTitle}>Lớp học đang tham gia</Text>

                    {loading ? (
                        <ActivityIndicator size="small" color="#000" />
                    ) : joinedClasses.length === 0 ? (
                        <Text style={{ fontStyle: 'italic', color: '#888', marginBottom: 10 }}>Hiện chưa có lớp học</Text>
                    ) : (
                        <View style={{ flexShrink: 1 }}>

                        <FlatList
                            data={joinedClasses}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.boxitem}
                                    onPress={() => {
                                        onClose();
                                        navigation.navigate("DetailClassroom", { classId: item._id });
                                    }}
                                >
                                    <Image
                                        style={styles.imagelogo}
                                        source={{ uri: item.imageUrl || "https://picsum.photos/200" }}
                                    />
                                    <Text style={styles.course} numberOfLines={1} ellipsizeMode="tail">
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                        </View>

                    )}

                    

                    <View style={styles.profileSection}>
                        <Image style={styles.imageuser} source={require("../assets/images/usernobackgr.png")} />
                        <View>
                            <Text style={styles.profileName}>{user.fullname}</Text>
                            <Text style={styles.profileEmail}>{user.email}</Text>
                        </View>
                        <TouchableOpacity onPress={async () => {
              await AsyncStorage.removeItem('token'); // Xóa token đã lưu trong AsyncStorage
              await AsyncStorage.removeItem('user');  // Xóa thông tin user đã lưu
              navigation.navigate('LoginDetail'); // Chuyển hướng người dùng về màn hình đăng nhập
            }} style={styles.logoutButton}>
        <MaterialCommunityIcons name="logout" size={30} color="#E53935" />
    </TouchableOpacity>
                    </View>
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
    logoutButton: {
        padding: 8,
        marginLeft: 20,
        
    },
    textheadera: { 
        fontFamily: "Jost_400Regular", 
        fontSize: 20,
        fontWeight: "bold", color: '#0961F5' },
      textheaderb: { fontFamily: "Jost_400Regular", fontSize: 18, fontWeight: "semibold", color: '#333' },
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
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: "Jost_400Regular"
    },
    subTitle: {
        color: "#333",
        marginTop: 10,
        marginBottom: 5,
        fontFamily: "Jost_400Regular",
        fontWeight: "bold",

    },
    menuItem: {
        paddingVertical: 20,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: '#ddd'
    },
    menuText: {
        fontSize: 18,
        marginLeft: 10,
        fontFamily: "Jost_400Regular",
        fontWeight: "bold",
        color: '#333'
    },
    boxitem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    course: {
        fontSize: 16,
        color: "#333",
        fontFamily: "Jost_400Regular",
        
    },
    profileSection: {
        borderBottomWidth: 1,
        borderTopWidth: 1,
        paddingVertical: 10,
        borderColor: '#ddd',
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20
    },
    imagelogo: {
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 20
    },
    boxlogo: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10
    },
    imageuser: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10
    },
    profileName: {
        fontWeight: "bold",
        fontSize: 16,
        fontFamily: "Jost_400Regular"
    },
    profileEmail: {
        color: "#555",
        fontFamily: "Jost_400Regular"
    },
});

export default CustomModalMenu;
