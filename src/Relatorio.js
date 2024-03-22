import './Relatorio.css';
import {Container, Row, Col, Button, Modal}  from 'react-bootstrap';
import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import 'react-calendar/dist/Calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import Cronograma from './Cronograma.js'
import StatusMigracao  from './statusMigracao.js'
import Footer from './Footer';
import NavBar from './Navbar';


Chart.register(ArcElement, Tooltip, Legend);

const Relatorio = () => {  

    const [showCronogramaModal, setShowCronogramaModal] = useState(false);

    const handleCronogramaShow = () => {
      setShowCronogramaModal(true);
    };

    const [showModal, setShowModal] = useState(false);

    const handleShow = () => {
        setShowModal(true);
    };

    return (
      <Container fluid style={{ backgroundColor: 'white', minHeight: '100vh' }}>
            <NavBar title="Migração HomePar" />
            <Container style={{ minHeight: '5vh'}}></Container>
            <Container style={{ minHeight: '10vh'}}>
                <Link to="/Home" style={{ textDecoration: 'none' }}>
                    <Button variant="success" className="shadow-sm" style={{ width: '100px', height:'50px' }}>
                        Voltar
                    </Button>
                </Link>
            </Container>
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
                        <Button variant="outline-success" onClick={handleCronogramaShow} className="mt-2">
                            Ver Cronograma
                        </Button>
                        <Cronograma show={showCronogramaModal} onHide={() => setShowCronogramaModal(false)} />
                    </Col>
                    <Col md={6} className="mb-4">
                        <h2 className="h3">Status de Migração</h2>
                        <Button variant="outline-success" onClick={handleShow} className="mt-2">
                            Ver Status
                        </Button>
                        <StatusMigracao show={showModal} onHide={() => setShowModal(false)} />
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col md={6}>
                        <h2 className="h3">Riscos e Problemas</h2>
                        <Button variant="outline-success" onClick={handleCronogramaShow} className="mt-2">
                            Problemas
                        </Button>
                        <Cronograma show={showCronogramaModal} onHide={() => setShowCronogramaModal(false)} />
                    </Col>
                    <Col md={6}>
                        <h2 className="h3">Previsão de entrega</h2>
                        <ul className="list-unstyled">
                            <li><i className="bi bi-check-circle-fill text-success me-2"></i>Fev/2025</li>
                        </ul>
                    </Col>
                </Row>
            </Container>
            <Container style={{ minHeight: '4vh'}}></Container>
            <Footer/>
        </Container>
    );
  }
  
  export default Relatorio;