import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Alert, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import ProgressBar from '../ProgressBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const medalGifs = [
  require('../img/medal1.gif'), // Caminho ajustado para a pasta img
  require('../img/medal2.gif'), // Caminho ajustado para a pasta img
  require('../img/medal3.gif'), // Caminho ajustado para a pasta img
];

export default function AccountSettingsScreen({ navigation }) {
  const [booksRead, setBooksRead] = useState(0);
  const [accountLevel, setAccountLevel] = useState(1);
  const [rewardImage, setRewardImage] = useState(null);

  const updateBooksReadCount = useCallback(async () => {
    try {
      const storedBooksCount = await AsyncStorage.getItem('readBooksCount');
      const count = storedBooksCount ? parseInt(storedBooksCount, 10) : 0;
      console.log('Books read from AsyncStorage:', count); // Debug
      setBooksRead(count);
      const level = Math.floor(count / 3) + 1;
      setAccountLevel(level);
    } catch (error) {
      console.error('Failed to load books read count:', error);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('AccountSettingsScreen focused'); // Debug
      updateBooksReadCount();
    }, [updateBooksReadCount])
  );

  const checkForReward = (count) => {
    let reward = null;
    if (count >= 6) {
      reward = medalGifs[2];
    } else if (count >= 5) {
      reward = medalGifs[1];
    } else if (count >= 3) {
      reward = medalGifs[0];
    }

    setRewardImage(reward);

    if (reward) {
      Alert.alert('Parabéns!', 'Você ganhou uma medalha!');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.title}>Seu nível e Livros lidos</Text>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Livros lidos: {booksRead}</Text>
        <ProgressBar progress={(booksRead % 3) / 3} />
        <Text style={styles.scoreText}>Nível da Conta: {accountLevel}</Text>
        <ProgressBar progress={(accountLevel - 1) / 10} />
        <TouchableOpacity style={styles.button} onPress={() => checkForReward(booksRead)}>
          <Text style={styles.buttonText}>Verificar premiação</Text>
        </TouchableOpacity>
        {rewardImage && <Image source={rewardImage} style={styles.rewardImage} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  scoreContainer: {
    width: '100%',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
  rewardImage: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});
