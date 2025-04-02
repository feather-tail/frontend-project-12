import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { channelsActions } from '../slices/channelsSlice.js';
import apiRoutes from '../routes/route.js';
import { useTranslation } from 'react-i18next';

const RemoveChannelModal = ({ show, handleClose, channel }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  if (!channel) {
    return null;
  }

  const handleRemove = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Запрос на удаление канала
      await axios.delete(apiRoutes.channelPath(channel.id), { headers });
      dispatch(channelsActions.removeChannel(channel.id));

      handleClose();
    } catch (err) {
      console.error(t('removeChannel.error'), err);
      // При необходимости выводить пользовательскую ошибку в UI
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('removeChannel.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t('removeChannel.body', { channelName: channel.name })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('modal.cancel')}
        </Button>
        <Button variant="danger" onClick={handleRemove}>
          {t('modal.remove')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannelModal;
