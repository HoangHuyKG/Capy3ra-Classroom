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

const GiveExercise = ({ navigation }) => {
    const route = useRoute();
    const activeTab = route.params?.activeTab || 'clipboard';
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const classId = route.params?.classId; // Nhận classId từ params
    const [exercises, setExercises] = useState([]); // State để lưu danh sách bài tập

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await axios.get(`http://10.0.2.2:3000/exercises/class/${classId}`);
                setExercises(response.data); // Lưu danh sách bài tập vào state
            } catch (error) {
                console.error("Lỗi khi lấy bài tập:", error);
            }
        };

        fetchExercises();
    }, [classId]); // Gọi lại khi classId thay đổi

    const openMenu = (item) => {
        setSelectedItem(item);
        setMenuVisible(true);
    };

    const closeMenu = () => {
        setMenuVisible(false);
    };

    const handleDeleteExercise = async (id) => {
        try {
            await axios.delete(`http://10.0.2.2:3000/exercises/${id}`);
            setExercises(exercises.filter(exercise => exercise._id !== id)); // Cập nhật danh sách bài tập
            Alert.alert("Thành công", "Bài tập đã được xóa thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa bài tập:", error);
            Alert.alert("Lỗi", "Không thể xóa bài tập. Vui lòng thử lại.");
        }
    };

    return (
        <Provider>
            <View style={styles.container}>
                <Header />
                <View style={styles.containersmall}>
                    <FlatList
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: 130 }}
                        data={exercises} // Sử dụng danh sách bài tập từ state
                        keyExtractor={(item) => item._id} // Sử dụng _id làm key
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("AssignmentScreen")}> 
                                <View style={styles.cardheader}>
                                    <Ionicons name="document-text-outline" size={24} color="white" />
                                </View>
                                <View>
                                    <Text style={styles.cardheadertitle}>{item.title}</Text>
                                    <Text style={styles.cardheadertext}>{`Ngày đăng: ${new Date(item.createdAt).toLocaleString()}`}</Text>
                                    </View>
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
                                            navigation.navigate("EditExercise", { exerciseId: item._id }); // Truyền exerciseId vào
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
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <TouchableOpacity 
                    style={styles.buttonAdd} 
                    onPress={() => navigation.navigate("DetailExercise", { classId })} // Truyền classId
                > 
                    <Fontisto name="plus-a" size={18} color="#0641F0" />
                </TouchableOpacity>
                <FooterBar activeTab={activeTab} classId={classId} />
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    card: {
        margin: 10,
        backgroundColor: '#fff',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 10,
    },
    menu: {
        backgroundColor: '#fff'
    },
    cardheader: {
        backgroundColor: '#0641F0',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    cardicon: { marginRight: 10 },
    cardheadertitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
    cardheadertext: { fontSize: 10, color: '#000' },
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