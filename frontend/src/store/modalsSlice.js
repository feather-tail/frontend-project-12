import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAddModalOpen: false,
  isRenameModalOpen: false,
  isRemoveModalOpen: false,
  channelToEdit: null,
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    showAddModal: (state) => ({
      ...state,
      isAddModalOpen: true,
    }),
    hideAddModal: (state) => ({
      ...state,
      isAddModalOpen: false,
    }),

    showRenameModal: (state, { payload }) => ({
      ...state,
      isRenameModalOpen: true,
      channelToEdit: payload,
    }),
    hideRenameModal: (state) => ({
      ...state,
      isRenameModalOpen: false,
      channelToEdit: null,
    }),

    showRemoveModal: (state, { payload }) => ({
      ...state,
      isRemoveModalOpen: true,
      channelToEdit: payload,
    }),
    hideRemoveModal: (state) => ({
      ...state,
      isRemoveModalOpen: false,
      channelToEdit: null,
    }),
  },
});

export const {
  showAddModal,
  hideAddModal,
  showRenameModal,
  hideRenameModal,
  showRemoveModal,
  hideRemoveModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;
