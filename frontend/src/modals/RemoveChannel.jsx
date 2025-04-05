import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { channelsActions } from '../store/channelsSlice.js';
import apiRoutes, { getAuthHeader } from '../services/route.js';

const RemoveChannelModal = ({ show, handleClose, channel }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  if (!channel) {
    return null;
  }

  const handleRemove = async () => {
    try {
      const headers = getAuthHeader();
      await axios.delete(apiRoutes.channelPath(channel.id), { headers });
      dispatch(channelsActions.removeChannel(channel.id));

      toast.success(t('notifications.channelRemoved'));
      handleClose();
    } catch (err) {
      console.error(t('removeChannel.error'), err);
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
