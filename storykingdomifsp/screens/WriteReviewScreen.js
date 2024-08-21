import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';
import app from '../services/firebase'; // Certifique-se de que está importando corretamente

export default function WriteReviewScreen() {
  const [titulo, setTitulo] = useState('');
  const [resenha, setResenha] = useState('');

  const adicionarResenha = async () => {
    if (!titulo.trim() || !resenha.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const newTexto = { titulo, resenha };
    try {
      console.log('Adicionando resenha...', newTexto); // Verificar se a função está sendo chamada
      await app.firestore().collection('tbresenha').add(newTexto);
      setTitulo('');
      setResenha('');
      Alert.alert("Sucesso", "Resenha adicionada com sucesso!"); // Popup de sucesso
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao adicionar a resenha.");
      console.error('Erro ao adicionar a resenha: ', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Adicionar Resenha</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={titulo}
          onChangeText={text => setTitulo(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Resenha"
          value={resenha}
          onChangeText={text => setResenha(text)}
          multiline
        />
      
        <TouchableOpacity
          style={styles.addButton}
          onPress={adicionarResenha}
        >
          <Text style={styles.addButtonText}>Adicionar Resenha</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFAF0', // Cor de fundo
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF6347', // Cor do título
    textShadowRadius: 3,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFACD', // Cor de fundo clara para os campos de entrada
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD700', // Cor da borda
  },
  addButton: {
    backgroundColor: '#32CD32', // Verde limão
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
