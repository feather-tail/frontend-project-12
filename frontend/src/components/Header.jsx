import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';
import { logout } from '../store/authSlice';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const { t } = useTranslation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Navbar bg='white' variant='light' expand='lg' className='shadow-sm'>
      <Container>
        <Navbar.Brand as={Link} to='/'>
          {t('header.brand')}
        </Navbar.Brand>
        {isAuth && (
          <Button variant='primary' onClick={handleLogout}>
            {t('header.logout')}
          </Button>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
