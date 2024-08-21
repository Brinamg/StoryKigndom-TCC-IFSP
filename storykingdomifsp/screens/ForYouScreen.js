import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const ForYouScreen = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const approvedBooksData = await AsyncStorage.getItem('approvedBooks');
        const approvedBooksList = approvedBooksData ? JSON.parse(approvedBooksData) : [];
        setBooks(approvedBooksList);
        setFilteredBooks(approvedBooksList);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = () => {
    const filtered = books.filter(book => {
      const matchesQuery = book.volumeInfo?.title?.toLowerCase().includes(query.toLowerCase()) ?? false;
      const matchesGenre = selectedGenre === 'All' || (book.volumeInfo?.categories && book.volumeInfo.categories.includes(selectedGenre));
      return matchesQuery && matchesGenre;
    });

    setFilteredBooks(filtered);
  };

  const renderItem = ({ item }) => {
    if (!item || !item.volumeInfo) {
      return null;
    }

    return (
      <TouchableOpacity onPress={() => navigation.navigate('BookDetails', { book: item })}>
        <View style={styles.bookItem}>
          {item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail ? (
            <Image source={{ uri: item.volumeInfo.imageLinks.thumbnail }} style={styles.bookImage} />
          ) : (
            <View style={styles.bookImagePlaceholder}>
              <FontAwesome name="book" size={50} color="#fff" />
            </View>
          )}
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle}>{item.volumeInfo.title}</Text>
            <Text style={styles.bookAuthor}>{item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Agrupando livros por tema
  const groupedBooks = filteredBooks.reduce((acc, book) => {
    const genre = book.volumeInfo?.categories ? book.volumeInfo.categories[0] : 'Unknown';
    if (!acc[genre]) {
      acc[genre] = [];
    }
    acc[genre].push(book);
    return acc;
  }, {});

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Recomendados para você</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do livro"
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <FontAwesome name="search" size={24} color="#FF6347" />
        </TouchableOpacity>
      </View>

      {Object.keys(groupedBooks).map((genre) => (
        <View key={genre} style={styles.genreContainer}>
          <Text style={styles.genreHeader}>{genre}</Text>
          <FlatList
            data={groupedBooks[genre]}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContainer}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,  // Adiciona flexGrow para garantir que ScrollView expanda corretamente
    padding: 20,
    backgroundColor: '#FFFAF0',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#FF6347',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    backgroundColor: '#FFF',
    flex: 1,
    paddingHorizontal: 15,
    borderRadius: 25,
    fontSize: 18,
  },
  searchButton: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#FFFACD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookItem: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#FFFACD',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 10,
  },
  bookImagePlaceholder: {
    width: 80,
    height: 120,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookInfo: {
    marginLeft: 15,
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#555',
  },
  genreContainer: {
    marginBottom: 30,
  },
  genreHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginVertical: 10,
  },
  flatListContainer: {
    paddingBottom: 20, // Adiciona padding para garantir que o conteúdo não seja cortado
  },
});

export default ForYouScreen;
