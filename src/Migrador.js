import './Migrador.css';
import {Container, Row, Col, Image, Button, Modal, Card, Form}  from 'react-bootstrap';
import React, { useState, useRef } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Mps from './images/mps.png'
import { Link } from 'react-router-dom';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import Footer from './Footer';

Chart.register(ArcElement, Tooltip, Legend);

const Migrador = () => {  

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    
    
    const handleFileSelect = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const sqlFiles = selectedFiles.filter(file => file.name.endsWith('.sql'));
        setSelectedFiles(sqlFiles);
    };
    
    const [filesContent, setFilesContent] = useState([]);

    const handleVisualizeClick = () => {
        const filesArray = Array.from(selectedFiles);
      
        setFilesContent([]);
      
        filesArray.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = new TextDecoder("iso-8859-1").decode(e.target.result);
            console.log(content);
            
            setFilesContent(prevContents => [...prevContents, { name: file.name, content }]);
          };
          reader.readAsArrayBuffer(file);
        });
      
        setShowModal(true);
      };

      const fileInputRef = useRef(null);

      const handleClearClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setFilesContent([]);
        setSelectedFiles([]);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
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
            <Container className="my-5">
                <Row>
                    <Col>
                        <h2 className="text-center mb-5">Migrador</h2>
                    </Col>
                </Row>

                <Row>
                    <Col md={12} lg={6} className="mb-4">
                        <Card className="shadow-sm">
                            <Card.Header className="bg-success text-white">Delphi</Card.Header>
                            <Card.Body className="bg-light">
                                <Form>
                                    <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>Selecione os arquivos .PAS ou .DFM</Form.Label>
                                    <Form.Control ref={fileInputRef} type="file" multiple accept=".sql" onChange={handleFileSelect} />
                                        </Form.Group>
                                        <Button variant="success" onClick={handleVisualizeClick}>
                                            Visualizar Arquivos
                                        </Button>
                                        {' '}
                                        <Button variant="danger" onClick={handleClearClick}>
                                            Limpar
                                        </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={12} lg={6}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-success text-white">Objetos de Banco</Card.Header>
                            <Card.Body className="bg-light">
                                <>
                                    <Form>
                                        <Form.Group controlId="formFile" className="mb-3">
                                            <Form.Label>Selecione os arquivos de objeto do banco</Form.Label>
                                            <Form.Control ref={fileInputRef} type="file" multiple accept=".sql" onChange={handleFileSelect} />
                                        </Form.Group>
                                        <Button variant="success" onClick={handleVisualizeClick}>
                                            Visualizar Arquivos
                                        </Button>
                                        {' '}
                                        <Button variant="danger" onClick={handleClearClick}>
                                            Limpar
                                        </Button>
                                    </Form>
                                    <Modal show={showModal} onHide={handleCloseModal} size="lg" fullscreen="xl-down">
                                        <Modal.Header closeButton>
                                            <Modal.Title>Detalhe do arquivo</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {filesContent.length > 0 ? (
                                                filesContent.map((file, index) => (
                                                    <div key={index} className="file-content-container">
                                                        <h5>{file.name}</h5>
                                                        <pre className="modal-content-code">{file.content}</pre>
                                                        <Button variant="success">Migrar</Button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="empty-message">
                                                    Nada para mostrar
                                                </div>
                                            )}
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="success" onClick={handleCloseModal}>
                                                Fechar
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Container style={{ minHeight: '4vh'}}></Container>
            <Container style={{ minHeight: '10vh'}}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <Button variant="success" className="shadow-sm" style={{ width: '100px', height:'50px' }}>
                        Voltar
                    </Button>
                </Link>
            </Container>
            <Container style={{ minHeight: '10vh'}}></Container>
            <Footer/>
        </Container>
    );
  }
  
  export default Migrador;