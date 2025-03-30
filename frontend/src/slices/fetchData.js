import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import apiRoutes from '../routes/route.js';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (headers) => {
    const { data } = await axios.get(`${apiRoutes.channelsPath()}`, { headers });
    return data.data.channels;
  },
);

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (headers) => {
    const { data } = await axios.get(`${apiRoutes.messagesPath()}`, { headers });
    return data.data.messages;
  },
);
