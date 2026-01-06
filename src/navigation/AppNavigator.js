import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import PostsScreen from '../screens/PostsScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import PostFormScreen from '../screens/PostFormScreen';
import AdminScreen from '../screens/AdminScreen';
import TeachersListScreen from '../screens/TeachersListScreen';
import TeacherFormScreen from '../screens/TeacherFormScreen';
import StudentsListScreen from '../screens/StudentsListScreen';
import StudentFormScreen from '../screens/StudentFormScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainStack = () => {
  const { isTeacher, logout } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Posts"
        component={PostsScreen}
        options={({ navigation }) => ({
          title: 'Posts',
          headerRight: () => (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={async () => {
                await logout();
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              }}
            >
              <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ title: 'Detalhes do Post' }}
      />
      {isTeacher() && (
        <>
          <Stack.Screen
            name="PostForm"
            component={PostFormScreen}
            options={{ title: 'Criar Post' }}
          />
          <Stack.Screen
            name="PostEdit"
            component={PostFormScreen}
            options={{ title: 'Editar Post' }}
          />
          <Stack.Screen
            name="Admin"
            component={AdminScreen}
            options={{ title: 'Administração' }}
          />
          <Stack.Screen
            name="TeachersList"
            component={TeachersListScreen}
            options={{ title: 'Professores' }}
          />
          <Stack.Screen
            name="TeacherForm"
            component={TeacherFormScreen}
            options={{ title: 'Criar Professor' }}
          />
          <Stack.Screen
            name="TeacherEdit"
            component={TeacherFormScreen}
            options={{ title: 'Editar Professor' }}
          />
          <Stack.Screen
            name="StudentsList"
            component={StudentsListScreen}
            options={{ title: 'Estudantes' }}
          />
          <Stack.Screen
            name="StudentForm"
            component={StudentFormScreen}
            options={{ title: 'Criar Estudante' }}
          />
          <Stack.Screen
            name="StudentEdit"
            component={StudentFormScreen}
            options={{ title: 'Editar Estudante' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const AdminStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="AdminMain" component={AdminScreen} options={{ title: 'Administração' }} />
  </Stack.Navigator>
);

const TeachersStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="TeachersMain" 
      component={TeachersListScreen} 
      options={{ title: 'Professores' }} 
    />
    <Stack.Screen
      name="TeacherForm"
      component={TeacherFormScreen}
      options={{ title: 'Criar Professor' }}
    />
    <Stack.Screen
      name="TeacherEdit"
      component={TeacherFormScreen}
      options={{ title: 'Editar Professor' }}
    />
  </Stack.Navigator>
);

const StudentsStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="StudentsMain" 
      component={StudentsListScreen} 
      options={{ title: 'Estudantes' }} 
    />
    <Stack.Screen
      name="StudentForm"
      component={StudentFormScreen}
      options={{ title: 'Criar Estudante' }}
    />
    <Stack.Screen
      name="StudentEdit"
      component={StudentFormScreen}
      options={{ title: 'Editar Estudante' }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  if (user.userType === 'teacher') {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={MainStack}
          options={{ headerShown: false, title: 'Posts' }}
        />
        <Tab.Screen
          name="AdminTab"
          component={AdminStack}
          options={{ headerShown: false, title: 'Admin' }}
        />
        <Tab.Screen
          name="TeachersTab"
          component={TeachersStack}
          options={{ headerShown: false, title: 'Professores' }}
        />
        <Tab.Screen
          name="StudentsTab"
          component={StudentsStack}
          options={{ headerShown: false, title: 'Estudantes' }}
        />
      </Tab.Navigator>
    );
  }

  return <MainStack />;
};

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  logoutButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default AppNavigator;

