import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './ListaEventos.css'; 

const ListaEventos = ({
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

export default ListaEventos;