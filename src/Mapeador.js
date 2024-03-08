import './Mapeador.css';
import {Container, Row, Col, Image, Table, Button}  from 'react-bootstrap';
import React, { useState, useEffect } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Mps from './images/mps.png'
import Papa from 'papaparse';
import { Link } from 'react-router-dom';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';

const Mapeador = () => {  

    const [dados, setDados] = useState([]);
    const [filtro, setFiltro] = useState('');

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:5000/dados');
            const data = await response.json();
            setDados(data);
          } catch (error) {
            console.error('Erro ao buscar dados:', error);
          }
        };
        fetchData();
      }, [filtro]);

      const cellStyle = {
        wordBreak: 'break-word', 
        maxWidth: '350px', 
        overflow: 'hidden', 
        whiteSpace: 'normal' 
      };
      const [dadosDaTabela, setDadosDaTabela] = useState([]);

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
                    <Button variant="success" style={{ width: '100px', height: '50px' }} onClick={() => exportToExcel(dadosDaTabela)}>
                        Excel
                    </Button>
                    <Container></Container>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Button variant="success" style={{ width: '100px', height:'50px' }}>
                            Voltar
                        </Button>
                    </Link>
                </Col>
            </Row>    
        </Container>
        <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
            <Table striped bordered hover style={{ marginTop: '10px', marginBottom: '100px', width: 'auto', margin: 'auto' }}>
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
                                linha.form.toLowerCase().includes(termoFiltrado) ||
                                linha.classe.toLowerCase().includes(termoFiltrado) ||
                                linha.sombra.toLowerCase().includes(termoFiltrado) ||
                                linha.objetobanco.toLowerCase().includes(termoFiltrado)
                            );
                        })
                        .map((linha, indexLinha) => {
                            return (
                                <tr key={indexLinha}>
                                    <td style={cellStyle}>{linha.form}</td>
                                    <td style={cellStyle}>{linha.classe}</td>
                                    <td style={cellStyle}>{linha.sombra}</td>
                                    <td style={cellStyle}>{linha.objetobanco}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
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