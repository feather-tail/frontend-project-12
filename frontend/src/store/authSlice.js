import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
      return rejectWithValue(error.response?.data?.message || i18n.t('notifications.networkError'));
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
    logout(state) {
      state.token = null;
      state.isAuth = false;
      state.user = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    initializeAuth: (state, action) => {
      const token = action.payload;
      if (token) {
        state.isAuth = true;
        state.token = token;
        const user = localStorage.getItem('user');
        state.user = user;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.token = action.payload.token;
        state.user = action.payload.username;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', action.payload.username);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
