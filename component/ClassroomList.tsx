    import React, { useState, useEffect } from 'react';
    import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import axios from 'axios';
    import Feather from '@expo/vector-icons/Feather';
    import Fontisto from '@expo/vector-icons/Fontisto';
    import Header from './Header';

    const ClassroomList = ({ navigation }) => {
        const [classes, setClasses] = useState([]);
        const [loading, setLoading] = useState(true);

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
                <TouchableOpacity style={styles.addclass} onPress={() => navigation.navigate("CreateClassScreen")}>
                    <Fontisto name="plus-a" size={18} color="#0641F0" />
                </TouchableOpacity>
            </View>
        );
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: '#fff' },
        listitem: { margin: 10 },
        card: { position: 'relative', width: "100%", height: 120, borderRadius: 10, marginVertical: 10 },
        boxtext: { marginHorizontal: 20, flexDirection: 'column' },
        cardTitle: { fontSize: 20, color: "#fff", fontWeight: 'bold' },
        dropdownText: { color: '#fff', fontSize: 14 },
        dotedit: { position: 'absolute', right: 10, top: 10 },
        addclass: { position: 'absolute', width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', bottom: 20, right: 20, elevation: 5 }
    });

    export default ClassroomList;
