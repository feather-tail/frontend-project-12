import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import apiRoutes from '../services/route.js';
import { toast } from 'react-toastify';
import i18n from '../services/i18n.js';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (headers, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(apiRoutes.channelsPath(), { headers });
      return data;
    } catch (error) {
      toast.error(i18n.t('notifications.fetchError'));
      return rejectWithValue(error.response?.data?.message || 'Fetch error');
    }
  },
);

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (headers, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(apiRoutes.messagesPath(), { headers });
      return data;
    } catch (error) {
      toast.error(i18n.t('notifications.fetchError'));
      return rejectWithValue(error.response?.data?.message || 'Fetch error');
    }
  },
);
