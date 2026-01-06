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
import { createStudent, updateStudent } from '../services/students';

const StudentFormScreen = ({ route, navigation }) => {
  const { studentId, student } = route.params || {};
  const isEdit = !!studentId;

  const [name, setName] = useState(student?.name || '');
  const [email, setEmail] = useState(student?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email) {
      Alert.alert('Erro', 'Nome e email são obrigatórios');
      return;
    }

    if (!isEdit && !password) {
      Alert.alert('Erro', 'Senha é obrigatória para novos estudantes');
      return;
    }

    setLoading(true);
    try {
      const data = { name, email };
      if (password) {
        data.password = password;
      }

      if (isEdit) {
        await updateStudent(studentId, data);
        Alert.alert('Sucesso', 'Estudante atualizado com sucesso');
      } else {
        await createStudent(data);
        Alert.alert('Sucesso', 'Estudante criado com sucesso');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Erro',
        error.response?.data?.response || 'Não foi possível salvar o estudante'
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
          placeholder="Digite o nome do estudante"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Digite o email do estudante"
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
              {isEdit ? 'Salvar Alterações' : 'Criar Estudante'}
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

export default StudentFormScreen;

