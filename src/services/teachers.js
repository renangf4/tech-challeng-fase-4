import api from './api';

export const getAllTeachers = async (page = 1, limit = 10) => {
  const response = await api.get('/v1/teachers', { params: { page, limit } });
  return response.data;
};

export const getTeacherById = async (id) => {
  const response = await api.get(`/v1/teachers/${id}`);
  return response.data;
};

export const createTeacher = async (teacherData) => {
  const response = await api.post('/v1/teachers', teacherData);
  return response.data;
};

export const updateTeacher = async (id, teacherData) => {
  const response = await api.put(`/v1/teachers/${id}`, teacherData);
  return response.data;
};

export const deleteTeacher = async (id) => {
  console.log('deleteTeacher service called with id:', id);
  try {
    const response = await api.delete(`/v1/teachers/${id}`);
    console.log('deleteTeacher response:', response);
    return response.data;
  } catch (error) {
    console.error('deleteTeacher error:', error);
    throw error;
  }
};

