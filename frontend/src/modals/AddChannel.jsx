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

const AddChannelModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const channels = useSelector(selectAllChannels);
  const channelNames = channels.map((ch) => ch.name);

  // Ссылка на input, чтобы фокусировать при появлении окна
  const inputRef = useRef(null);
  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  // Схема валидации названия
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Не менее 3 символов')
      .max(20, 'Не более 20 символов')
      .required('Обязательное поле')
      .notOneOf(channelNames, 'Имя уже существует'),
  });

  const handleSubmit = async ({ name }, { setSubmitting, setErrors }) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Отправляем запрос на создание канала
      const { data } = await axios.post(apiRoutes.channelsPath(), { name }, { headers });
      // После успешного ответа сразу добавляем канал в Redux и переключаемся
      dispatch(channelsActions.addChannel(data));
      dispatch(channelsActions.changeChannel(data.id));

      // Закрываем модал
      handleClose();
    } catch (err) {
      // Ловим и выводим возможную ошибку
      // (В реальном проекте лучше обработать более детально)
      setErrors({ name: 'Ошибка при создании канала' });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={{ name: '' }}
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
                  placeholder="Имя канала"
                  ref={inputRef} // для фокуса при открытии
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
                Отправить
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddChannelModal;
