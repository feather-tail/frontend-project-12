import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { Container, Row, Col, Card, Button, Image, Form as RBForm, FloatingLabel } from 'react-bootstrap';
import { loginUser } from './slices/authSlice';
import { useNavigate } from 'react-router-dom';

import Header from './Header.jsx';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(5, 'Минимум 5 символов')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(5, 'Минимум 5 символов')
    .required('Обязательное поле'),
});

const PageLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

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
              <Col md={6} className="d-flex align-items-center justify-content-center">
                <Image
                  src="/assets/avatar-DIE1AEpS.jpg"
                  roundedCircle
                  alt="Войти"
                />
              </Col>

              <Col md={6} className="mt-3 mt-md-0">
                <h1 className="text-center mb-4">Войти</h1>

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
                        label="Ваш ник"
                        className="mb-3"
                      >
                        <Field
                          as={RBForm.Control}
                          type="text"
                          name="username"
                          placeholder="Ваш ник"
                          isInvalid={touched.username && !!errors.username}
                        />
                        <RBForm.Control.Feedback type="invalid">
                          {errors.username}
                        </RBForm.Control.Feedback>
                      </FloatingLabel>

                      <FloatingLabel
                        controlId="password"
                        label="Пароль"
                        className="mb-4"
                      >
                        <Field
                          as={RBForm.Control}
                          type="password"
                          name="password"
                          placeholder="Пароль"
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
                        Войти
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Col>
            </Card.Body>

            <Card.Footer className="p-4">
              <div className="text-center">
                <span>Нет аккаунта?</span>{' '}
                <Card.Link href="/signup">Регистрация</Card.Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PageLogin;
