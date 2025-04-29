import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Menu, Provider } from 'react-native-paper';
import Header from './Header';
import Ionicons from '@expo/vector-icons/Ionicons';
import FooterBar from '../navigation/FooterBar';
import Fontisto from '@expo/vector-icons/Fontisto';
import Entypo from '@expo/vector-icons/Entypo';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GiveExercise = ({ navigation }) => {
    const route = useRoute();
    const activeTab = route.params?.activeTab || 'clipboard';
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const classId = route.params?.classId; // Nhận classId từ params
    const [exercises, setExercises] = useState([]); // State để lưu danh sách bài tập
    const [userId, setUserId] = useState('');
    const [classData, setClassData] = useState(null);

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
        const fetchExercises = async () => {
            try {
                const response = await axios.get(`http://10.10.10.10:3000/exercises/class/${classId}`);
                setExercises(response.data); // Lưu danh sách bài tập vào state
            } catch (error) {
                console.error("Lỗi khi lấy bài tập:", error);
            }
        };
        fetchClassDetails();
        fetchExercises();
    }, [classId]); // Gọi lại khi classId thay đổi
    const fetchClassDetails = async () => {
        try {
            const response = await axios.get(`http://10.10.10.10:3000/class/${classId}`);
            setClassData(response.data);
        } catch (error) {
            console.error("❌ Lỗi khi lấy dữ liệu lớp học:", error);

        }
    };
    const openMenu = (item) => {
        setSelectedItem(item);
        setMenuVisible(true);
    };

    const closeMenu = () => {
        setMenuVisible(false);
    };

    const handleDeleteExercise = async (id) => {
        try {
            await axios.delete(`http://10.10.10.10:3000/exercises/${id}`);
            setExercises(exercises.filter(exercise => exercise._id !== id)); // Cập nhật danh sách bài tập
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Bài tập đã được xóa thành công!',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể xóa bài tập. Vui lòng thử lại.',
            });
        }
    };

    return (
        <Provider>
            <View style={styles.container}>
                <Header />
                <View style={styles.containersmall}>
                    <FlatList
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: 130 }}
                        data={exercises}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (

                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => {
                                    if (userId === classData?.userId) {
                                        navigation.navigate("AssignmentScreen", { exerciseId: item._id, classId: classId });
                                    } else {
                                        navigation.navigate("AssignmentDetail", { exerciseId: item._id, classId: classId });
                                    }
                                }}>

                                <View style={styles.cardheader}>
                                    <Ionicons name="document-text-outline" size={24} color="white" />
                                </View>
                                <View style={styles.cardbox}>
                                    <Text style={styles.cardheadertitle} numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>
                                    <Text style={styles.cardheadertext}>{`Ngày đăng: ${new Date(item.createdAt).toLocaleString()}`}</Text>
                                </View>
                                {userId === classData?.userId && (
                                    <Menu
                                        contentStyle={styles.menu}
                                        visible={menuVisible && selectedItem?._id === item._id}
                                        onDismiss={closeMenu}
                                        anchor={
                                            <TouchableOpacity onPress={() => openMenu(item)}>
                                                <Entypo name="dots-three-vertical" size={24} color="#5f6368" style={styles.cardicon} />
                                            </TouchableOpacity>
                                        }
                                    >
                                        <Menu.Item
                                            onPress={() => {
                                                closeMenu();
                                                navigation.navigate("EditExercise", { exerciseId: item._id, classId: classId }); // Truyền exerciseId vào
                                            }}
                                            title="Chỉnh sửa"
                                            icon="pencil-outline"
                                        />
                                        <Menu.Item
                                            onPress={() => {
                                                closeMenu();
                                                Alert.alert(
                                                    "Xác nhận xóa",
                                                    "Bạn có chắc chắn muốn xóa bài tập này?",
                                                    [
                                                        { text: "Hủy", style: "cancel" },
                                                        { text: "Xóa", onPress: () => handleDeleteExercise(item._id) }
                                                    ]
                                                );
                                            }}
                                            title="Xóa"
                                            icon="trash-can-outline"
                                        />
                                    </Menu>
                                )}

                            </TouchableOpacity>
                        )}
                    />
                </View>
                {userId === classData?.userId && (
                    <TouchableOpacity
                        style={styles.buttonAdd}
                        onPress={() => navigation.navigate("DetailExercise", { classId })} // Truyền classId
                    >
                        <Fontisto name="plus-a" size={18} color="#0961F5" />
                    </TouchableOpacity>
                )}
                <FooterBar activeTab={activeTab} classId={classId} />
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e7f3ff' },
    card: {
        margin: 10,
        backgroundColor: '#fff',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 10,
    },
    cardbox: {
        marginRight: 30,
        marginLeft: 20

    },
    menu: {
        backgroundColor: '#fff',
    },
    cardheader: {
        backgroundColor: '#0961F5',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,

    },
    cardicon: { marginRight: 10 },
    cardheadertitle: { fontSize: 16, fontWeight: 'bold', color: '#000', width: 200 },
    cardheadertext: { fontSize: 12, color: '#000' },
    buttonAdd: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 80,
        right: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    }
});

export default GiveExercise;