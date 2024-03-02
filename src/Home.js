import './index.css';
import {Container, Row, Col, Image, Table, Button}  from 'react-bootstrap';
import React, { useState, useEffect } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Mps from './images/mps.png'
import Papa from 'papaparse';
import relacaoFormsSombrasObjetos from './text/relacao_forms_sombras_objetos.csv'
const App = () => {  

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
                        Mapeador HomePar - PCL
                    </span>
                </Col>
            </Row>
        </Navbar>
        <Table striped bordered hover  style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
            <thead style={{ backgroundColor: '#98FB98', color: 'white' }}>
                <tr>
                    <th>Form</th>
                    <th>Classe</th>
                    <th>Sombra</th>
                    <th>Objetos de Banco</th>
                </tr>
            </thead>
            <tbody>
                {dados.map((linha, indexLinha) => {
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
                        <td>{form}</td>
                        <td>{classe}</td>
                        <td>{sombra}</td>
                        <td>{objetosTiposConcatenados || 'N/A'}</td>
                        </tr>
                    </React.Fragment>
                    );
                })}
            </tbody>
        </Table>
  </Container>
  );
}

export default App;