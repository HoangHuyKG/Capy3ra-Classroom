import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useFonts, Jost_400Regular } from "@expo-google-fonts/nunito";
import Header from './Header';

export default function HomeScreen(props: any) {
    const {navigation} = props;
    return (

            <View style={styles.container}>
            <Header />

                <Image
                    source={require("../assets/images/logohome.png")}
                    style={styles.capybaraImage}
                />

                <Text style={styles.description}>
                    Hãy tạo thêm hoặc tham gia một lớp học để bắt đầu!
                </Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.createClassButton} onPress={()=> navigation.navigate("CreateCourse")}>
                        <Text style={styles.createText}>Tạo lớp học</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.joinClassButton} onPress={()=> navigation.navigate("JoinClassScreen")}>
                        <Text style={styles.joinText}>Tham gia lớp học</Text>
                    </TouchableOpacity>
                </View>
            </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFCF3',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    capybaraImage: {
        width: 250,
        height: 300,
        margin: 20,
    },
    description: {
        marginTop: 20,
        padding: 20,
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: "Jost_400Regular",
        fontWeight: 'bold'
    },
    buttonContainer: {
        marginTop: 30,
        flexDirection: 'row',
        gap: 10,
    },
    createClassButton: {
        
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    joinClassButton: {
        backgroundColor: '#0961F5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    createText: {
        color: '#0961F5',
        fontWeight: 'bold',
    },
    joinText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
