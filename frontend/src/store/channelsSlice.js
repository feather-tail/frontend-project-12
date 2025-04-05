import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

import { fetchChannels } from './fetchData.js';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState({
  currentChannelId: null,
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,

    removeChannel: (state, { payload: removedChannelId }) => {
      channelsAdapter.removeOne(state, removedChannelId);

      if (state.currentChannelId === removedChannelId) {
        const allEntities = Object.values(state.entities);
        const generalChannel = allEntities.find((ch) => ch.name === 'general');

        if (generalChannel) {
          state.currentChannelId = generalChannel.id;
        } else {
          const [firstId] = state.ids;
          state.currentChannelId = firstId ?? null;
        }
      }
    },

    renameChannel: channelsAdapter.updateOne,

    changeChannel: (state, { payload }) => {
      state.currentChannelId = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChannels.fulfilled, (state, { payload }) => {
      channelsAdapter.setAll(state, payload);

      if (payload.length > 0 && !state.currentChannelId) {
        state.currentChannelId = payload[0].id;
      }
    });
  },
});

export const { actions: channelsActions } = channelsSlice;
export default channelsSlice.reducer;

const channelsSelectors = channelsAdapter.getSelectors(
  (state) => state.channels,
);
export const selectAllChannels = channelsSelectors.selectAll;
export const selectChannelById = channelsSelectors.selectById;
export const selectCurrentChannelId = (state) => state.channels.currentChannelId;

export const selectCurrentChannel = createSelector(
  [selectAllChannels, selectCurrentChannelId],
  (allChannels, currentChannelId) => allChannels.find((c) => c.id === currentChannelId),
);
