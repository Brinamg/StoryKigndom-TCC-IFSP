import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BookDetailsScreen = ({ route }) => {
  const { book } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const checkReadStatus = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem('readBooks');
        const books = storedBooks ? JSON.parse(storedBooks) : [];
        if (books.find(b => b.id === book.id)) {
          Alert.alert('Info', 'Book already marked as read');
        }
      } catch (error) {
        console.error('Failed to check book status:', error);
      }
    };

    checkReadStatus();
  }, [book.id]);

  if (!book || !book.volumeInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No book data available</Text>
      </View>
    );
  }

  const {
    title = 'Title not available',
    authors = ['Author not available'],
    description = 'Description not available',
    imageLinks = { thumbnail: 'https://via.placeholder.com/150' },
  } = book.volumeInfo;

  // Limitar o resumo a um parágrafo
  const shortDescription = description.length > 300 ? `${description.substring(0, 300)}...` : description;

  const handleReadButtonPress = () => {
    navigation.navigate('ReadBookScreen', { bookId: book.id });
  };

  const handleMarkAsReadPress = async () => {
    try {
      let readBooks = await AsyncStorage.getItem('readBooks');
      readBooks = readBooks ? JSON.parse(readBooks) : [];
      if (!readBooks.find(b => b.id === book.id)) {
        readBooks.push(book);
        await AsyncStorage.setItem('readBooks', JSON.stringify(readBooks));
        Alert.alert('Success', 'Book marked as read');
      }
    } catch (error) {
      console.error('Failed to mark book as read:', error);
    }
  };

  const handleWriteReviewPress = () => {
    navigation.navigate('WriteReviewScreen', { bookId: book.id });
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: imageLinks.thumbnail }}
        style={styles.cover}
      />
      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.author}>{authors.join(', ')}</Text>
        <Text style={styles.summary}>{shortDescription}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.readButton]} onPress={handleReadButtonPress}>
          <Icon name="book" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Ler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.markAsReadButton]} onPress={handleMarkAsReadPress}>
          <Icon name="check-circle" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Marcar como Lido</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.writeReviewButton]} onPress={handleWriteReviewPress}>
          <Icon name="rate-review" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Escrever Resenha</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFAF0',
  },
  cover: {
    width: 150,
    height: 200,
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 16,
  },
  details: {
    marginVertical: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#F39C12',
    textAlign: 'center',
  },
  author: {
    fontSize: 20,
    color: '#16A085',
    textAlign: 'center',
    marginVertical: 8,
  },
  summary: {
    fontSize: 18,
    color: '#34495E',
    marginVertical: 8,
    textAlign: 'justify',
  },
  buttonsContainer: {
    marginVertical: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 5,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  readButton: {
    backgroundColor: '#1E88E5',
  },
  markAsReadButton: {
    backgroundColor: '#4CAF50',
  },
  writeReviewButton: {
    backgroundColor: '#F57C00',
  },
  errorText: {
    fontSize: 18,
    color: '#E74C3C',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default BookDetailsScreen;
