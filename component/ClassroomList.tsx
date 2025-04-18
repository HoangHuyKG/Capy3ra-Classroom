    import React, { useState, useEffect } from 'react';
    import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity, ActivityIndicator, Alert, Modal,TouchableWithoutFeedback  } from 'react-native';
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import axios from 'axios';
    import Feather from '@expo/vector-icons/Feather';
    import Fontisto from '@expo/vector-icons/Fontisto';
    import Header from './Header';

    const ClassroomList = ({ navigation }) => {
        const [classes, setClasses] = useState([]);
        const [loading, setLoading] = useState(true);
        const [modalVisible, setModalVisible] = useState(false);
        useEffect(() => {
            const fetchClasses = async () => {
                try {
                    const userData = await AsyncStorage.getItem('user'); // Lấy user từ AsyncStorage
                    
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
                   

                    const response = await axios.get(`http://10.0.2.2:3000/classes/${userId}`);

                    setClasses(response.data); // Gán danh sách lớp học vào state
                }  finally {
                    setLoading(false);
                }
            };

            fetchClasses();
        }, []);

        if (loading) {
            return <ActivityIndicator size="large" color="#0641F0" style={{ flex: 1, justifyContent: 'center' }} />;
        }

        return (
            <View style={styles.container}>
                <Header />
                <FlatList
                    style={styles.listitem}
                    data={classes}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate("DetailClassroom", { classId: item._id })}>
                            <ImageBackground source={{ uri: item.imageUrl }} style={styles.card} imageStyle={{ borderRadius: 10 }}>
                                <View style={styles.boxtext}>
                                    <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                                    <Text style={styles.dropdownText}>{item.topic}</Text>
                                </View>
                                <TouchableOpacity 
                                    style={styles.dotedit} 
                                    onPress={() => {
                                        // console.log("Edit Class ID:", item._id); // Kiểm tra ID có đúng không
                                        navigation.navigate("EditClassInfoScreen", { classId: item._id });
                                    }}
                                >
                                    <Feather name="edit" size={24} color="white" />
                                </TouchableOpacity>

                            </ImageBackground>
                        </TouchableOpacity>
                    )}
                />
            <TouchableOpacity style={styles.addclass} onPress={() => setModalVisible(true)}>
                <Fontisto name="plus-a" size={18} color="#0641F0" />
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)} 
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.overlay}>
                        <TouchableWithoutFeedback onPress={() => { }}>
                            <View style={styles.modalContainer}>
                           
                                <TouchableOpacity style={styles.option} onPress={()=>navigation.navigate("CreateClassScreen")}>
                                    <Text style={styles.optionText}>Tạo lớp học</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.option} onPress={()=>navigation.navigate("JoinClassScreen")}>
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
        backgroundColor: '#fff',
    },
    containersmall: {
        padding: 20,
    },
    cardiconedit: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    listitem: {
        margin: 10
    },
    cardsContainer: {
        backgroundColor: '#fff',
        flexGrow: 0,
        maxHeight: 600,
    },
    boxtext: {
        marginHorizontal: 20,
        flexDirection: 'column',
        justifyContent: "space-between",
    },
    cardsmall: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
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
        right: 5,
        top: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#64B5F6',
        padding: 10,
        borderRadius: 10,
    },
    iconBox: {
        padding: 5,
    },
    icon: {
        width: 30,
        height: 30,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#0641F0',
        width: '50%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    dropdownText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'semibold',
        fontFamily: "Nunito_400Regular",
    },
    card: {
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: "100%",
        height: 120,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginVertical: 10,
    },
    cardTitle: {
        width: '90%',
        fontSize: 24,
        marginTop: 10,
        fontWeight: '700',
        marginBottom: 40,
        color: "#fff",
        fontFamily: "Nunito_400Regular",
    },

    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    smallAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 5,
    },
    cardSubtitle: {
        color: '#757575',
    },
    footerText: {
        fontFamily: "Nunito_400Regular",
        marginTop: 20,
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
    },
    footerTextSmall: {
        fontSize: 14,
        textAlign: 'center',
        color: '#757575',
    },
    lineThroughContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 10,
    },
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 20,
    },
    option: {
        paddingVertical: 15,
    },
    optionText: {
        fontSize: 18,
        fontFamily: "Nunito_400Regular",
    },
});

    export default ClassroomList;
