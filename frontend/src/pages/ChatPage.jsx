import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header.jsx';
import Channels from '../components/Channels.jsx';
import Messages from '../components/Messages.jsx';
import { fetchChannels, fetchMessages } from '../store/fetchData.js';
import { messagesActions } from '../store/messagesSlice.js';
import {
  hideAddModal,
  hideRenameModal,
  hideRemoveModal,
} from '../store/modalsSlice.js';
import AddChannelModal from '../modals/AddChannel.jsx';
import RenameChannelModal from '../modals/RenameChannel.jsx';
import RemoveChannelModal from '../modals/RemoveChannel.jsx';
import { useAuth } from '../AuthContext.jsx';
import socket from '../services/initSocket.js';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { token, user: username } = useAuth();

  const {
    isAddModalOpen,
    isRenameModalOpen,
    isRemoveModalOpen,
    channelToEdit,
  } = useSelector((state) => state.modals);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    dispatch(fetchChannels(headers));
    dispatch(fetchMessages(headers));
  }, [dispatch, token]);

  useEffect(() => {
    socket.on('newMessage', (messageData) => {
      dispatch(messagesActions.addMessage(messageData));
    });
    return () => {
      socket.off('newMessage');
    };
  }, [dispatch]);

  return (
    <div className="d-flex flex-column h-100">
      <Header />

      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <Channels />
          <Messages token={token} username={username} />
        </div>
      </div>

      <AddChannelModal
        show={isAddModalOpen}
        handleClose={() => dispatch(hideAddModal())}
      />
      <RenameChannelModal
        show={isRenameModalOpen}
        handleClose={() => dispatch(hideRenameModal())}
        channel={channelToEdit}
      />
      <RemoveChannelModal
        show={isRemoveModalOpen}
        handleClose={() => dispatch(hideRemoveModal())}
        channel={channelToEdit}
      />
    </div>
  );
};

export default ChatPage;
