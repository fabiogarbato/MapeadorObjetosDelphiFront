import './index.css';
import {Container, Row, Col, Image, Button}  from 'react-bootstrap';
import React, { useState, useEffect } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Mps from './images/mps.png'
import { Link } from 'react-router-dom';

const App = () => {  
  return (
    <Container fluid style={{ backgroundColor: 'white', minHeight: '100vh' }}>
        <Navbar id='inicio' expand="lg" style={{ backgroundColor: '#98FB98', minWidth: '100vh'}}>
            <Row className="w-100">
                <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-start">
                    <Navbar.Brand>
                        <Image src={Mps} alt="Logo" style={{ maxHeight: '15vh', marginRight: '10px'}} />
                    </Navbar.Brand>
                </Col>
                <Col xs={12} md={4} className="d-flex justify-content-center align-items-center">
                    <span className='fira-sans-condensed-black' style={{ fontSize: '35px', color: '#2b2928'}}>
                        Migração HomePar - PCL
                    </span>
                </Col>
            </Row>
        </Navbar>
        <Container className='d-flex flex-column justify-content-center align-items-center' style={{display: 'flex', flexDirection: 'column', minHeight: '70vh' }}>
            <Row className='mb-5'>
                <Col className='d-flex justify-content-center'>
                    <Link to="/mapeador" style={{ textDecoration: 'none' }}>
                        <Button variant="success" style={{ width: '300px', height:'100px' }}>
                            Mapeador
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row className='mb-5'>
                <Col className='d-flex justify-content-center'>
                    <Button variant="success" style={{ width: '300px', height:'100px' }}>Migrador</Button>
                </Col>
            </Row>
            <Row className='mb-5'>
                <Col className='d-flex justify-content-center'>
                    <Button variant="success" style={{ width: '300px', height:'100px' }}>Relatório</Button>
                </Col>
            </Row>      
        </Container>
        <footer className="footer">
            <Container fluid>
                <p className="mb-0">© Fábio Garbato - MPS Informática - {new Date().getFullYear()}</p>
            </Container>
        </footer>
  </Container>
  );
}

export default App;