import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firebase from '../services/firebase';

const EditProfileScreen = ({ route, navigation }) => {
  const { profileImage: initialProfileImage, name: initialName, onSave } = route.params;
  const [profileImage, setProfileImage] = useState(initialProfileImage);
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Você precisa permitir o acesso à galeria para selecionar uma imagem.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    setLoading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ref = firebase.storage().ref().child(`profileImages/${firebase.auth().currentUser.uid}`);
      await ref.put(blob);
      const downloadURL = await ref.getDownloadURL();
      setLoading(false);
      return downloadURL;
    } catch (error) {
      setLoading(false);
      Alert.alert('Erro ao fazer upload da imagem', error.message);
      throw error;
    }
  };

  const handleSave = async () => {
    let imageUrl = profileImage;

    if (profileImage !== initialProfileImage) {
      try {
        imageUrl = await uploadImage(profileImage);
      } catch (error) {
        return;
      }
    }

    try {
      const userId = firebase.auth().currentUser.uid;
      await firebase.firestore().collection('tbuser').doc(userId).set({
        name: name,
        profileImage: imageUrl,
      }, { merge: true });

      if (onSave) {
        onSave(name, imageUrl);
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro ao salvar perfil', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Editar Perfil</Text>
      <Image source={{ uri: profileImage }} style={styles.profileImage} />
      <Button title="Selecionar Imagem" onPress={selectImage} color="#FF6F61" />
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#FF6F61" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#FF6F61" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#FF6F61',
    textAlign: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 24,
    backgroundColor: '#d9d9d9',
    alignSelf: 'center',
  },
  input: {
    height: 50,
    borderColor: '#FF6F61',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#333333',
  },
});

export default EditProfileScreen;