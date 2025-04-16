import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import {
  selectAllChannels,
  selectCurrentChannelId,
  channelsActions,
} from '../store/channelsSlice.js';
import { modalsActions } from '../store/modalsSlice.js';

import addIcon from '../assets/add.svg';

const Channels = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const channels = useSelector(selectAllChannels);
  const currentChannelId = useSelector(selectCurrentChannelId);

  const handleChannelClick = (id) => {
    dispatch(channelsActions.changeChannel(id));
  };

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('chat.channelsTitle')}</b>
        <button
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
          onClick={() => dispatch(modalsActions.openAddModal())}
        >
          <img src={addIcon} alt="Add" width={20} height={20} />
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
                    variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                    id={`dropdown-${channel.id}`}
                  >
                    <span className="visually-hidden">{t('chat.channelManagement')}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => dispatch(modalsActions.openRenameModal(channel))}
                    >
                      {t('chat.renameChannel')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => dispatch(modalsActions.openRemoveModal(channel))}
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
  );
};

export default Channels;
