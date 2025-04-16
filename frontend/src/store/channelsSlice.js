import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({
  currentChannelId: null,
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: (state, action) => channelsAdapter.addOne({ ...state }, action),

    removeChannel: (state, { payload: removedChannelId }) => {
      const newState = channelsAdapter.removeOne({ ...state }, removedChannelId);

      const wasCurrent = state.currentChannelId === removedChannelId;
      if (!wasCurrent) {
        return newState;
      }

      const allEntities = Object.values(newState.entities);
      const generalChannel = allEntities.find((ch) => ch.name === 'general');

      return {
        ...newState,
        currentChannelId: generalChannel?.id ?? newState.ids[0] ?? null,
      };
    },

    renameChannel: (state, action) => channelsAdapter.updateOne({ ...state }, action),

    changeChannel: (state, { payload }) => ({
      ...state,
      currentChannelId: payload,
    }),

    setChannels: (state, { payload }) => {
      const newState = channelsAdapter.setAll({ ...state }, payload);

      if (payload.length > 0 && !state.currentChannelId) {
        return {
          ...newState,
          currentChannelId: payload[0].id,
        };
      }
      return newState;
    },
  },
  extraReducers: () => {},
});

export const { actions: channelsActions } = channelsSlice;
export default channelsSlice.reducer;

const channelsSelectors = channelsAdapter.getSelectors((state) => state.channels);
export const selectAllChannels = channelsSelectors.selectAll;
export const selectChannelById = channelsSelectors.selectById;
export const selectCurrentChannelId = (state) => state.channels.currentChannelId;

export const selectCurrentChannel = createSelector(
  [selectAllChannels, selectCurrentChannelId],
  (allChannels, currentChannelId) => allChannels.find((c) => c.id === currentChannelId),
);
