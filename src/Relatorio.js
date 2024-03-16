import './Relatorio.css';
import {Container, Row, Col, Image, Button, Modal, Form}  from 'react-bootstrap';
import React, { useState, useEffect } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Mps from './images/mps.png'
import { Link } from 'react-router-dom';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

Chart.register(ArcElement, Tooltip, Legend);

const ListaDeEventos = ({
    eventos,
    setEventoSelecionado,
    handleAddEvento,
    handleEditInicio,
    handleEditSalvar,
    eventoEmEdicao,
    setEventoEmEdicao,
    textoEditado,
    setTextoEditado,
    dataEditada,
    setDataEditada,
    handleDeleteEvento
  }) => {

    const [showModal, setShowModal] = useState(false);
    const [eventoParaExcluir, setEventoParaExcluir] = useState(null);

    const abrirModalExclusao = (evento) => {
        setEventoParaExcluir(evento);
        setShowModal(true);
    };
    
    return (
        <div className="lista-eventos">
          <h5>Eventos do Projeto:</h5>
          <ul className="list-unstyled">
            {eventos.map((evento, index) => (
              <Form.Group key={index} as="li" className="d-flex mb-2 align-items-center">
                {eventoEmEdicao === evento ? (
                  <Form.Control
                    type="text"
                    value={textoEditado}
                    onChange={(e) => setTextoEditado(e.target.value)}
                    className="me-2"
                  />
                ) : (
                    <span className="mr-3" onClick={() => setEventoSelecionado(evento)}>
                        {evento.data.toLocaleDateString()} - {evento.evento}
                    </span>
                )}
                {eventoEmEdicao === evento ? (
                    <>
                        <DatePicker
                            selected={dataEditada}
                            onChange={date => setDataEditada(date)}
                            className="form-control me-3"
                        />
                        <Button
                            variant="success"
                            onClick={() => {
                                if (eventoEmEdicao && textoEditado) {
                                    handleEditSalvar(index, textoEditado, eventoEmEdicao.data);
                                    setEventoEmEdicao(null);
                                    setTextoEditado("");
                                } else {
                                    console.error('Evento em edição ou texto editado é undefined');
                                }
                            }}
                            className="ms-2"
                            >
                            Salvar
                        </Button>
                    </>
                    ) : (
                        <>
                            <Button 
                                variant="outline-success" 
                                onClick={() => handleEditInicio(evento)}
                                className="ms-2 btn-editar"
                            >
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </Button>
                            <Button 
                                variant="outline-danger" 
                                onClick={() => abrirModalExclusao(evento)}
                                className="ms-2 btn-excluir"
                            >
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </Button>

                            <Modal show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Confirmação de Exclusão</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Tem certeza de que deseja excluir este evento?
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="success" onClick={() => setShowModal(false)}>
                                        Cancelar
                                    </Button>
                                    <Button variant="danger" onClick={() => {
                                        handleDeleteEvento(eventoParaExcluir.id);
                                        setShowModal(false);
                                    }}>
                                        Excluir
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </>
                )}
              </Form.Group>
            ))}
          </ul>
          <Button variant="success" onClick={handleAddEvento}>
            Adicionar Evento
          </Button>
        </div>
      );
    };

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

    const [showCronogramaModal, setShowCronogramaModal] = useState(false);

    const fetchEventos = async () => {
        try {
            const response = await fetch('http://cerato.mps.interno:4446/eventosProjeto');
            const eventos = await response.json();
            const eventosComDataComoDate = eventos.map(evento => ({
                ...evento,
                data: new Date(evento.data) 
            }));
            setEventosCronograma(eventosComDataComoDate); 
        } catch (err) {
            console.error('Erro ao buscar eventos:', err);
        }
    };

    useEffect(() => {
        fetchEventos(); 
    }, []); 

    const handleCronogramaClose = () => setShowCronogramaModal(false);
    const handleCronogramaShow = () => setShowCronogramaModal(true);

    const [eventosCronograma, setEventosCronograma] = useState([]);

    const [setEventoSelecionado] = useState(null);
    const [eventoEmEdicao, setEventoEmEdicao] = useState(null);
    const [textoEditado, setTextoEditado] = useState("");
    const [dataEditada, setDataEditada] = useState(null);

    const handleEditInicio = (evento) => {
        setEventoEmEdicao(evento);
        setTextoEditado(evento.evento); 
        setDataEditada(evento.data);
      };
    
    const handleEditSalvar = async (index) => {
        if (eventoEmEdicao && textoEditado && dataEditada) {
            const eventoAtualizado = {
                ...eventoEmEdicao,
                evento: textoEditado,
                data: dataEditada.toISOString(),
            };

            try {
                const response = await fetch(`http://cerato.mps.interno:4446/eventosProjeto/${eventoEmEdicao.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventoAtualizado),
                });
                const eventoSalvo = await response.json();

                eventoSalvo.data = new Date(eventoSalvo.data);

                const eventosAtualizados = eventosCronograma.map((evento) =>
                    evento.id === eventoSalvo.id ? { ...eventoSalvo, data: new Date(eventoSalvo.data) } : evento
                );

                setEventosCronograma(eventosAtualizados);
                setEventoEmEdicao(null);
                setTextoEditado("");
                setDataEditada(null);
            } catch (err) {
                console.error('Erro ao salvar evento:', err);
            }
        } else {
            console.error('Algo está undefined ao salvar');
        }
    };
    
    const handleAddEvento = async () => {
        const novoEvento = { data: new Date().toISOString(), evento: 'Novo Evento' };
        try {
            const response = await fetch('http://cerato.mps.interno:4446/eventosProjeto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoEvento),
            });
            const eventoAdicionado = await response.json();
            eventoAdicionado.data = new Date(eventoAdicionado.data);
            setEventosCronograma([...eventosCronograma, eventoAdicionado]);
            setEventoEmEdicao(eventoAdicionado);
        } catch (err) {
            console.error('Erro ao adicionar evento:', err);
        }
    };

    const handleDeleteEvento = async (id) => {
        try {
            await fetch(`http://cerato.mps.interno:4446/eventosProjeto/${id}`, {
                method: 'DELETE',
            });
            setEventosCronograma(eventosCronograma.filter(evento => evento.id !== id));
        } catch (err) {
            console.error('Erro ao excluir evento:', err);
        }
    };
    
    
    const renderPopover = (evento) => {
        const dataFormatada = evento.data instanceof Date
            ? evento.data.toLocaleDateString()
            : 'Data Inválida';
    
        return (
            <Popover id="popover-basic">
                <Popover.Header as="h3">{dataFormatada}</Popover.Header>
                <Popover.Body>
                    <strong>Evento:</strong> {evento.evento}
                </Popover.Body>
            </Popover>
        );
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
                        <Button variant="outline-success" onClick={handleCronogramaShow} className="mt-2">
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
                            <li><i className="bi bi-exclamation-triangle-fill text-warning me-2"></i><strong>Problema:</strong> Não há um padrão, as exceções precisam ser tratadas com cuidado</li>
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
                <Modal show={showCronogramaModal} onHide={handleCronogramaClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Cronograma do Projeto</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Calendar
                            tileContent={({ date, view }) => {
                                if (view === 'month') {
                                    const evento = eventosCronograma.find(e => e.data && new Date(e.data).toDateString() === date.toDateString());
                                    return evento ? (
                                        <OverlayTrigger trigger="click" placement="top" overlay={renderPopover(evento)}>
                                            <button className="event-indicator">{evento.evento}</button>
                                        </OverlayTrigger>
                                    ) : null;
                                }
                            }}
                            
                        />
                        <ListaDeEventos
                            eventos={eventosCronograma}
                            setEventoSelecionado={setEventoSelecionado}
                            handleAddEvento={handleAddEvento}
                            handleEditInicio={handleEditInicio}
                            handleEditSalvar={handleEditSalvar}
                            eventoEmEdicao={eventoEmEdicao}
                            setEventoEmEdicao={setEventoEmEdicao}
                            textoEditado={textoEditado}
                            setTextoEditado={setTextoEditado}
                            dataEditada={dataEditada}
                            setDataEditada={setDataEditada}
                            handleDeleteEvento={handleDeleteEvento}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={handleCronogramaClose}>
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