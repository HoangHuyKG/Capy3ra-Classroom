import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity, ActivityIndicator, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import Header from './Header';

const ClassroomList = ({ navigation }) => {
    const [teachingClasses, setTeachingClasses] = useState([]);
    const [joinedClasses, setJoinedClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState('teaching');

      
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (!userData) {
                    setLoading(false);
                    return;
                }

                const user = JSON.parse(userData);
                if (!user._id) {
                    Alert.alert("Lỗi", "Không tìm thấy ID người dùng!");
                    setLoading(false);
                    return;
                }

                const userId = user._id;

                try {
                    const [teachingClassesResponse, joinedClassesResponse] = await Promise.all([
                        axios.get(`http://192.168.1.6:3000/classes/${userId}`).catch(error => {
                            if (error.response?.status === 404) return { data: [] };
                            throw error;
                        }),
                        axios.get(`http://192.168.1.6:3000/joined-classes/${userId}`).catch(error => {
                            if (error.response?.status === 404) return { data: [] };
                            throw error;
                        })
                    ]);

                    setTeachingClasses(teachingClassesResponse.data);
                    setJoinedClasses(joinedClassesResponse.data);
                } catch (error) {
                    console.error('Lỗi khi lấy danh sách lớp:', error.response?.status, error.response?.data || error.message);
                    setTeachingClasses([]);
                    setJoinedClasses([]);
                }

            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0961F5" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    return (
        <View style={styles.container}>
            <Header />
            
            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'teaching' && styles.activeTab]}
                    onPress={() => setSelectedTab('teaching')}
                >
                    <Text style={[styles.tabText, selectedTab === 'teaching' && styles.activeTabText]}>Đang dạy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'learning' && styles.activeTab]}
                    onPress={() => setSelectedTab('learning')}
                >
                    <Text style={[styles.tabText, selectedTab === 'learning' && styles.activeTabText]}>Đang học</Text>
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                style={styles.listitem}
                data={selectedTab === 'teaching' ? teachingClasses : joinedClasses}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate("DetailClassroom", {classId: item._id })}>
                        <ImageBackground source={{ uri: item.imageUrl }} style={styles.card} imageStyle={{ borderRadius: 10 }}>
                            <View style={styles.overlayCard}>
                                <View style={styles.boxtext}>
                                    <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                                    <Text style={styles.dropdownText}>{item.topic}</Text>
                                </View>
                                {selectedTab === 'teaching' && (
                                    <TouchableOpacity
                                        style={styles.dotedit}
                                        onPress={() => navigation.navigate("EditClassInfoScreen", { classId: item._id })}
                                    >
                                        <Feather name="edit" size={30} color="white" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                )}
            />

            {/* FAB Button */}
            <TouchableOpacity style={styles.addclass} onPress={() => setModalVisible(true)}>
                <Fontisto name="plus-a" size={20} color="#0961F5" />
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.overlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContainer}>
                                <TouchableOpacity style={styles.option} onPress={() => {
                                    setModalVisible(false);
                                    navigation.navigate("CreateClassScreen");
                                }}>
                                    <Feather name="plus-circle" size={25} color="#333" style={{ marginRight: 10 }} />
                                    <Text style={styles.optionText}>Tạo lớp học</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.option} onPress={() => {
                                    setModalVisible(false);
                                    navigation.navigate("JoinClassScreen");
                                }}>
                                    <Feather name="log-in" size={25} color="#333" style={{ marginRight: 10 }} />
                                    <Text style={styles.optionText}>Tham gia lớp học</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7f3ff',
    },
    listitem: {
        margin: 10
    },
    boxtext: {
        marginHorizontal: 20,
        flexDirection: 'column',
        justifyContent: "space-between",
    },
    addclass: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 20,
        right: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    dotedit: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    dropdownText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    card: {
        position: 'relative',
        flexDirection: 'column',
        width: "100%",
        height: 130,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginVertical: 10,
        overflow: 'hidden'
    },
    overlayCard: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 10,
        padding: 10,
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: "#fff",
        marginBottom: 10,
        
    },
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContainer: {
        backgroundColor: "#fff",
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#eee',
      },
      
      
    optionText: {
        fontSize: 16,
        marginLeft: 10,
        color: "#333",
        fontWeight: 'bold'
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 50,
        backgroundColor: '#fff',
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#0961F5',
    },
    activeTab: {
        backgroundColor: '#0961F5',
        borderColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    tabText: {
        color: '#0961F5',
        fontSize: 16,
        fontWeight: '600',
    },
    activeTabText: {
        color: '#fff',
    },
});

export default ClassroomList;
