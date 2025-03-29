import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import axios from 'axios';

const channelsAdapter = createEntityAdapter();
const messagesAdapter = createEntityAdapter();

const initialState = {
  channels: channelsAdapter.getInitialState(),
  messages: messagesAdapter.getInitialState(),
  currentChannelId: null,
  loading: false,
  error: null,
};

export const fetchChatData = createAsyncThunk(
  'chat/fetchChatData',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const { data } = await axios.get('/api/v1/data', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка загрузки чата',
      );
    }
  },
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ channelId, body }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const { data } = await axios.post(
        `/api/v1/channels/${channelId}/messages`,
        { body },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка при отправке сообщения',
      );
    }
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChannelId(state, action) {
      state.currentChannelId = action.payload;
    },
    addNewMessage(state, action) {
      messagesAdapter.addOne(state.messages, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatData.fulfilled, (state, action) => {
        const { channels, messages, currentChannelId } = action.payload;
        state.loading = false;
        state.error = null;
        state.currentChannelId = currentChannelId || null;
        channelsAdapter.setAll(state.channels, channels);
        messagesAdapter.setAll(state.messages, messages);
      })
      .addCase(fetchChatData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        messagesAdapter.addOne(state.messages, action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const channelsSelectors = channelsAdapter.getSelectors(
  (state) => state.chat.channels,
);
export const messagesSelectors = messagesAdapter.getSelectors(
  (state) => state.chat.messages,
);

export const { setCurrentChannelId, addNewMessage } = chatSlice.actions;
export default chatSlice.reducer;
