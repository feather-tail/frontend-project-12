import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { channelsActions } from '../slices/channelsSlice.js';
import apiRoutes from '../routes/route.js';

const RemoveChannelModal = ({ show, handleClose, channel }) => {
  const dispatch = useDispatch();

  if (!channel) {
    return null;
  }

  const handleRemove = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Запрос на удаление канала
      await axios.delete(apiRoutes.channelPath(channel.id), { headers });

      // Экшен removeChannel в redux. Он также убирает все сообщения данного канала
      dispatch(channelsActions.removeChannel(channel.id));

      handleClose();
    } catch (err) {
      console.error('Ошибка при удалении канала:', err);
      // Обработку ошибки (UI) при желании можно добавить
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Уверены, что хотите удалить канал &laquo;{channel.name}&raquo;?
        <br />
        Все сообщения внутри него будут потеряны.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Отмена
        </Button>
        <Button variant="danger" onClick={handleRemove}>
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannelModal;
