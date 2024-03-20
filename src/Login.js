import React, { useState, useEffect  } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './Footer';
import NavBar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';
import {showMessageSuccess, showMessageError} from './utils.js';
import { useAuth } from './AuthProvider';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const navigate = useNavigate();

  const { setIsAuthenticated } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, senha })
      });
  
      if (response.ok) {
        showMessageSuccess("Usuário Logado!")
        navigate('/Home');
        setIsAuthenticated(true); 
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        showMessageError("Login ou senha incorretos.")
      }
    } catch (error) {
      console.error('Erro na solicitação:', error);
    }
  };

  useEffect(() => {
    document.body.style.overflowY = 'hidden';
    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, []);

  return (
    <Container fluid style={{ backgroundColor: 'white'}}>
      <NavBar title="Migração HomePar" />
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "75vh"}}>
        <Card className="p-5" style={{ backgroundColor:'#90EE90'}}> 
          <Row className="justify-content-md-center">
            <Col md={12}>
              <h1 className="text-center mb-4">Login</h1>
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formUsuario">
                  <Form.Label style={{ fontFamily: 'Fira Sans Condensed', fontWeight: 'bold', fontSize:'20px' }}>Usuário</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite seu usuário"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formSenha" className="mb-3"> 
                  <Form.Label style={{ fontFamily: 'Fira Sans Condensed', fontWeight: 'bold', fontSize:'20px' }}>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </Form.Group>
                <div className="d-flex justify-content-center"> 
                  <Button variant="success" type="submit">
                    Entrar
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Card>
      </Container>
      <Footer/>
  </Container>
  );
}

export default Login;
