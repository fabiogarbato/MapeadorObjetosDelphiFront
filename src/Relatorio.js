import './Relatorio.css';
import {Container, Row, Col, Image, Button, Modal}  from 'react-bootstrap';
import React, { useState } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Mps from './images/mps.png'
import { Link } from 'react-router-dom';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend);


const Relatorio = () => {  

    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const telasMapeadas = 200;
    const telasFaltantes = 50;

    const data = {
        labels: ['Telas Migradas', 'Telas Faltantes'],
        datasets: [
            {
                data: [telasMapeadas, telasFaltantes],
                backgroundColor: ['#4CAF50', '#F44336'],
                hoverBackgroundColor: ['#66BB6A', '#EF5350']
            }
        ]
    };


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
            <Container style={{ minHeight: '5vh'}}></Container>
            <Container className='my-5 p-5 bg-white shadow-lg rounded'>
                <Row className="justify-content-center text-center mb-5">
                    <Col>
                        <h1 className="display-4 fw-bold">Relatório Gerencial</h1>
                        <p className="lead text-muted">Uma visão geral do progresso do projeto.</p>
                        <hr />
                    </Col>
                </Row>
                
                <Row className="mb-4 align-items-center">
                    <Col md={6}>
                        <h2 className="h3">Resumo do Projeto</h2>
                        <p>Migração do banco de dados do HomePar (Sybase -- SQL Server) </p>
                    </Col>
                    <Col md={6}>
                        <h2 className="h3">Gerente de Projetos</h2>
                        <p><strong>Nome:</strong> Juliana Petry</p>
                        <p><strong>Email:</strong> juliana.petry@mps.com.br</p>
                    </Col>
                </Row>
                
                <Row className="mb-5">
                    <Col md={6} className="mb-4">
                        <h2 className="h3">Cronograma do Projeto</h2>
                        <Button variant="outline-success" onClick={handleShow} className="mt-2">
                            Ver Cronograma
                        </Button>
                        
                    </Col>
                    <Col md={6} className="mb-4">
                        <h2 className="h3">Status de Migração</h2>
                        <Button variant="outline-success" onClick={handleShow} className="mt-2">
                            Ver Status
                        </Button>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col md={6}>
                        <h2 className="h3">Riscos e Problemas</h2>
                        <ul className="list-unstyled">
                            <li><i className="bi bi-exclamation-triangle-fill text-warning me-2"></i> <strong>Risco:</strong> Entregar o projeto a tempo</li>
                            <li><i className="bi bi-exclamation-triangle-fill text-warning me-2"></i><strong>Problema:</strong>  Não há um padrão, as exceções precisam ser tratadas com cuidado</li>
                        </ul>
                    </Col>
                    <Col md={6}>
                        <h2 className="h3">Previsão de entrega</h2>
                        <ul className="list-unstyled">
                            <li><i className="bi bi-check-circle-fill text-success me-2"></i>Fev/2025</li>
                        </ul>
                    </Col>
                </Row>
                <Modal show={showModal} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Status de Migração</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Pie data={data} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={handleClose}>
                            Fechar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
            <Container style={{ minHeight: '10vh'}}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <Button variant="success" className="shadow-sm" style={{ width: '100px', height:'50px' }}>
                        Voltar
                    </Button>
                </Link>
            </Container>
            <Container style={{ minHeight: '4vh'}}></Container>
            <footer className="footer">
                <Container fluid>
                    <p className="mb-0">© Fábio Garbato - MPS Informática - {new Date().getFullYear()}</p>
                </Container>
            </footer>
        </Container>
    );
  }
  
  export default Relatorio;