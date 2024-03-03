import './Mapeador.css';
import {Container, Row, Col, Image, Table, Button}  from 'react-bootstrap';
import React, { useState, useEffect } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Mps from './images/mps.png'
import Papa from 'papaparse';
import relacaoFormsSombrasObjetos from './text/relacao_forms_sombras_objetos.csv'
import { Link } from 'react-router-dom';

const Mapeador = () => {  

    const [dados, setDados] = useState([]);

    useEffect(() => {
        Papa.parse(relacaoFormsSombrasObjetos, {
          download: true,
          header: false,
          skipEmptyLines: true,
          complete: (resultado) => {
            const dadosSemCabecalho = resultado.data.slice(1).map((linha) => {
              return linha.map((celula) => {
                return celula.replace('Objeto:', '').replace('Tipo:', '').trim();
              });
            });
            console.log(dadosSemCabecalho);
            setDados(dadosSemCabecalho);
          }
        });
      }, []);

      const [filtro, setFiltro] = useState('');

      const cellStyle = {
        wordBreak: 'break-word', 
        maxWidth: '350px', 
        overflow: 'hidden', 
        whiteSpace: 'normal' 
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
                        .filter((linha) => {
                            const [form, classe, sombra, ...objetosDeBanco] = linha;
                            const termoFiltrado = filtro.toLowerCase();
                            return (
                                form.toLowerCase().includes(termoFiltrado) ||
                                classe.toLowerCase().includes(termoFiltrado) ||
                                sombra.toLowerCase().includes(termoFiltrado) ||
                                objetosDeBanco.some(objeto => objeto.toLowerCase().includes(termoFiltrado))
                            );
                        })
                        .map((linha, indexLinha) => {
                            const [form, classe, sombra, ...objetosDeBanco] = linha;
                            const objetosTiposConcatenados = objetosDeBanco
                                .flatMap(objetoDeBanco => typeof objetoDeBanco === 'string'
                                    ? objetoDeBanco.replace('Objeto: ', '').replace('Tipo: ', '').split(' | ')
                                    : []
                                )
                                .join(' | ');

                            return (
                                <React.Fragment key={indexLinha}>
                                    <tr>
                                        <td style={cellStyle}>{form}</td>
                                        <td style={cellStyle}>{classe}</td>
                                        <td style={cellStyle}>{sombra}</td>
                                        <td style={cellStyle}>{objetosTiposConcatenados || 'N/A'}</td>
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                </tbody>
            </Table>
        </div>
        <footer className="footer">
            <Container fluid>
                <p className="text-center mb-0">© Fábio Garbato - MPS Informática - {new Date().getFullYear()}</p>
            </Container>
        </footer>
  </Container>
  );
}

export default Mapeador;