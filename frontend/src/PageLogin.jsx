import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(6, 'Минимум 6 символов')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Минимум 6 символов')
    .required('Обязательное поле'),
});

const LoginForm = () => {
  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log('Отправка формы:', values);
        setSubmitting(false);
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <div>
            <label htmlFor='username'>Имя пользователя</label>
            <Field id='username' name='username' type='text' />
            {errors.username && touched.username ? (
              <div>{errors.username}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor='password'>Пароль</label>
            <Field id='password' name='password' type='password' />
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
