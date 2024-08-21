import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BooksReadScreen = () => {
  const [readBooks, setReadBooks] = useState([]);
  const [booksCount, setBooksCount] = useState(0);

  useEffect(() => {
    const loadReadBooks = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem('readBooks');
        const books = storedBooks ? JSON.parse(storedBooks) : [];
        setReadBooks(books);
        setBooksCount(books.length);
        await AsyncStorage.setItem('readBooksCount', books.length.toString()); // Atualiza o contador
      } catch (error) {
        console.error('Failed to load read books:', error);
      }
    };

    loadReadBooks();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Image
        source={{ uri: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150' }}
        style={styles.bookCover}
      />
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.volumeInfo.title}</Text>
        <Text style={styles.bookAuthors}>
          {item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author'}
        </Text>
        <Text style={styles.bookPart}>
          Livro marcado como lido
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Books Read</Text>
      <Text style={styles.countText}>Total books read: {booksCount}</Text>
      {readBooks.length > 0 ? (
        <FlatList
          data={readBooks}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noBooksText}>No books read yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFEDCC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F39C12',
    marginBottom: 10,
  },
  countText: {
    fontSize: 18,
    color: '#34495E',
    marginBottom: 20,
  },
  noBooksText: {
    fontSize: 18,
    color: '#E74C3C',
    textAlign: 'center',
    marginTop: 20,
  },
  bookItem: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  bookCover: {
    width: 50,
    height: 70,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  bookDetails: {
    marginLeft: 10,
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bookAuthors: {
    fontSize: 14,
    color: '#666',
  },
  bookPart: {
    fontSize: 14,
    color: '#4CAF50',
  },
});

export default BooksReadScreen;
