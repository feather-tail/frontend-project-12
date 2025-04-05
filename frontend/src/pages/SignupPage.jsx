import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form as RBForm,
  FloatingLabel,
} from 'react-bootstrap';
import apiRoutes from '../services/route.js';
import { initializeAuth } from '../store/authSlice.js';
import Header from '../components/Header.jsx';
import { useTranslation } from 'react-i18next';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('signup.errors.min3'))
      .max(20, t('signup.errors.max20'))
      .required(t('signup.errors.required')),
    password: Yup.string()
      .min(6, t('signup.errors.min6'))
      .required(t('signup.errors.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('signup.errors.passwordsNotMatch'))
      .required(t('signup.errors.required')),
  });

  const handleSubmit = async (
    { username, password },
    { setSubmitting, setErrors },
  ) => {
    try {
      const response = await axios.post(apiRoutes.signupPath(), {
        username,
        password,
      });
      const { token, username: registeredUser } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', registeredUser);
      dispatch(initializeAuth(token));
      navigate('/');
    } catch (error) {
      if (error.response?.status === 409) {
        setErrors({ username: t('signup.errors.userExists') });
      } else {
        setErrors({ username: t('signup.errorSignup') });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container fluid className='h-100 bg-light'>
      <Header />
      <Row className='justify-content-center align-items-center h-100'>
        <Col xs={12} md={8} xxl={6}>
          <Card className='shadow-sm'>
            <Card.Body className='p-5'>
              <h1 className='text-center mb-4'>{t('signup.title')}</h1>
              <Formik
                initialValues={{
                  username: '',
                  password: '',
                  confirmPassword: '',
                }}
                validationSchema={SignupSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <FloatingLabel
                      controlId='username'
                      label={t('signup.username')}
                      className='mb-3'
                    >
                      <Field
                        as={RBForm.Control}
                        name='username'
                        placeholder={t('signup.username')}
                        isInvalid={touched.username && !!errors.username}
                      />
                      <RBForm.Control.Feedback type='invalid'>
                        {errors.username}
                      </RBForm.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel
                      controlId='password'
                      label={t('signup.password')}
                      className='mb-3'
                    >
                      <Field
                        as={RBForm.Control}
                        name='password'
                        type='password'
                        placeholder={t('signup.password')}
                        isInvalid={touched.password && !!errors.password}
                      />
                      <RBForm.Control.Feedback type='invalid'>
                        {errors.password}
                      </RBForm.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel
                      controlId='confirmPassword'
                      label={t('signup.confirmPassword')}
                      className='mb-4'
                    >
                      <Field
                        as={RBForm.Control}
                        name='confirmPassword'
                        type='password'
                        placeholder={t('signup.confirmPassword')}
                        isInvalid={
                          touched.confirmPassword && !!errors.confirmPassword
                        }
                      />
                      <RBForm.Control.Feedback type='invalid'>
                        {errors.confirmPassword}
                      </RBForm.Control.Feedback>
                    </FloatingLabel>

                    <Button
                      type='submit'
                      variant='primary'
                      className='w-100'
                      disabled={isSubmitting}
                    >
                      {t('signup.button')}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;
