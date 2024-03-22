import './index.css';
import { Container, Row, Col, Button, Card, Nav } from 'react-bootstrap';
import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import NavBar from './Navbar';
import { FaMap, FaPlane, FaChartLine, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from './AuthProvider';
import useTelasProgresso from './useTelasProgresso';

const App = () => {  

    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        navigate('/');
    };

    useEffect(() => {
        document.body.style.overflowY = 'hidden';
        return () => {
            document.body.style.overflowY = 'auto';
        };
    }, []);

    const { progresso } = useTelasProgresso();

  return (
    <Container fluid style={{ backgroundColor: 'white' }}>
      <NavBar title="Migração HomePar" />
        <Row>
            <Col md={3} lg={2} className="d-none d-md-block bg-light sidebar">
                <Nav defaultActiveKey="/home" className="flex-column pt-2">
                    <Nav.Link as={Link} to="/MapMenu" className="nav-link text-success custom-logout-link">
                        <FaMap /> Mapeador
                    </Nav.Link>
                    <Nav.Link as={Link} to="/Migrador" className="nav-link text-success custom-logout-link">
                        <FaPlane /> Migrador
                    </Nav.Link>
                    <Nav.Link as={Link} to="/Relatorio" className="nav-link text-success custom-logout-link">
                        <FaChartLine /> Relatório
                    </Nav.Link>
                    <Nav.Link as={Button} onClick={handleLogout} className="nav-link text-danger custom-logout-link">
                        <FaSignOutAlt /> Sair
                    </Nav.Link>
                </Nav>
            </Col>

            <Col md={9} lg={10} className="p-3">
                <Container fluid className='h-100 d-flex flex-column'>
                    <Row>
                        <Col xs={12} lg={6} className='mb-3'>
                            <Card className='h-100'>
                                <Card.Header>Status da Migração</Card.Header>
                                <Card.Body className='d-flex flex-column'>
                                    <Card.Title>Progresso Atual: {progresso} %</Card.Title>
                                    <Card.Text>
                                        <div className="progress mb-2">
                                            <div className="progress-bar" role="progressbar" style={{ width: `${progresso}%` }} aria-valuenow={progresso} aria-valuemin="0" aria-valuemax="100">{progresso}%</div>
                                        </div>
                                    </Card.Text>
                                    <div className='mt-auto'>
                                        {/* colocar outros elementos */}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} lg={6} className='mb-3'>
                            <Card className='h-100'>
                                <Card.Header>Última Atualização</Card.Header>
                                <Card.Body className='d-flex flex-column'>
                                    <Card.Title>Timestamp</Card.Title>
                                    <Card.Text>20/03/2024 14:45</Card.Text>
                                    <div className='mt-auto'>
                                    {/* adicionar um gráfico circular para mostrar o tipo de atualizações feitas */}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        </Row>
                        <Row flex="1">
                        <Col xs={12} className='mb-3 h-100'>
                            <Card className='h-100'>
                                <Card.Header>Problemas Encontrados</Card.Header>
                                <Card.Body className='d-flex flex-column'>
                                    <Card.Title>3 Problemas Pendentes</Card.Title>
                                    <div className='mt-auto'>
                                    {/* adicionar um gráfico de linhas para mostrar a evolução dos problemas resolvidos versus encontrados */}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Col>
      </Row>
      <Footer/>
    </Container>
  );
}

export default App;
