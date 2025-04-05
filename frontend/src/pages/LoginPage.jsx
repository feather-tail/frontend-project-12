import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Image,
  Form as RBForm,
  FloatingLabel,
} from 'react-bootstrap';
import { loginUser } from '../store/authSlice.js';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const { error } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuth) {
      navigate('/');
    }
  }, [isAuth, navigate]);

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('login.errors.min3'))
      .required(t('login.errors.required')),
    password: Yup.string()
      .min(3, t('login.errors.min3'))
      .required(t('login.errors.required')),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const resultAction = await dispatch(loginUser(values));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate('/');
    }
    setSubmitting(false);
  };

  return (
    <Container fluid className="h-100 bg-light">
      <Header />
      <Row className="justify-content-center align-items-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <Col
                md={6}
                className="d-flex align-items-center justify-content-center"
              >
                <Image
                  src="https://frontend-chat-ru.hexlet.app/assets/avatar-DIE1AEpS.jpg"
                  roundedCircle
                  alt={t('login.title')}
                />
              </Col>
              <Col md={6} className="mt-3 mt-md-0">
                <h1 className="text-center mb-4">{t('login.title')}</h1>

                {error && <div style={{ color: 'red' }}>{error}</div>}

                <Formik
                  initialValues={{ username: '', password: '' }}
                  validationSchema={LoginSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, isSubmitting }) => (
                    <Form>
                      <FloatingLabel
                        controlId="username"
                        label={t('login.placeholder.username')}
                        className="mb-3"
                      >
                        <Field
                          as={RBForm.Control}
                          type="text"
                          name="username"
                          placeholder={t('login.placeholder.username')}
                          isInvalid={touched.username && !!errors.username}
                        />
                        <RBForm.Control.Feedback type="invalid">
                          {errors.username}
                        </RBForm.Control.Feedback>
                      </FloatingLabel>

                      <FloatingLabel
                        controlId="password"
                        label={t('login.placeholder.password')}
                        className="mb-4"
                      >
                        <Field
                          as={RBForm.Control}
                          type="password"
                          name="password"
                          placeholder={t('login.placeholder.password')}
                          isInvalid={touched.password && !!errors.password}
                        />
                        <RBForm.Control.Feedback type="invalid">
                          {errors.password}
                        </RBForm.Control.Feedback>
                      </FloatingLabel>

                      <Button
                        type="submit"
                        variant="outline-primary"
                        className="w-100 mb-3"
                        disabled={isSubmitting}
                      >
                        {t('login.button')}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Col>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('login.noAccount')}</span>{' '}
                <Card.Link href="/signup">{t('login.signupLink')}</Card.Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
