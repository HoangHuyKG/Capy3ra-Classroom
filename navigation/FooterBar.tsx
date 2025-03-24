import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const FooterBar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const activeTab = route.params?.activeTab || 'message'; // Mặc định là 'message'

  return (
    <View style={styles.footerBar}>
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("DetailClassroom", { activeTab: 'message' })}
      >
        <MaterialCommunityIcons name="comment-text-multiple-outline" size={24} color={activeTab === 'message' ? '#0641F0' : '#5f6368'}/>
        <Text style={activeTab === 'message' ? styles.activeText : styles.inactiveText}>Bảng tin</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("GiveExercise", { activeTab: 'clipboard' })}
      >
        <MaterialCommunityIcons name="clipboard-text-outline" size={24} color={activeTab === 'clipboard' ? '#0641F0' : '#5f6368'} />
        <Text style={activeTab === 'clipboard' ? styles.activeText : styles.inactiveText}>Bài tập trên lớp</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("EveryOneScreen", { activeTab: 'users' })}
      >
        <MaterialCommunityIcons name="account-multiple" size={24} color={activeTab === 'users' ? '#0641F0' : '#5f6368'} />
        <Text style={activeTab === 'users' ? styles.activeText : styles.inactiveText}>Mọi người</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerBar: {
    flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', paddingVertical: 10,
    borderColor: '#ddd', position: 'absolute', bottom: 0, width: '100%', shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.4, shadowRadius: 3, elevation: 10,
    borderTopWidth: 1, borderTopColor: '#5f6368'
  },
  footerItem: { alignItems: 'center' },
  activeText: { fontWeight: 'bold', color: '#0641F0', fontFamily: "Nunito_400Regular" },
  inactiveText: { color: '#5f6368', fontFamily: "Nunito_400Regular", fontWeight: 'bold' },
});

export default FooterBar;
