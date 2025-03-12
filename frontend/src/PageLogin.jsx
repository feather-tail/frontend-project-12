import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(5, 'Минимум 5 символов')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(5, 'Минимум 5 символов')
    .required('Обязательное поле'),
});

const LoginForm = () => {
  const url = '/api';
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const response = await axios.post(url, {
            name: values.username,
            password: values.password,
          });
          console.log(response.data);
          localStorage.setItem('token', response.data.token);
          navigate('/');
        } catch (error) {
          console.log('Ошибка авторизации:', error.response.data.message);
          navigate('/Page401');
        }
        setSubmitting(false);
      }}
    >
      {({ values, errors, touched }) => (
        <Form>
          <div>
            <label htmlFor='username'>Имя пользователя</label>
            <Field
              id='username'
              name='username'
              type='text'
              value={values.username}
            />
            {errors.username && touched.username ? (
              <div>{errors.username}</div>
            ) : null}
          </div>
          <div>
            <label htmlFor='password'>Пароль</label>
            <Field
              id='password'
              name='password'
              type='password'
              value={values.password}
            />
            {errors.password && touched.password ? (
              <div>{errors.password}</div>
            ) : null}
          </div>

          <button type='submit'>Войти</button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
