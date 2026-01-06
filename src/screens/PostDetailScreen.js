import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { getPostById, deletePost } from '../services/posts';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const PostDetailScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isTeacher } = useContext(AuthContext);

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await getPostById(postId);
      setPost(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o post');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    console.log('Delete button clicked for post:', postId);
    
    let confirmed = false;
    
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.confirm) {
      confirmed = window.confirm('Tem certeza que deseja excluir este post?');
    } else {
      confirmed = await new Promise((resolve) => {
        Alert.alert(
          'Confirmar exclusão',
          'Tem certeza que deseja excluir este post?',
          [
            { 
              text: 'Cancelar', 
              style: 'cancel',
              onPress: () => resolve(false)
            },
            {
              text: 'Excluir',
              style: 'destructive',
              onPress: () => resolve(true)
            },
          ],
          { cancelable: true, onDismiss: () => resolve(false) }
        );
      });
    }

    if (!confirmed) {
      console.log('Delete cancelled');
      return;
    }

    console.log('Delete confirmed, starting deletion...');
    try {
      const response = await deletePost(postId);
      console.log('Delete response:', response);
      
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.alert) {
        window.alert(response?.response || 'Post excluído com sucesso');
      } else {
        Alert.alert('Sucesso', response?.response || 'Post excluído com sucesso');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Delete error:', error);
      
      let errorMessage = 'Não foi possível excluir o post';
      
      if (error.response) {
        errorMessage = error.response.data?.response || 
                      error.response.data?.erro || 
                      `Erro ${error.response.status}: ${error.response.statusText}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.alert) {
        window.alert(errorMessage);
      } else {
        Alert.alert('Erro', errorMessage);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.author}>Por: {post.author}</Text>
        <Text style={styles.date}>
          {new Date(post.createdAt).toLocaleDateString('pt-BR')}
        </Text>
        <Text style={styles.contentText}>{post.content}</Text>
      </View>

      {isTeacher() && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('PostEdit', { postId: post._id, post })}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PostDetailScreen;

