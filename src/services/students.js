import api from './api';

export const getAllStudents = async (page = 1, limit = 10) => {
  const response = await api.get('/v1/students', { params: { page, limit } });
  return response.data;
};

export const getStudentById = async (id) => {
  const response = await api.get(`/v1/students/${id}`);
  return response.data;
};

export const createStudent = async (studentData) => {
  const response = await api.post('/v1/students', studentData);
  return response.data;
};

export const updateStudent = async (id, studentData) => {
  const response = await api.put(`/v1/students/${id}`, studentData);
  return response.data;
};

export const deleteStudent = async (id) => {
  console.log('deleteStudent service called with id:', id);
  try {
    const response = await api.delete(`/v1/students/${id}`);
    console.log('deleteStudent response:', response);
    return response.data;
  } catch (error) {
    console.error('deleteStudent error:', error);
    throw error;
  }
};

