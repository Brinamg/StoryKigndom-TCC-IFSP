import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchRecommendedChildrenBooks, searchBooks } from '../services/bookService';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function ParentalControlScreen() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  // Função para carregar livros da API
  const loadBooks = async () => {
    setLoading(true);
    try {
      const recommendedBooks = await fetchRecommendedChildrenBooks();
      setBooks(recommendedBooks);
      setFilteredBooks(recommendedBooks); // Inicialmente, os livros filtrados são os mesmos que os recomendados
    } catch (error) {
      console.error('Failed to fetch books:', error);
      Alert.alert('Erro', 'Falha ao carregar livros. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar a lista de livros
  const refreshBooks = async () => {
    await loadBooks();
  };

  // Função para aprovar um livro
  const handleApproveBook = async (book) => {
    try {
      const storedApprovedBooks = await AsyncStorage.getItem('approvedBooks');
      const approvedBooks = storedApprovedBooks ? JSON.parse(storedApprovedBooks) : [];
      approvedBooks.push(book);
      await AsyncStorage.setItem('approvedBooks', JSON.stringify(approvedBooks));

      Alert.alert('Livro Aprovado', `O livro "${book.volumeInfo.title}" foi aprovado.`);
      setBooks(prevBooks => prevBooks.filter(b => b.id !== book.id));
      setFilteredBooks(prevBooks => prevBooks.filter(b => b.id !== book.id)); // Atualiza a lista filtrada também
    } catch (error) {
      console.error('Failed to approve book:', error);
    }
  };

  // Função para rejeitar um livro
  const handleRejectBook = async (book) => {
    try {
      const storedApprovedBooks = await AsyncStorage.getItem('approvedBooks');
      let approvedBooks = storedApprovedBooks ? JSON.parse(storedApprovedBooks) : [];
      approvedBooks = approvedBooks.filter(b => b.id !== book.id);
      await AsyncStorage.setItem('approvedBooks', JSON.stringify(approvedBooks));

      Alert.alert('Livro Rejeitado', `O livro "${book.volumeInfo.title}" foi rejeitado.`);
      setBooks(prevBooks => prevBooks.filter(b => b.id !== book.id));
      setFilteredBooks(prevBooks => prevBooks.filter(b => b.id !== book.id)); // Atualiza a lista filtrada também
    } catch (error) {
      console.error('Failed to reject book:', error);
    }
  };

  // Função para pesquisar livros
  const handleSearch = async () => {
    try {
      const searchedBooks = await searchBooks(query);
      setFilteredBooks(searchedBooks);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookItem}>
      {item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail ? (
        <Image source={{ uri: item.volumeInfo.imageLinks.thumbnail }} style={styles.bookImage} />
      ) : (
        <View style={styles.bookImagePlaceholder} />
      )}
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.volumeInfo.title}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => handleApproveBook(item)}
          >
            <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
            <Text style={styles.buttonText}>Aprovar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => handleRejectBook(item)}
          >
            <Ionicons name="close-circle" size={24} color="#ffffff" />
            <Text style={styles.buttonText}>Rejeitar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aprovar ou Rejeitar Livros</Text>
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
      <FlatList
        data={filteredBooks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum livro disponível no momento.</Text>}
      />
      <TouchableOpacity style={styles.refreshButton} onPress={refreshBooks}>
        <Text style={styles.refreshButtonText}>Atualizar Lista</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#E8F5E9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center',
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
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFDE7',
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#C6FF00',
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
  },
  bookImagePlaceholder: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#B2DFDB',
    marginRight: 10,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    color: '#388E3C',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginRight: 10,
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F44336',
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    marginLeft: 5,
    fontSize: 16,
  },
  refreshButton: {
    padding: 12,
    backgroundColor: '#64B5F6',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  refreshButtonText: {
    fontSize: 18,
    color: '#ffffff',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

