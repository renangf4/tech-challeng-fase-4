import api from './api';

export const getAllPosts = async () => {
  const response = await api.get('/v1/posts');
  return response.data;
};

export const getPostById = async (id) => {
  const response = await api.get(`/v1/posts/${id}`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post('/v1/posts', postData);
  return response.data;
};

export const updatePost = async (id, postData) => {
  const response = await api.put(`/v1/posts/${id}`, postData);
  return response.data;
};

export const deletePost = async (id) => {
  console.log('deletePost service called with id:', id);
  try {
    const response = await api.delete(`/v1/posts/${id}`);
    console.log('deletePost response:', response);
    return response.data;
  } catch (error) {
    console.error('deletePost error:', error);
    throw error;
  }
};

export const searchPosts = async (query) => {
  const response = await api.get('/v1/posts/search', { params: query });
  return response.data;
};

