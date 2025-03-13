import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from './slices/authSlice';
import { useSelector } from 'react-redux';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(5, 'Минимум 5 символов')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(5, 'Минимум 5 символов')
    .required('Обязательное поле'),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  return (
    <>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const resultAction = await dispatch(loginUser(values));
          if (loginUser.fulfilled.match(resultAction)) {
            navigate('/');
          } else {
            console.log('Ошибка авторизации:', resultAction.payload);
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
    </>
  );
};

export default LoginForm;
