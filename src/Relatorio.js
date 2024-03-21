import './Relatorio.css';
import {Container, Row, Col, Button, Modal}  from 'react-bootstrap';
import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import ListaEventos from './ListaEventos.js'
import { API_BASE_URL } from './config';
import Footer from './Footer';
import NavBar from './Navbar';
import ExcelJS from 'exceljs';

Chart.register(ArcElement, Tooltip, Legend);

const Relatorio = () => {  

    const [showModal, setShowModal] = useState(false);
    const [telasMapeadas, setTelasMapeadas] = useState(0);
    const [telasFaltantes, setTelasFaltantes] = useState(0);

    useEffect(() => {
        fetch(`${API_BASE_URL}/telas`)
          .then(response => response.json())
          .then(data => {
            setTelasMapeadas(data.telasMigradas);
            setTelasFaltantes(data.telasNaoMigradas);
          })
          .catch(error => {
            console.error('Houve um erro ao recuperar as informações:', error);
          });
      }, []); 
    
      const handleClose = () => setShowModal(false);
      const handleShow = () => setShowModal(true);
    
      const dataForPieChart = {
        labels: ['Telas Mapeadas', 'Telas Faltantes'],
        datasets: [{
          data: [telasMapeadas, telasFaltantes],
          backgroundColor: ['#FF6384', '#36A2EB'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB']
        }]
      };

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
            const response = await fetch(`${API_BASE_URL}/eventosProjeto`);
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
                const response = await fetch(`${API_BASE_URL}/eventosProjeto/${eventoEmEdicao.id}`, {
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
            const response = await fetch(`${API_BASE_URL}/eventosProjeto`, {
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
            await fetch(`${API_BASE_URL}/eventosProjeto/${id}`, {
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

    const exportarDadosParaExcel = (telasMapeadas, telasFaltantes) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Dados do Projeto');
    
        worksheet.mergeCells('A1:E1');
        worksheet.getCell('A1').value = 'Progresso da Migração';
        worksheet.getCell('A1').font = { bold: true, size: 16 };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };
    
        worksheet.mergeCells('A3:E3');
        worksheet.getCell('A3').value = 'Objetivo: Acompanhar os dados sobre a migração';
        worksheet.getCell('A3').font = { bold: true };
        worksheet.getCell('A3').alignment = { horizontal: 'center' };
    
        const cabecalho = ['Telas Mapeadas', 'Telas Faltantes', 'Progresso'];
        const cabecalhoEstilo = {
            font: { bold: true, size: 14, color: { argb: 'FFFFFF' } },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '4CAF50' } },
            alignment: { horizontal: 'center' }
        };
        worksheet.addRow([]);
        worksheet.addRow(cabecalho).eachCell((cell, number) => {
            cell.style = cabecalhoEstilo;
            worksheet.getColumn(number).width = 20;
        });
    
        const progresso = ((telasMapeadas / (telasMapeadas + telasFaltantes)) * 100).toFixed(2) + '%';
        const dados = [telasMapeadas, telasFaltantes, progresso];
        worksheet.addRow(dados);
    
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Evolucao_Migracao.xlsx';
            link.click();
        });
    };

    return (
      <Container fluid style={{ backgroundColor: 'white', minHeight: '100vh' }}>
            <NavBar title="Migração HomePar" />
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
                        <Pie data={dataForPieChart} />
                        <Container className="mt-3" style={{ justifyContent: 'center' }}>
                            <h5>Detalhes:</h5>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '50%' }}>
                                    <strong>Telas Mapeadas:</strong> {telasMapeadas}
                                </div>
                                <div style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '50%' }}>
                                    <strong>Telas Faltantes:</strong> {telasFaltantes}
                                </div>
                                <div style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '50%' }}>
                                    <strong>Progresso:</strong> {
                                        ((telasMapeadas / (telasMapeadas + telasFaltantes)) * 100).toFixed(2)
                                    }%
                                </div>
                                <Button 
                                    variant="success" 
                                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '50%' }}
                                    onClick={() => exportarDadosParaExcel(telasMapeadas, telasFaltantes)}
                                    >
                                    Excel
                                </Button>
                            </div>
                        </Container>
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
                        <ListaEventos
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
                <Link to="/Home" style={{ textDecoration: 'none' }}>
                    <Button variant="success" className="shadow-sm" style={{ width: '100px', height:'50px' }}>
                        Voltar
                    </Button>
                </Link>
            </Container>
            <Container style={{ minHeight: '4vh'}}></Container>
            <Footer/>
        </Container>
    );
  }
  
  export default Relatorio;