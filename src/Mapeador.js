import './Mapeador.css';
import {Container, Row, Col, Table, Button, Modal, Form}  from 'react-bootstrap';
import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate  } from 'react-router-dom';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { API_BASE_URL } from './config';
import Footer from './Footer';
import { FaSave, FaUndo } from 'react-icons/fa';
import NavBar from './Navbar';
import {showMessageSuccess, showMessageInfo} from './utils.js';

const Mapeador = () => {  

    const [dados, setDados] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [mudancasPendentes, setMudancasPendentes] = useState({});
    const [dadosOriginais, setDadosOriginais] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [ordenacao, setOrdenacao] = useState('asc');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/dados`);
            const data = await response.json();
            setDados(data);
            setDadosOriginais(data.map(dado => ({ ...dado }))); 
          } catch (error) {
            console.error('Erro ao buscar dados:', error);
          }
        };
        fetchData();
      }, [filtro]);
    
    const temMudancasPendentes = () => {
        return dados.some((linha) => {
            const linhaOriginal = dadosOriginais.find((original) => original.id === linha.id);
            return linhaOriginal && linha.migrado !== linhaOriginal.migrado;
        });
    };
    
    const handleMigradoChange = (event, id) => {
        const migrado = event.target.checked;

        setMudancasPendentes((prevMudancas) => ({
          ...prevMudancas,
          [id]: migrado
        }));
      
        setDados((dadosAntigos) => 
          dadosAntigos.map((linha) => {
            if (linha.id === id) {
              return { ...linha, migrado };
            }
            return linha;
          })
        );
      };
      
      const salvarMudancas = async () => {
        try {
            await Promise.all(
            Object.entries(mudancasPendentes).map(async ([id, migrado]) => {
                const response = await fetch(`${API_BASE_URL}/dados/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ migrado }),
                });
                if (!response.ok) {
                throw new Error('Falha ao atualizar o registro com id ' + id);
                }
            })
            );
            setMudancasPendentes({});
            setDadosOriginais(dados.map(dado => ({ ...dado }))); 
        } catch (error) {
            console.error('Erro ao salvar mudanças:', error);
        }
    };    

    const reverterMudancas = () => {
        setDados((dadosAtuais) =>
          dadosAtuais.map((linha) => {
            if (mudancasPendentes.hasOwnProperty(linha.id)) {
              return { ...linha, migrado: dadosOriginais.find(d => d.id === linha.id).migrado };
            }
            return linha;
          })
        );
        setMudancasPendentes({});
      };
    
    const verificarMudancasPendentes = (acao, callback) => {
        if (temMudancasPendentes()) {
          setMostrarModal(true);
        } else {
          acao();
          if (callback) {
            callback();
          }
        }
      };

    const cellStyle = {
        wordBreak: 'break-word',
        maxWidth: '350px',
        overflow: 'hidden',
        whiteSpace: 'normal',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
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
                    onCopy={() => showMessageSuccess("Texto Copiado!")}>
                        <Button
                            variant="outline-success" 
                            className="ms-2 btn-editar"
                        >
                            <span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="svg octicon-copy" width="16" height="16" aria-hidden="true"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg></span>
                        </Button>
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
    
    const handleOrdenacao = (coluna) => {
        if (ordenacao === 'asc') {
            setOrdenacao('desc');
            dados.sort((a, b) => {
                const valorA = a[coluna] ? a[coluna].toLowerCase() : '';
                const valorB = b[coluna] ? b[coluna].toLowerCase() : '';
                return valorA > valorB ? -1 : 1;
            });
        } else {
            setOrdenacao('asc');
            dados.sort((a, b) => {
                const valorA = a[coluna] ? a[coluna].toLowerCase() : '';
                const valorB = b[coluna] ? b[coluna].toLowerCase() : '';
                return valorA < valorB ? -1 : 1;
            });
        }
    };    
    
  return (
    <Container fluid style={{ backgroundColor: 'white'}}>
        <NavBar title="Mapeador HomePar - Sombra" />
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
                            marginRight:'5px',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.borderColor = '#198754')} 
                        onMouseOut={(e) => (e.currentTarget.style.borderColor = '#ced4da')} 
                    />
                    <Button 
                        variant="success" 
                        className={`btn-save ${temMudancasPendentes() ? 'btn-save-enabled' : 'btn-save-disabled'}`} 
                        onClick={() => {
                            salvarMudancas();
                            showMessageSuccess("Alterações Salvas!");
                        }}
                        disabled={!temMudancasPendentes()}
                        
                    >
                        <FaSave /> 
                    </Button>
                    <Button 
                        variant="danger" 
                        className={`btn-revert ${temMudancasPendentes() ? 'btn-revert-enabled' : 'btn-revert-disabled'}`} 
                        onClick={() => {
                            reverterMudancas();
                            showMessageInfo("Revertendo alterações!");
                        }}
                        disabled={!temMudancasPendentes()}
                        >
                        <FaUndo /> 
                    </Button>
                </Col>
                <Col xs={12} md={4} className="d-flex justify-content-center align-items-center">
                   
                </Col>
                <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-end">
                    <Button
                        className='mr-5'
                        variant="success"
                        style={{ width: '100px', height: '50px', marginRight: '5px' }}
                        onClick={() => verificarMudancasPendentes(() => exportToExcel(dadosDaTabela))}
                        >
                        Excel
                    </Button>
                    <Button
                        variant="success"
                        style={{ width: '100px', height: '50px' }}
                        onClick={() => verificarMudancasPendentes(() => {}, () => navigate('/'))}
                        >
                        Voltar
                    </Button>
                    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Atenção</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Existem alterações para serem confirmadas ou revertidas.</Modal.Body>
                        <Modal.Footer>
                            <Button variant="success" onClick={() => setMostrarModal(false)}>
                                Fechar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>    
        </Container>
        <Container className='d-flex justify-content-center align-items-center' style={{ minHeight: '10vh'}}>
            <Table striped bordered hover style={{ marginTop: '10px', marginBottom: '100px', width: '100%', margin: 'auto' }}>
                <thead style={{ backgroundColor: '#98FB98', color: 'white' }}>
                    <tr>
                        <th>
                            Form
                            <Button variant="success" size="sm" onClick={() => handleOrdenacao('form')} style={{ marginLeft: '5px' }}>
                                {ordenacao === 'asc' ? '↓' : '↑'}
                            </Button>
                        </th>
                        <th>
                            Classe
                            <Button variant="success" size="sm" onClick={() => handleOrdenacao('classe')} style={{ marginLeft: '5px' }}>
                                {ordenacao === 'asc' ? '↓' : '↑'}
                            </Button>
                        </th>
                        <th>
                            Sombra
                            <Button variant="success" size="sm" onClick={() => handleOrdenacao('sombra')} style={{ marginLeft: '5px' }}>
                                {ordenacao === 'asc' ? '↓' : '↑'}
                            </Button>
                        </th>
                        <th>Objetos de Banco</th>
                        <th>Migrado?</th>
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
                        .map((linha) => {
                            return (
                            <tr key={linha.id}>
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
                                <td style={cellStyle}>
                                    <Form.Check
                                        type="checkbox"
                                        className="custom-checkbox"
                                        checked={linha.migrado}
                                        onChange={(e) => handleMigradoChange(e, linha.id)}
                                    />
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
                <div className="modal-content-code">
                    {formatModalContent(modalContent)}
                </div> 
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleCloseModal}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
        <Container style={{ minHeight: '10vh'}}></Container>
        <Footer/>
  </Container>
  );
}

export default Mapeador;