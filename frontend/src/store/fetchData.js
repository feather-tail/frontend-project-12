import axios from 'axios';
import { toast } from 'react-toastify';
import i18n from '../services/i18n.js';
import apiRoutes from '../services/route.js';
import { channelsActions } from './channelsSlice.js';
import { messagesActions } from './messagesSlice.js';

export const fetchChannels = (headers) => async (dispatch) => {
  try {
    const { data } = await axios.get(apiRoutes.channelsPath(), { headers });
    dispatch(channelsActions.setChannels(data));
  } catch (error) {
    toast.error(i18n.t('notifications.fetchError'));
  }
};

export const fetchMessages = (headers) => async (dispatch) => {
  try {
    const { data } = await axios.get(apiRoutes.messagesPath(), { headers });
    dispatch(messagesActions.setMessages(data));
  } catch (error) {
    toast.error(i18n.t('notifications.fetchError'));
  }
};
