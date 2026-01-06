import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllTeachers, deleteTeacher } from '../services/teachers';

const TeachersListScreen = ({ navigation }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useFocusEffect(
    React.useCallback(() => {
      loadTeachers(1);
    }, [])
  );

  const loadTeachers = async (pageNum = 1) => {
    try {
      setLoading(true);
      const data = await getAllTeachers(pageNum, 10);
      setTeachers(data.data);
      setTotalPages(data.totalPages);
      setPage(pageNum);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os professores');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTeachers(1);
    setRefreshing(false);
  };

  const handleDelete = async (teacherId) => {
    console.log('=== DELETE START ===');
    console.log('Delete button clicked for teacher:', teacherId);
    
    let confirmed = false;
    
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.confirm) {
      confirmed = window.confirm('Tem certeza que deseja excluir este professor?');
    } else {
      confirmed = await new Promise((resolve) => {
        Alert.alert(
          'Confirmar exclusão',
          'Tem certeza que deseja excluir este professor?',
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
      console.log('Delete cancelled by user');
      return;
    }

    console.log('=== DELETE CONFIRMED ===');
    console.log('Delete confirmed by user, starting deletion...');
    console.log('Calling deleteTeacher with id:', teacherId);
    
    try {
      console.log('Before deleteTeacher call');
      const response = await deleteTeacher(teacherId);
      console.log('=== DELETE SUCCESS ===');
      console.log('Delete response received:', JSON.stringify(response, null, 2));
      
      const currentPage = page;
      console.log('Reloading teachers on page:', currentPage);
      await loadTeachers(currentPage);
      
      console.log('Showing success alert');
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.alert) {
        window.alert(response?.response || 'Professor excluído com sucesso');
      } else {
        Alert.alert('Sucesso', response?.response || 'Professor excluído com sucesso');
      }
    } catch (error) {
      console.error('=== DELETE ERROR ===');
      console.error('Delete error caught:', error);
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers
        }
      });
      
      let errorMessage = 'Não foi possível excluir o professor';
      
      if (error.response) {
        errorMessage = error.response.data?.response || 
                      error.response.data?.erro || 
                      `Erro ${error.response.status}: ${error.response.statusText || 'Erro desconhecido'}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.log('Showing error alert:', errorMessage);
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.alert) {
        window.alert(errorMessage);
      } else {
        Alert.alert('Erro', errorMessage);
      }
    }
  };

  const renderTeacher = ({ item }) => (
    <View style={styles.teacherCard}>
      <View style={styles.teacherInfo}>
        <Text style={styles.teacherName}>{item.name}</Text>
        <Text style={styles.teacherEmail}>{item.email}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('TeacherEdit', { teacherId: item._id, teacher: item })}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={(e) => {
            e?.stopPropagation?.();
            console.log('Delete button pressed for:', item._id);
            handleDelete(item._id);
          }}
          activeOpacity={0.7}
          onPressIn={() => console.log('Delete button pressed IN')}
        >
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('TeacherForm')}
      >
        <Text style={styles.addButtonText}>+ Criar Professor</Text>
      </TouchableOpacity>

      <FlatList
        data={teachers}
        renderItem={renderTeacher}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum professor encontrado</Text>
        }
        ListFooterComponent={
          totalPages > 1 && (
            <View style={styles.pagination}>
              <TouchableOpacity
                style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}
                onPress={() => loadTeachers(page - 1)}
                disabled={page === 1}
              >
                <Text style={styles.pageButtonText}>Anterior</Text>
              </TouchableOpacity>
              <Text style={styles.pageInfo}>
                Página {page} de {totalPages}
              </Text>
              <TouchableOpacity
                style={[styles.pageButton, page === totalPages && styles.pageButtonDisabled]}
                onPress={() => loadTeachers(page + 1)}
                disabled={page === totalPages}
              >
                <Text style={styles.pageButtonText}>Próxima</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />
    </View>
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
  addButton: {
    backgroundColor: '#34C759',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    padding: 15,
  },
  teacherCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teacherInfo: {
    marginBottom: 15,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  teacherEmail: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
  },
  pageButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  pageButtonDisabled: {
    backgroundColor: '#ccc',
  },
  pageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 16,
    color: '#333',
  },
});

export default TeachersListScreen;

