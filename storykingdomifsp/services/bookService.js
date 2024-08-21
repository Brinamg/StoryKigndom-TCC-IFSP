const API_URL = 'https://www.googleapis.com/books/v1/volumes';

// Função para buscar livros com base em uma consulta
export const searchBooks = async (query) => {
  try {
    const response = await fetch(`${API_URL}?q=${query}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Search books response data:', data);
    return data.items || [];
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

// Função para buscar livros recomendados para crianças
export const fetchRecommendedChildrenBooks = async () => {
  try {
    const response = await fetch(`${API_URL}?q=subject:children&orderBy=relevance`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Recommended children books response data:', data);
    return data.items || [];
  } catch (error) {
    console.error('Error fetching recommended children books:', error);
    throw error;
  }
};

// Função para buscar o conteúdo completo de um livro
export const fetchBookFullContent = async (bookId) => {
  try {
    const response = await fetch(`${API_URL}/${bookId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const bookData = await response.json();
    console.log('Book full content response data:', bookData);

    if (!bookData.volumeInfo || !bookData.volumeInfo.description) {
      throw new Error('No description available for this book.');
    }

    const fullContent = bookData.volumeInfo.description.replace(/<\/?[^>]+(>|$)/g, '').trim();
    return fullContent;
  } catch (error) {
    console.error('Error fetching book full content:', error);
    throw error;
  }
};
