import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import leoProfanity from 'leo-profanity';
import { useAuth } from '../AuthContext.jsx';
import {
  selectCurrentChannel,
  selectCurrentChannelId,
} from '../store/channelsSlice.js';
import { selectCurrentChannelMessages } from '../store/messagesSlice.js';

const Messages = () => {
  const { t } = useTranslation();
  const [newMessage, setNewMessage] = useState('');

  const messages = useSelector(selectCurrentChannelMessages);
  const currentChannel = useSelector(selectCurrentChannel);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const { token, user: username } = useAuth();

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

        <div id="messages-box" className="chat-messages overflow-auto px-5">
          {messages.map((msg) => (
            <div key={msg.id} className="text-break mb-2">
              <b>
                {msg.username || 'user'}
              </b>
              {': '}
              {msg.body}
            </div>
          ))}
        </div>

        <div className="mt-auto px-5 py-3">
          <form className="py-1 border rounded-2" onSubmit={handleSubmit} noValidate>
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
                <img src="/assets/send.svg" alt="Send" width={20} height={20} />
                <span className="visually-hidden">{t('chat.form.send')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messages;
