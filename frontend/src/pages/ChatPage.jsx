import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Header from '../components/Header.jsx';
import Channels from '../components/Channels.jsx';
import Messages from '../components/Messages.jsx';
import {
  fetchChannels,
  fetchMessages,
} from '../store/fetchData.js';

const ChatPage = ({ socket }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    dispatch(fetchChannels(headers));
    dispatch(fetchMessages(headers));
  }, [dispatch, token]);

  useEffect(() => {
    socket.on('newMessage', (msg) => {
      dispatch({ type: 'messages/addMessage', payload: msg });
    });
    return () => socket.off('newMessage');
  }, [dispatch, socket]);

  return (
    <div className="d-flex flex-column h-100">
      <Header />
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <Channels />
          <Messages />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
