import React, { useState } from 'react';
import { View, TextInput, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const EditProfile = (props: any) => {
    const { navigation } = props;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [birthday, setBirthday] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Bạn cần cấp quyền truy cập thư viện ảnh!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setBirthday(selectedDate);
        }
    };

    const formatDate = (date: Date) => {
        return `${date.getDate().toString().padStart(2, '0')}/${
            (date.getMonth() + 1).toString().padStart(2, '0')
        }/${date.getFullYear()}`;
    };

    const handleSave = () => {
        console.log({
            name,
            email,
            phoneNumber,
            gender,
            birthday: birthday ? formatDate(birthday) : 'Ngày sinh chưa chọn',
            image,
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('ProfileSettingsScreen')}>
                    <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Chỉnh sửa thông tin</Text>
                <TouchableOpacity style={styles.buttonheader} onPress={handleSave}>
                    <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.containersmall}>
                <View style={styles.avatarWrapper}>
                    <TouchableOpacity onPress={handleImagePicker}>
                        <Image
                            source={
                                image
                                    ? { uri: image }
                                    : require('../assets/images/usernobackgr.png')
                            }
                            style={styles.image}
                        />
                        <View style={styles.editIconContainer}>
                            <MaterialCommunityIcons name="pencil-circle-outline" size={28} color="#0961F5" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="account-outline" size={20} color="#333" />
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Nhập họ tên"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="email-outline" size={20} color="#333" />
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Nhập email"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="phone-outline" size={20} color="#333" />
                    <TextInput
                        style={styles.input}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="Nhập số điện thoại"
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="gender-male-female" size={20} color="#333" />
                    <Picker
                        selectedValue={gender}
                        onValueChange={(itemValue) => setGender(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Chọn giới tính" value="" />
                        <Picker.Item label="Nam" value="Nam" />
                        <Picker.Item label="Nữ" value="Nữ" />
                        <Picker.Item label="Khác" value="Khác" />
                    </Picker>
                </View>

                <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
                    <MaterialCommunityIcons name="calendar-month-outline" size={20} color="#333" />
                    <Text style={styles.input}>
                        {birthday ? formatDate(birthday) : 'Ngày sinh'}
                    </Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={birthday || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7f3ff',
    },
    containersmall: {
        padding: 10,
    },
    avatarWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 8,
        width: '100%',
    },
    title: {
        fontSize: 20,
        color: '#333',
        fontFamily: "Jost_400Regular",
        fontWeight: 'bold',
    },
    buttonheader: {
        backgroundColor: '#0961F5',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#0961F5',
        backgroundColor: '#fff',
        borderRadius: 30,
        marginTop: 10,
        paddingHorizontal: 15,
        fontFamily: "Jost_400Regular",
        fontWeight: 'bold',
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        paddingLeft: 10,
        fontFamily: "Jost_400Regular",
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    picker: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        
        fontFamily: "Jost_400Regular",
        fontWeight: 'bold',
        color: '#333',
    },
    image: {
        width: 150,
        height: 150,
        marginTop: 10,
        borderRadius: 75,
    },
});

export default EditProfile;
