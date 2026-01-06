import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { createPost, updatePost } from '../services/posts';
import { AuthContext } from '../contexts/AuthContext';

const PostFormScreen = ({ route, navigation }) => {
  const { postId, post } = route.params || {};
  const isEdit = !!postId;
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [author, setAuthor] = useState(post?.author || user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content || !author) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await updatePost(postId, { title, content, author });
        Alert.alert('Sucesso', 'Post atualizado com sucesso');
      } else {
        await createPost({ title, content, author });
        Alert.alert('Sucesso', 'Post criado com sucesso');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Erro',
        error.response?.data?.response || 'Não foi possível salvar o post'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Digite o título do post"
        />

        <Text style={styles.label}>Autor</Text>
        <TextInput
          style={styles.input}
          value={author}
          onChangeText={setAuthor}
          placeholder="Digite o nome do autor"
        />

        <Text style={styles.label}>Conteúdo</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={content}
          onChangeText={setContent}
          placeholder="Digite o conteúdo do post"
          multiline
          numberOfLines={10}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isEdit ? 'Salvar Alterações' : 'Criar Post'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 200,
    paddingTop: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PostFormScreen;

