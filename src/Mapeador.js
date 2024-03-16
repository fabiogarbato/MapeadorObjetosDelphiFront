import './Mapeador.css';
import {Container, Row, Col, Image, Table, Button, Modal}  from 'react-bootstrap';
import React, { useState, useEffect } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Mps from './images/mps.png'
import { Link } from 'react-router-dom';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { API_BASE_URL } from './config';

const Mapeador = () => {  

    const [dados, setDados] = useState([]);
    const [filtro, setFiltro] = useState('');

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/dados`);
            const data = await response.json();
            setDados(data);
          } catch (error) {
            console.error('Erro ao buscar dados:', error);
          }
        };
        fetchData();
      }, [filtro]);

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const cellStyle = {
        wordBreak: 'break-word',
        maxWidth: '350px',
        overflow: 'hidden',
        whiteSpace: 'normal'
    };

    const handleOpenModal = (content) => {
        setModalContent(content);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const formatModalContent = (content) => {
        if (!content) {
            return <div style={{ textAlign: 'center', padding: '20px' }}>Nenhum dado disponível, verificar .PAS</div>;
        }

        const blocks = content.split(/(?:StoredProcName:|SQL.Query:)/).filter(Boolean);
        return blocks.map((block, index) => {
          const trimmedBlock = block.trim().replace(/\|\s*$/, ''); 
          const prefix = index > 0 ? (trimmedBlock.startsWith('dbo.') ? 'StoredProcName: ' : 'SQL.Query: ') : '';
          const fullText = `${prefix}${trimmedBlock}`;
          return (
            <div key={index} style={{ marginBottom: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                <CopyToClipboard text={fullText}
                    onCopy={() => console.log('Texto copiado!')}>
                        <button>
                            <span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="svg octicon-copy" width="16" height="16" aria-hidden="true"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg></span>
                        </button>
                </CopyToClipboard>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                <code>{fullText}</code>
              </pre>
            </div>
          );
        });
      };

    const [dadosDaTabela] = useState([]);

    const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Dados');

    worksheet.columns = [
        { header: 'Form', key: 'form', width: 20 },
        { header: 'Classe', key: 'classe', width: 20 },
        { header: 'Sombra', key: 'sombra', width: 20 },
        { header: 'Objetos de Banco', key: 'objetobanco', width: 40 }
    ];

    worksheet.mergeCells('A1:D1');
    worksheet.getCell('A1').value = 'Nome: Mapeador Sombra';
    worksheet.getCell('A1').font = { bold: true };

    worksheet.mergeCells('A2:D2');
    worksheet.getCell('A2').value = 'Autor: Fábio Garbato';
    worksheet.getCell('A2').font = { bold: true };

    worksheet.mergeCells('A3:D3');
    worksheet.getCell('A3').value = 'Objetivo: Mapear todos os arquivos do sistema que utilizam a tecnologia sombra e seus objetos de banco';
    worksheet.getCell('A3').font = { bold: true };

    worksheet.addRow([]); 

    worksheet.addRow(['Form', 'Classe', 'Sombra', 'Objetos de Banco']);

    const headerRowNumber = 5; 
    const headerRow = worksheet.getRow(headerRowNumber);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center', vertical: 'center' };
    headerRow.eachCell((cell) => {
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    dados.forEach(linha => {
        worksheet.addRow({
            form: linha.form,
            classe: linha.classe,
            sombra: linha.sombra,
            objetobanco: linha.objetobanco
        });
    });

    worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
        if (rowNumber > headerRowNumber) { 
            row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                cell.alignment = { horizontal: 'center', vertical: 'center' };
            });
        }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Sombra.xlsx');
}; 
    
  return (
    <Container fluid style={{ backgroundColor: 'white'}}>
        <Navbar id='inicio' expand="lg" style={{ backgroundColor: '#98FB98'}}>
            <Row className="w-100">
                <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-start">
                    <Navbar.Brand>
                        <Image src={Mps} alt="Logo" style={{ maxHeight: '15vh', marginRight: '10px'}} />
                    </Navbar.Brand>
                </Col>
                <Col xs={12} md={4} className="d-flex justify-content-center align-items-center">
                    <span className='fira-sans-condensed-black' style={{ fontSize: '35px', color: '#2b2928'}}>
                        Mapeador HomePar - PCL
                    </span>
                </Col>
            </Row>
        </Navbar>
        <Container className='d-flex justify-content-center align-items-center' style={{ minHeight: '10vh'}}>
            <Row className="w-100">
                <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-start">
                    <input
                        type="text"
                        placeholder="Filtrar..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        style={{
                            borderRadius: '15px', 
                            border: '1px solid #ced4da', 
                            padding: '0.375rem 0.75rem', 
                            outline: 'none', 
                            transition: 'border-color 0.15s ease-in-out', 
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.borderColor = '#198754')} 
                        onMouseOut={(e) => (e.currentTarget.style.borderColor = '#ced4da')} 
                    />
                </Col>
                <Col xs={12} md={4} className="d-flex justify-content-center align-items-center">
                   
                </Col>
                <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-end">
                    <Button classname='mr-5' variant="success" style={{ width: '100px', height: '50px', marginRight:'5px' }} onClick={() => exportToExcel(dadosDaTabela)}>
                        Excel
                    </Button>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Button variant="success" style={{ width: '100px', height:'50px' }}>
                            Voltar
                        </Button>
                    </Link>
                </Col>
            </Row>    
        </Container>
        <Container className='d-flex justify-content-center align-items-center' style={{ minHeight: '10vh'}}>
            <Table striped bordered hover style={{ marginTop: '10px', marginBottom: '100px', width: '100%', margin: 'auto' }}>
                <thead style={{ backgroundColor: '#98FB98', color: 'white' }}>
                    <tr>
                        <th>Form</th>
                        <th>Classe</th>
                        <th>Sombra</th>
                        <th>Objetos de Banco</th>
                    </tr>
                </thead>
                <tbody>
                    {dados
                        .filter(linha => {
                            const termoFiltrado = filtro.toLowerCase();
                            return (
                                (linha.form && linha.form.toLowerCase().includes(termoFiltrado)) ||
                                (linha.classe && linha.classe.toLowerCase().includes(termoFiltrado)) ||
                                (linha.sombra && linha.sombra.toLowerCase().includes(termoFiltrado)) ||
                                (linha.objetobanco && linha.objetobanco.toLowerCase().includes(termoFiltrado))
                            );
                        })
                        .map((linha, indexLinha) => {
                            return (
                                <tr key={indexLinha}>
                                    <td style={cellStyle}>{linha.form}</td>
                                    <td style={cellStyle}>{linha.classe}</td>
                                    <td style={cellStyle}>{linha.sombra}</td>
                                    <td style={cellStyle}>
                                            <Button
                                                variant="success"
                                                style={{ width: '70px', height: '50px' }}
                                                onClick={() => handleOpenModal(linha.objetobanco)}
                                            >
                                                Ver
                                            </Button>
                                        </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </Container>
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Detalhes dos Objetos de Banco</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {formatModalContent(modalContent)}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleCloseModal}>
                    Fechar
                </Button>
            </Modal.Footer>
            </Modal>
        <Container style={{ minHeight: '10vh'}}></Container>
        <footer className="footer">
            <Container fluid>
                <p className="text-center mb-0">© Fábio Garbato - MPS Informática - {new Date().getFullYear()}</p>
            </Container>
        </footer>
  </Container>
  );
}

export default Mapeador;