import './MapMenu.css';
import {Container, Row, Col, Button}  from 'react-bootstrap';
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import NavBar from './Navbar';

const MapMenu = () => {  
  return (
    <Container fluid style={{ backgroundColor: 'white', minHeight: '100vh' }}>
        <NavBar title="Migração HomePar" />
        <Container className='d-flex flex-column justify-content-center align-items-center' style={{display: 'flex', flexDirection: 'column', minHeight: '70vh' }}>
            <Row className='mb-5'>
                <Col className='d-flex justify-content-center'>
                    <Link to="/mapeador" style={{ textDecoration: 'none' }}>
                        <Button variant="success" style={{ width: '300px', height:'100px' }}>
                            Sombra
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row className='mb-5'>
                <Col className='d-flex justify-content-center'>
                <Link to="/mapeadorDataModule" style={{ textDecoration: 'none' }}> 
                    <Button variant="success" style={{ width: '300px', height:'100px' }}>DataModule</Button>
                </Link>
                </Col>
            </Row>  
        </Container>
        <Footer/>
  </Container>
  );
}

export default MapMenu;