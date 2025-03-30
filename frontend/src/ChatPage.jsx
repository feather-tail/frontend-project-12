import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchChannels, fetchMessages } from './slices/fetchData.js';

import {
  selectAllChannels,
  selectCurrentChannel,
  selectCurrentChannelId,
  channelsActions,
} from './slices/channelsSlice.js';

import {
  selectCurrentChannelMessages,
  messagesActions,
} from './slices/messagesSlice.js';

import socket from './initSocket';

const ChatPage = () => {
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState('');

  const token = useSelector((state) => state.auth.token);
  const username = useSelector((state) => state.auth.user);
  const headers = { Authorization: `Bearer ${token}` };

  // Загружаем каналы и сообщения при старте
  useEffect(() => {
    dispatch(fetchChannels(headers));
    dispatch(fetchMessages(headers));
  }, [dispatch, token]);

  // Подписываемся на событие сокета "newMessage"
  useEffect(() => {
    socket.on('newMessage', (messageData) => {
      dispatch(messagesActions.addMessage(messageData));
    });

    return () => {
      socket.off('newMessage');
    };
  }, [dispatch]);

  const channels = useSelector(selectAllChannels);
  const currentChannel = useSelector(selectCurrentChannel);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const messages = useSelector(selectCurrentChannelMessages);

  const handleChannelClick = (id) => {
    dispatch(channelsActions.changeChannel(id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = newMessage.trim();
    if (!trimmed) return;
  
    const payload = {
      channelId: currentChannelId,
      body: trimmed,
      username,
    };
  
    try {
      await fetch('http://localhost:5001/api/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      setNewMessage('');
    } catch (err) {
      console.error('Ошибка при отправке сообщения:', err);
    }
  };  

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>Каналы</b>
            <button
              type="button"
              className="p-0 text-primary btn btn-group-vertical"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="20"
                height="20"
                fill="currentColor"
              ></svg>
              <span className="visually-hidden">+</span>
            </button>
          </div>
          <ul
            id="channels-box"
            className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
          >
            {channels.map((channel) => (
              <li className="nav-item w-100" key={channel.id}>
                <button
                  type="button"
                  className={`w-100 rounded-0 text-start btn ${
                    channel.id === currentChannelId ? 'btn-secondary' : ''
                  }`}
                  onClick={() => handleChannelClick(channel.id)}
                >
                  <span className="me-1">#</span>
                  {channel.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b>{currentChannel?.name || ''}</b>
              </p>
              <span className="text-muted">
                {messages.length} сообщений
              </span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5">
              {messages.map((msg) => (
                <div key={msg.id} className="text-break mb-2">
                  <b>{msg.username || 'user'}:</b> {msg.body}
                </div>
              ))}
            </div>
            <div className="mt-auto px-5 py-3">
              <form
                noValidate=""
                className="py-1 border rounded-2"
                onSubmit={handleSubmit}
              >
                <div className="input-group has-validation">
                  <input
                    name="body"
                    aria-label="Новое сообщение"
                    placeholder="Введите сообщение..."
                    className="border-0 p-0 ps-2 form-control"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="btn btn-group-vertical"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      width="20"
                      height="20"
                      fill="currentColor"
                    ></svg>
                    <span className="visually-hidden">Отправить</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
