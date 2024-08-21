import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Animated } from 'react-native';
import { fetchBookFullContent } from '../services/bookService';
import * as Progress from 'react-native-progress';

const { width } = Dimensions.get('window');

const ReadBookScreen = ({ route }) => {
  const { bookId } = route.params;
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollX = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await fetchBookFullContent(bookId);
        const cleanedContent = cleanContent(content);
        const formattedPages = formatContentToPages(cleanedContent);
        setPages(formattedPages);
      } catch (error) {
        console.error('Error fetching book content:', error);
      }
    };

    fetchContent();
  }, [bookId]);

  const cleanContent = (content) => {
    return content.replace(/<\/?[^>]+(>|$)/g, '').trim();
  };

  const formatContentToPages = (content) => {
    const pageLength = 1500;
    const totalPages = Math.ceil(content.length / pageLength);
    const pagesArray = [];
    
    for (let i = 0; i < totalPages; i++) {
      pagesArray.push(content.slice(i * pageLength, (i + 1) * pageLength));
    }
    
    return pagesArray;
  };

  const renderPage = ({ item }) => (
    <View style={styles.page}>
      <Text style={styles.text}>{item}</Text>
    </View>
  );

  const handleViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentPage(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const totalPages = pages.length;
  const progress = totalPages > 0 ? (currentPage + 1) / totalPages : 0;

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={pages}
        renderItem={renderPage}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />
      <View style={styles.progressContainer}>
        <Progress.Bar
          progress={progress}
          width={width * 0.9}
          color="#FF6F61"
          borderColor="transparent"
          unfilledColor="#E0E0E0"
        />
        <Text style={styles.progressText}>
          {Math.round(progress * 100)}% lido
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Fundo neutro
  },
  page: {
    width,
    paddingHorizontal: 30, // Aumenta o padding horizontal para criar margem interna
    paddingVertical: 40, // Ajusta o padding vertical
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF3E0', // Amarelo pálido para lembrar papel de livro
    borderRadius: 15,
    marginHorizontal: 15, // Adiciona margem horizontal entre páginas
    marginVertical: 20, // Adiciona margem vertical entre páginas
    shadowColor: '#000', // Adiciona sombra para profundidade
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Sombra para Android
  },
  text: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'justify', // Justifica o texto
    fontFamily: 'Comic Sans MS',
    color: '#333333', // Cor do texto para bom contraste
  },
  progressContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
  progressText: {
    marginTop: 5,
    fontSize: 18,
    color: '#333333', // Cor do texto do progresso
  },
});

export default ReadBookScreen;
