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
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const RenameChannelModal = ({ show, handleClose, channel }) => {
  const dispatch = useDispatch();
  const channels = useSelector(selectAllChannels);
  const { t } = useTranslation();

  // Исключаем текущее имя канала из списка, чтобы не блокировать ввод того же самого
  const channelNames = channels
    .map((ch) => ch.name)
    .filter((name) => name !== channel?.name);

  // Фокус и выделение при открытии модалки
  const inputRef = useRef(null);
  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [show]);

  if (!channel) {
    return null;
  }

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('renameChannel.errors.min3'))    // "Не менее 3 символов"
      .max(20, t('renameChannel.errors.max20'))  // "Не более 20 символов"
      .required(t('renameChannel.errors.required'))
      .notOneOf(channelNames, t('renameChannel.errors.nameExists')),
  });

  const handleSubmit = async ({ name }, { setSubmitting, setErrors }) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Запрос на переименование
      const { data } = await axios.patch(
        apiRoutes.channelPath(channel.id),
        { name },
        { headers },
      );

      // Обновляем Redux
      dispatch(channelsActions.renameChannel({
        id: channel.id,
        changes: { name: data.name },
      }));

      toast.success(t('notifications.channelRenamed'));

      handleClose();
    } catch (err) {
      // Общая ошибка, если что-то пошло не так
      setErrors({ name: t('renameChannel.error') });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('renameChannel.title')}</Modal.Title>
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
                <Form.Label className="visually-hidden">
                  {t('renameChannel.placeholder')}
                </Form.Label>
                <Field
                  as={Form.Control}
                  name="name"
                  type="text"
                  placeholder={t('renameChannel.placeholder')}
                  innerRef={inputRef}
                />
                <div className="invalid-feedback d-block">
                  <ErrorMessage name="name" />
                </div>
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                {t('modal.cancel')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {t('modal.save')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default RenameChannelModal;
