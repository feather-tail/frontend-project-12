import React from 'react';
import {
  Button, Col, Container, Row,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Page404 = () => (
  <Container className="h-100 d-flex flex-column justify-content-center align-items-center">
    <Row>
      <Col className="text-center">
        <h1 className="display-1">404</h1>
        <h2 className="mb-4">Ошибка 404. Страница не существует.</h2>
        <Button as={Link} to="/" variant="primary">
          Вернуться на главную
        </Button>
      </Col>
    </Row>
  </Container>
);

export default Page404;
