import React, { useState } from 'react';
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
import { createTeacher, updateTeacher } from '../services/teachers';

const TeacherFormScreen = ({ route, navigation }) => {
  const { teacherId, teacher } = route.params || {};
  const isEdit = !!teacherId;

  const [name, setName] = useState(teacher?.name || '');
  const [email, setEmail] = useState(teacher?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email) {
      Alert.alert('Erro', 'Nome e email são obrigatórios');
      return;
    }

    if (!isEdit && !password) {
      Alert.alert('Erro', 'Senha é obrigatória para novos professores');
      return;
    }

    setLoading(true);
    try {
      const data = { name, email };
      if (password) {
        data.password = password;
      }

      if (isEdit) {
        await updateTeacher(teacherId, data);
        Alert.alert('Sucesso', 'Professor atualizado com sucesso');
      } else {
        await createTeacher(data);
        Alert.alert('Sucesso', 'Professor criado com sucesso');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Erro',
        error.response?.data?.response || 'Não foi possível salvar o professor'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Digite o nome do professor"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Digite o email do professor"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>
          Senha {isEdit && '(deixe em branco para não alterar)'}
        </Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Digite a senha"
          secureTextEntry
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
              {isEdit ? 'Salvar Alterações' : 'Criar Professor'}
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

export default TeacherFormScreen;

