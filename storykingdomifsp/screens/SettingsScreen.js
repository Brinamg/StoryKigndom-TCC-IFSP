import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { Text, Button, Divider } from 'react-native-paper';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import ParentalControl from './ParentalControlScreen';
import BooksRead from './BooksReadScreen';
import Reviews from './ReviewScreen';
import AccountSettings from './AccountSettingsScreen';
import app from '../services/firebase';

const { auth, firestore } = app;

export default function SettingsScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'second', title: 'Livros lidos' },
    { key: 'third', title: 'Resenhas' },
    { key: 'fourth', title: 'Nível da conta' },
    { key: 'first', title: 'Controle parental' },
  ]);
  const [profileImage, setProfileImage] = useState('https://img.freepik.com/vetores-premium/foto-de-perfil-de-bebe-fofo-avatar-de-crianca_176411-4644.jpg');
  const [name, setName] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          setUser(currentUser);
          const userDoc = await firestore.collection('tbuser').doc(currentUser.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setProfileImage(userData.profileImage || profileImage);
            setName(userData.name || name);
          }
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = (newName, newProfileImage) => {
    setName(newName);
    setProfileImage(newProfileImage);
    if (user) {
      firestore.collection('tbuser').doc(user.uid).set({
        name: newName,
        profileImage: newProfileImage,
      });
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Tentando deslogar...');
      await auth.signOut();
      console.log('Deslogado com sucesso');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Erro ao deslogar:', error);
      Alert.alert('Erro ao sair', error.message);

      // Fallback para redirecionar para a tela de login mesmo se o signOut falhar
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  const renderScene = SceneMap({
    first: () => (
      <ScrollView contentContainerStyle={styles.tabContent}>
        <ParentalControl />
      </ScrollView>
    ),
    second: () => (
      <ScrollView contentContainerStyle={styles.tabContent}>
        <BooksRead />
      </ScrollView>
    ),
    third: () => (
      <ScrollView contentContainerStyle={styles.tabContent}>
        <Reviews />
      </ScrollView>
    ),
    fourth: () => (
      <ScrollView contentContainerStyle={styles.tabContent}>
        <AccountSettings />
      </ScrollView>
    ),
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      style={styles.tabBar}
      indicatorStyle={styles.indicator}
      labelStyle={styles.tabLabel}
      scrollEnabled
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: profileImage }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{name}</Text>
        <Button
          mode="contained"
          style={styles.editProfileButton}
          onPress={() => navigation.navigate('EditProfile', { profileImage, name, onSave: handleProfileUpdate })}
        >
          Editar Perfil
        </Button>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: 400 }}
        renderTabBar={renderTabBar}
      />

      <Divider style={styles.divider} />

      <Button
        mode="contained"
        style={styles.logoutButton}
        labelStyle={styles.buttonLabel}
        onPress={handleLogout}
      >
        Sair
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FAFAD2',
    borderBottomWidth: 2,
    borderBottomColor: '#FFB6C1',
    borderRadius: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 4,
    borderColor: '#FFB6C1',
  },
  editProfileButton: {
    marginTop: 10,
    backgroundColor: '#FF69B4',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 5,
  },
  tabBar: {
    backgroundColor: '#FFDAB9',
  },
  indicator: {
    backgroundColor: '#FF69B4',
  },
  tabLabel: {
    color: '#4B0082',
  },
  tabContent: {
    padding: 10,
    backgroundColor: '#FFF',
  },
  divider: {
    marginVertical: 20,
    height: 1,
    backgroundColor: '#FFB6C1',
  },
  logoutButton: {
    backgroundColor: '#FF69B4',
    margin: 16,
  },
  buttonLabel: {
    fontSize: 16,
  },
});