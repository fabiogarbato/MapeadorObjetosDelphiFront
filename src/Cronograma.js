import ListaEventos from './ListaEventos.js'
import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { API_BASE_URL } from './config';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { Calendar } from 'react-calendar';


const Cronograma = ({ show, onHide }) => {

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
    
    return (
        <Modal show={show} onHide={onHide} centered>
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
                <Button variant="success" onClick={onHide}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
      );
};

export default Cronograma;