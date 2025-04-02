import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form as RBForm, FloatingLabel } from 'react-bootstrap';
import apiRoutes from './routes/route.js';
import { initializeAuth } from './slices/authSlice';
import Header from './Header.jsx';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Не менее 6 символов')
    .required('Обязательное поле'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
    .required('Обязательное поле'),
});

const PageSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async ({ username, password }, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(apiRoutes.signupPath(), { username, password });
      const { token, username: registeredUser } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', registeredUser);
      dispatch(initializeAuth(token));
      navigate('/');
    } catch (error) {
      if (error.response?.status === 409) {
        setErrors({ username: 'Пользователь с таким именем уже существует' });
      } else {
        setErrors({ username: 'Ошибка регистрации. Попробуйте ещё раз.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container fluid className="h-100 bg-light">
      <Header />
      <Row className="justify-content-center align-items-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-5">
              <h1 className="text-center mb-4">Регистрация</h1>
              <Formik
                initialValues={{ username: '', password: '', confirmPassword: '' }}
                validationSchema={SignupSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <FloatingLabel controlId="username" label="Имя пользователя" className="mb-3">
                      <Field
                        as={RBForm.Control}
                        name="username"
                        placeholder="Имя пользователя"
                        isInvalid={touched.username && !!errors.username}
                      />
                      <RBForm.Control.Feedback type="invalid">
                        {errors.username}
                      </RBForm.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel controlId="password" label="Пароль" className="mb-3">
                      <Field
                        as={RBForm.Control}
                        name="password"
                        type="password"
                        placeholder="Пароль"
                        isInvalid={touched.password && !!errors.password}
                      />
                      <RBForm.Control.Feedback type="invalid">
                        {errors.password}
                      </RBForm.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel controlId="confirmPassword" label="Подтвердите пароль" className="mb-4">
                      <Field
                        as={RBForm.Control}
                        name="confirmPassword"
                        type="password"
                        placeholder="Подтвердите пароль"
                        isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                      />
                      <RBForm.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </RBForm.Control.Feedback>
                    </FloatingLabel>

                    <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting}>
                      Зарегистрироваться
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

export default PageSignup;
