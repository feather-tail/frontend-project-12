import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showAddModal: false,
  showRenameModal: false,
  showRemoveModal: false,
  modalChannel: null,
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openAddModal: (state) => ({
      ...state,
      showAddModal: true,
    }),
    closeAddModal: (state) => ({
      ...state,
      showAddModal: false,
    }),

    openRenameModal: (state, action) => ({
      ...state,
      showRenameModal: true,
      modalChannel: action.payload,
    }),
    closeRenameModal: (state) => ({
      ...state,
      showRenameModal: false,
      modalChannel: null,
    }),

    openRemoveModal: (state, action) => ({
      ...state,
      showRemoveModal: true,
      modalChannel: action.payload,
    }),
    closeRemoveModal: (state) => ({
      ...state,
      showRemoveModal: false,
      modalChannel: null,
    }),
  },
});

export const modalsActions = modalsSlice.actions;
export default modalsSlice.reducer;
