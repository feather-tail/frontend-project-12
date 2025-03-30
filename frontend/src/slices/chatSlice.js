import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
  } from '@reduxjs/toolkit';
  import axios from 'axios'; 
  import apiRoutes from '../routes/route.js'; 
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
        const headers = { Authorization: `Bearer ${token}` };
  
        const [{ data: channels }, { data: messages }] = await Promise.all([
          axios.get(apiRoutes.channelsPath(), { headers }),
          axios.get(apiRoutes.messagesPath(), { headers }),
        ]);
  
        return { channels, messages };
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || 'Ошибка загрузки данных',
        );
      }
    },
  );
  
  export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ channelId, body, username }, { rejectWithValue, getState }) => {
      try {
        const { token } = getState().auth;
        const headers = { Authorization: `Bearer ${token}` };
  
        const { data } = await axios.post(
          apiRoutes.messagesPath(),
          { channelId, body, username },
          { headers },
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
          const { channels, messages } = action.payload;
          state.loading = false;
          state.error = null;
  
          channelsAdapter.setAll(state.channels, channels);
          messagesAdapter.setAll(state.messages, messages);
  
          if (!state.currentChannelId && channels.length > 0) {
            state.currentChannelId = channels[0].id;
          }
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
  
  export const { setCurrentChannelId, addNewMessage } = chatSlice.actions;

export const channelsSelectors = channelsAdapter.getSelectors(
  (state) => state.chat.channels,
);

export const messagesSelectors = messagesAdapter.getSelectors(
  (state) => state.chat.messages,
);

export default chatSlice.reducer;
  