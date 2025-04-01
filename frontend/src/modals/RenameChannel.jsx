import React, { useRef, useEffect } from 'react';
import {
  Modal, Button, Form,
} from 'react-bootstrap';
import {
  Formik, Form as FormikForm, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import { selectAllChannels, channelsActions } from '../slices/channelsSlice.js';
import apiRoutes from '../routes/route.js';

const RenameChannelModal = ({ show, handleClose, channel }) => {
  const dispatch = useDispatch();
  const channels = useSelector(selectAllChannels);
  // Исключаем текущее имя канала из списка (чтобы не запрещать вводить то же самое имя)
  const channelNames = channels.map((ch) => ch.name).filter((name) => name !== channel?.name);

  // Ссылка на input для выделения текста при открытии
  const inputRef = useRef(null);
  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select(); // Выделяем старое название, чтобы удобнее было сразу ввести новое
    }
  }, [show]);

  if (!channel) {
    return null; // или можно выводить пустую разметку
  }

  // Схема валидации
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Не менее 3 символов')
      .max(20, 'Не более 20 символов')
      .required('Обязательное поле')
      .notOneOf(channelNames, 'Имя уже используется'),
  });

  const handleSubmit = async ({ name }, { setSubmitting, setErrors }) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Запрос на сервер для переименования
      const { data } = await axios.patch(apiRoutes.channelPath(channel.id), { name }, { headers });

      // Обновляем Redux (можно через сокет, но здесь напрямую)
      dispatch(channelsActions.renameChannel({ id: channel.id, changes: { name: data.name } }));

      handleClose();
    } catch (err) {
      setErrors({ name: 'Ошибка при переименовании канала' });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={{ name: channel.name }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <Form as={FormikForm}>
            <Modal.Body>
              <Form.Group controlId="channelName">
                <Form.Label className="visually-hidden">Имя канала</Form.Label>
                <Field
                  as={Form.Control}
                  name="name"
                  type="text"
                  placeholder="Новое имя канала"
                  innerRef={inputRef}
                />
                <div className="invalid-feedback d-block">
                  <ErrorMessage name="name" />
                </div>
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                Отмена
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                Сохранить
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default RenameChannelModal;
