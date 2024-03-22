import React from 'react';
import { Button, Modal, Container } from 'react-bootstrap';
import ExcelJS from 'exceljs';
import useTelasProgresso from './useTelasProgresso';
import { Pie } from 'react-chartjs-2';


const StatusMigracao = ({ show, onHide }) => {

    const { telasMapeadas, telasFaltantes, progresso } = useTelasProgresso();

    const dataForPieChart = {
        labels: ['Telas Mapeadas', 'Telas Faltantes'],
        datasets: [{
            data: [telasMapeadas, telasFaltantes],
            backgroundColor: ['#FF6384', '#36A2EB'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB']
        }]
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
        <Modal show={show} onHide={onHide} centered>
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
                            <strong>Progresso:</strong> {progresso}%
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
                <Button variant="success" onClick={onHide}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default StatusMigracao ;