import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { channelsActions } from './channelsSlice.js';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,

    setMessages: messagesAdapter.setAll,
  },
  extraReducers: (builder) => {
    builder.addCase(channelsActions.removeChannel, (state, { payload: removedChannelId }) => {
      const idsToRemove = Object.values(state.entities)
        .filter((msg) => msg.channelId === removedChannelId)
        .map((msg) => msg.id);
      messagesAdapter.removeMany(state, idsToRemove);
    });
  },
});

export const { actions: messagesActions } = messagesSlice;
export default messagesSlice.reducer;

const messagesSelectors = messagesAdapter.getSelectors((state) => state.messages);
export const selectAllMessages = messagesSelectors.selectAll;

export const selectCurrentChannelMessages = createSelector(
  [selectAllMessages, (state) => state.channels.currentChannelId],
  (allMessages, currentChannelId) => allMessages.filter((m) => m.channelId === currentChannelId),
);
