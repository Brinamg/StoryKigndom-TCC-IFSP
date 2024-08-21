import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import app from '../services/firebase';
import styles from '../estilo/css';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleRegister = () => {
    app.auth()
      .createUserWithEmailAndPassword(email, senha)
      .then(userCredential => {
        Alert.alert('Usuário criado', `Usuário criado: ${userCredential.user.email}`);
        setEmail('');
        setSenha('');
        navigation.navigate('Login');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Erro', 'Email já existe');
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert('Erro', 'Email inválido');
        } else {
          Alert.alert('Erro', error.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../img/logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>Registro de Conta</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Digite o email"
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
      />
      
      <TextInput
        style={styles.input}
        placeholder="Digite a senha"
        secureTextEntry={true}
        value={senha}
        onChangeText={setSenha}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.toggleText}>Voltar para o Login</Text>
      </TouchableOpacity>
    </View>
  );
}
