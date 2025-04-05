import React, { useRef, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { selectAllChannels, channelsActions } from '../store/channelsSlice.js';
import apiRoutes, { getAuthHeader } from '../services/route.js';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';

const AddChannelModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const channels = useSelector(selectAllChannels);
  const channelNames = channels.map((ch) => ch.name);
  const { t } = useTranslation();

  const inputRef = useRef(null);
  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('signup.errors.min3'))
      .max(20, t('signup.errors.max20'))
      .required(t('signup.errors.required'))
      .notOneOf(channelNames, t('renameChannel.errors.nameExists')),
  });

  const handleSubmit = async ({ name }, { setSubmitting, setErrors }) => {
    try {
      const sanitizedName = leoProfanity.clean(name);
      const headers = getAuthHeader();

      const { data } = await axios.post(
        apiRoutes.channelsPath(),
        { name: sanitizedName },
        { headers },
      );

      dispatch(channelsActions.addChannel(data));
      dispatch(channelsActions.changeChannel(data.id));

      toast.success(t('notifications.channelCreated'));
      handleClose();
    } catch (err) {
      setErrors({ name: t('addChannel.error') });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('addChannel.title')}</Modal.Title>
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
                <Form.Label className="visually-hidden">
                  {t('addChannel.placeholder')}
                </Form.Label>
                <Field
                  as={Form.Control}
                  name="name"
                  type="text"
                  placeholder={t('addChannel.placeholder')}
                  ref={inputRef}
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
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {t('modal.submit')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddChannelModal;
