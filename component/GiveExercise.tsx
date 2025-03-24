import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Menu, Provider } from 'react-native-paper';
import Header from './Header';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import FooterBar from '../navigation/FooterBar';
import Fontisto from '@expo/vector-icons/Fontisto';
import Entypo from '@expo/vector-icons/Entypo';
import { useRoute } from '@react-navigation/native';

const GiveExercise = ({ navigation }) => {
    const route = useRoute();
    const activeTab = route.params?.activeTab || 'clipboard';
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const data = Array.from({ length: 11 }, (_, i) => ({
        id: i.toString(),
        title: `Bài tập ${i + 1}`,
        date: `Ngày đăng: 12:00, ${i + 1} tháng 1, 2025`
    }));

    const openMenu = (item) => {
        setSelectedItem(item);
        setMenuVisible(true);
    };

    const closeMenu = () => {
        setMenuVisible(false);
    };

    return (
        <Provider>
            <View style={styles.container}>
                <Header />
                <View style={styles.containersmall}>
                    <FlatList
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: 130 }}
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("AssignmentScreen")}> 
                                <View style={styles.cardheader}>
                                    <Ionicons name="document-text-outline" size={24} color="white" />
                                </View>
                                <View>
                                    <Text style={styles.cardheadertitle}>{item.title}</Text>
                                    <Text style={styles.cardheadertext}>{item.date}</Text>
                                </View>
                                <Menu
                                    contentStyle={styles.menu}
                                    visible={menuVisible && selectedItem?.id === item.id}
                                    onDismiss={closeMenu}
                                    anchor={
                                        <TouchableOpacity onPress={() => openMenu(item)}>
                                            <Entypo name="dots-three-vertical" size={24} color="#5f6368" style={styles.cardicon} />
                                        </TouchableOpacity>
                                    }
                                >
                                    <Menu.Item onPress={() => { closeMenu(); navigation.navigate("EditExercise"); }} title="Chỉnh sửa" icon="pencil-outline" />
                                    <Menu.Item onPress={closeMenu} title="Xóa" icon="trash-can-outline" />
                                </Menu>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <TouchableOpacity style={styles.buttonAdd} onPress={() => navigation.navigate("DetailExercise")}> 
                    <Fontisto name="plus-a" size={18} color="#0641F0" />
                </TouchableOpacity>
                <FooterBar activeTab={activeTab} />
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
