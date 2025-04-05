import leoProfanity from 'leo-profanity';
import React, { useEffect, useState } from 'react';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header.jsx';
import AddChannelModal from '../modals/AddChannel.jsx';
import RemoveChannelModal from '../modals/RemoveChannel.jsx';
import RenameChannelModal from '../modals/RenameChannel.jsx';
import socket from '../services/initSocket';
import {
  channelsActions,
  selectAllChannels,
  selectCurrentChannel,
  selectCurrentChannelId,
} from '../store/channelsSlice.js';
import { fetchChannels, fetchMessages } from '../store/fetchData.js';
import {
  messagesActions,
  selectCurrentChannelMessages,
} from '../store/messagesSlice.js';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [newMessage, setNewMessage] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [modalChannel, setModalChannel] = useState(null);

  const token = useSelector((state) => state.auth.token);
  const username = useSelector((state) => state.auth.user);

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

    const sanitized = leoProfanity.clean(trimmed);
    const payload = {
      channelId: currentChannelId,
      body: sanitized,
      username,
    };

    try {
      await fetch('/api/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      setNewMessage('');
    } catch (err) {
      console.error(t('chat.sendError'), err);
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      <Header />

      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
              <b>{t('chat.channelsTitle')}</b>
              <button
                type="button"
                className="p-0 text-primary btn btn-group-vertical"
                onClick={() => setShowAddModal(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
                <span className="visually-hidden">+</span>
              </button>
            </div>

            <ul
              className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
              id="channels-box"
            >
              {channels.map((channel) => (
                <li className="nav-item w-100" key={channel.id}>
                  <div className="btn-group dropdown d-flex">
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
                    {channel.removable && (
                      <Dropdown as={ButtonGroup}>
                        <Dropdown.Toggle
                          split
                          variant={
                            channel.id === currentChannelId
                              ? 'secondary'
                              : 'light'
                          }
                          id={`dropdown-${channel.id}`}
                        >
                          <span className="visually-hidden">
                            {t('chat.channelManagement')}
                          </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => {
                              setModalChannel(channel);
                              setShowRenameModal(true);
                            }}
                          >
                            {t('chat.renameChannel')}
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              setModalChannel(channel);
                              setShowRemoveModal(true);
                            }}
                          >
                            {t('chat.removeChannel')}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="col p-0 h-100">
            <div className="d-flex flex-column h-100">
              <div className="bg-light mb-4 p-3 shadow-sm small">
                <p className="m-0">
                  <b>
                    #
                    {currentChannel?.name}
                  </b>
                </p>
                <span className="text-muted">
                  {t('chat.messagesCounter', { count: messages.length })}
                </span>
              </div>

              <div
                id="messages-box"
                className="chat-messages overflow-auto px-5"
              >
                {messages.map((msg) => (
                  <div key={msg.id} className="text-break mb-2">
                    <b>
                      {msg.username || 'user'}
                      :
                    </b>
                    {' '}
                    {msg.body}
                  </div>
                ))}
              </div>

              <div className="mt-auto px-5 py-3">
                <form
                  className="py-1 border rounded-2"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="input-group has-validation">
                    <input
                      name="body"
                      aria-label={t('chat.form.ariaLabel')}
                      placeholder={t('chat.form.placeholder')}
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
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.854 7.646a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L14.293 8H1.5a.5.5 0 0 1 0-1h12.793l-2.147-2.146a.5.5 0 1 1 .708-.708l3 3z" />
                      </svg>
                      <span className="visually-hidden">
                        {t('chat.form.send')}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddChannelModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
      />
      <RenameChannelModal
        show={showRenameModal}
        handleClose={() => setShowRenameModal(false)}
        channel={modalChannel}
      />
      <RemoveChannelModal
        show={showRemoveModal}
        handleClose={() => setShowRemoveModal(false)}
        channel={modalChannel}
      />
    </div>
  );
};

export default ChatPage;
