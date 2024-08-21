import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import app  from '../services/firebase'; // Importa a instância do Firebase

export default function ReviewScreen() {
  const [titulo, setTitulo] = useState('');
  const [resenha, setResenha] = useState('');
  const [texto, setTexto] = useState([]);
  const [editando, setEditando] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);

  useEffect(() => {
    const unsubscribe = app.firestore().collection('tbresenha').onSnapshot(snapshot => {
      const textoData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTexto(textoData);
    });

    return () => unsubscribe();
  }, []);

  const adicionarResenha = async () => {
    if (!titulo || !resenha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const newTexto = { titulo, resenha };
    try {
      await app.firestore().collection('tbresenha').add(newTexto);
      setTitulo('');
      setResenha('');
    } catch (error) {
      console.error('Erro ao adicionar a resenha: ', error);
    }
  };

  const deletarResenha = async (id) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja excluir esta resenha?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: async () => {
          try {
            await app.firestore().collection('tbresenha').doc(id).delete();
            Alert.alert("Sucesso", "Resenha excluída com sucesso!");
          } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao excluir a resenha.");
            console.error('Erro ao excluir a resenha: ', error);
          }
        }},
      ]
    );
  };

  const iniciarEdicao = (item) => {
    setTitulo(item.titulo);
    setResenha(item.resenha);
    setIdEdicao(item.id);
    setEditando(true);
  };

  const atualizarResenha = async () => {
    if (!titulo || !resenha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      await app.firestore().collection('tbresenha').doc(idEdicao).update({ titulo, resenha });
      setTitulo('');
      setResenha('');
      setEditando(false);
      setIdEdicao(null);
      } catch (error) {
      console.error('Erro ao atualizar a resenha: ', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.textoItem}>
      <Text style={styles.textoTitulo}>{item.titulo}</Text>
      <Text style={styles.textoResenha}>{item.resenha}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => iniciarEdicao(item)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deletarResenha(item.id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{editando ? 'Editar Resenha' : 'Adicionar Resenha'}</Text>

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
          onPress={editando ? atualizarResenha : adicionarResenha}
        >
          <Text style={styles.addButtonText}>{editando ? 'Atualizar Resenha' : 'Adicionar Resenha'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.list}
        data={texto}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFAF0', // Cor de fundo similar à HomeScreen
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF6347', // Cor do título similar à HomeScreen
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
    borderColor: '#FFD700', // Cor da borda similar à HomeScreen
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
  list: {
    width: '100%',
  },
  textoItem: {
    backgroundColor: '#FFFACD', // Cor de fundo similar ao item do livro
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFD700', // Cor da borda similar à HomeScreen
  },
  textoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF1493', // Rosa profundo
    marginBottom: 5,
  },
  textoResenha: {
    fontSize: 16,
    color: '#4B0082', // Índigo
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#00BFFF', // Azul profundo
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#FF6347', // Tomate
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
