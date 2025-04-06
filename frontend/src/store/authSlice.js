import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import i18n from '../services/i18n.js';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/login', userData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue(i18n.t('login.errorInvalid'));
      }
      return rejectWithValue(
        error.response?.data?.message || i18n.t('notifications.networkError'),
      );
    }
  },
);
const initialState = {
  isAuth: false,
  token: null,
  user: null,
  loading: false,
  error: null,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...initialState,
      };
    },
    initializeAuth: (state, action) => {
      const token = action.payload;
      if (!token) {
        return state;
      }
      const user = localStorage.getItem('user');
      return {
        ...state,
        isAuth: true,
        token,
        user,
      };
    },
  },  
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(loginUser.fulfilled, (state, action) => {
        const { token, username } = action.payload;
        localStorage.setItem('token', token);
        localStorage.setItem('user', username);
        return {
          ...state,
          loading: false,
          isAuth: true,
          token,
          user: username,
        };
      })
      .addCase(loginUser.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }));
  },  
});

export const { logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
