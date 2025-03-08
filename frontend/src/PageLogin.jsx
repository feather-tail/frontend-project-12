import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginForm = () => (
  <Formik
    initialValues={{ username: '', password: '' }}
    validationSchema={Yup.object().shape({
      username: Yup.string().required('Обязательное поле'),
      password: Yup.string().required('Обязательное поле'),
    })}
    onSubmit={(values, { setSubmitting }) => {
      console.log('Данные формы:', values);
      setSubmitting(false);
    }}
  >
    {({ isSubmitting }) => (
      <Form>
        <div className='form-group'>
          <label htmlFor='username'>Имя пользователя:</label>
          <Field
            type='text'
            name='username'
            id='username'
            className='form-control'
          />
          <ErrorMessage name='username' component='div' className='error' />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Пароль:</label>
          <Field
            type='password'
            name='password'
            id='password'
            className='form-control'
          />
          <ErrorMessage name='password' component='div' className='error' />
        </div>
        <button type='submit' disabled={isSubmitting}>
          Войти
        </button>
      </Form>
    )}
  </Formik>
);

export { LoginForm as PageLogin };
