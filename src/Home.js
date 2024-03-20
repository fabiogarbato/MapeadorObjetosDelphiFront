import './index.css';
import {Container, Row, Col, Button}  from 'react-bootstrap';
import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import NavBar from './Navbar';
import { FaMap } from 'react-icons/fa';

const App = () => {  

    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };

    useEffect(() => {
        document.body.style.overflowY = 'hidden';
        return () => {
          document.body.style.overflowY = 'auto';
        };
      }, []);

  return (
    <Container fluid style={{ backgroundColor: 'white', minHeight: '100vh' }}>
       <NavBar title="Migração HomePar" />
       <Container style={{ minHeight: '4vh'}}></Container>
        <Container className='d-flex flex-column justify-content-center align-items-center' style={{display: 'flex', flexDirection: 'column', minHeight: '70vh' }}>
            <Row className='mb-5'>
                <Col className='d-flex justify-content-center'>
                    <Link to="/MapMenu" style={{ textDecoration: 'none' }}>
                        <Button variant="success" className="btn-custom">
                            <FaMap /> Mapeador
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row className='mb-5'>
                <Col className='d-flex justify-content-center'>
                    <Link to="/Migrador" style={{ textDecoration: 'none' }}>
                        <Button variant="success" className="btn-custom">Migrador</Button>
                    </Link>
                </Col>
            </Row>
            <Row className='mb-5'>
                <Col className='d-flex justify-content-center'>
                    <Link to="/Relatorio" style={{ textDecoration: 'none' }}>
                        <Button variant="success" className="btn-custom">
                            Relatório
                        </Button>
                    </Link>
                </Col>
            </Row> 
            <Row className='mb-5'>
                <Col className='d-flex justify-content-center'>
                    <Button variant="danger" className="btn-custom" onClick={handleLogout}>
                        Sair
                    </Button>
                </Col>
            </Row>
        </Container>
        <Footer/>
  </Container>
  );
}

export default App;