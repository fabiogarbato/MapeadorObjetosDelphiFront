import { useState, useEffect } from 'react';
import { API_BASE_URL } from './config';

function useTelasProgresso() {
    const [telasMapeadas, setTelasMapeadas] = useState(0);
    const [telasFaltantes, setTelasFaltantes] = useState(0);

    useEffect(() => {
        fetch(`${API_BASE_URL}/telas`)
            .then(response => response.json())
            .then(data => {
                const migradas = parseInt(data.telasMigradas, 10);
                const naoMigradas = parseInt(data.telasNaoMigradas, 10);

                setTelasMapeadas(migradas);
                setTelasFaltantes(naoMigradas);
            })
            .catch(error => {
                console.error('Houve um erro ao recuperar as informações:', error);
            });
    }, []);

    const calcularProgresso = () => {
        const totalTelas = telasMapeadas + telasFaltantes;
        return totalTelas > 0 ? ((telasMapeadas / totalTelas) * 100).toFixed(2) : '0.00';
    };

    const progresso = calcularProgresso();

    return { telasMapeadas, telasFaltantes, progresso };
}


export default useTelasProgresso;
