import React, { useState } from 'react';
import { Text, SafeAreaView, TextInput, TouchableOpacity, Alert, View, Image } from 'react-native';
import styles from '../estilo/css';
import app from '../services/firebase';

export default function TelaLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const logar = () => {
    app.auth()
      .signInWithEmailAndPassword(email, senha)
      .then(() => {
        navigation.navigate('MainTabs');
      })
      .catch((error) => {
        Alert.alert('Erro', 'Usuário não cadastrado');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../img/logo.png')} style={styles.logo} />
      </View>
        <Text style={styles.title}>Story Kingdom</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Digite o email"
          onChangeText={setEmail}
          value={email}
          keyboardType='email-address'
        />
        
        <TextInput
          style={styles.input}
          placeholder="Digite a senha"
          onChangeText={setSenha}
          value={senha}
          secureTextEntry
        />
        
        <TouchableOpacity
          style={styles.button}
          onPress={logar}
        >
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.toggleText}>Não tem uma conta? Cadastre-se</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}