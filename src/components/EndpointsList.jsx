import { useEffect, useState } from 'react';

function EndpointsList() {
    const [dados, setDados] = useState([]);

    useEffect(() => {
        fetch('http://sip.getel.net.br:8090/circuits')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erro na resposta da API');
                }
                return response.json();
            })
            .then((data) => setDados(data))
            .catch((error) => console.error('Erro ao buscar dados:', error));
    }, []);

    return (
        <div className="app-container-circuits">

            <div className="circuits">
                <h1>Lista de Endpoints</h1>
                {dados.length === 0 ? (
                    <p>Carregando...</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>Password</th>
                        </tr>
                        </thead>
                        <tbody>
                        {dados.map((item) => (
                            <tr key={item.id}>
                                <td>{item.username}</td>
                                <td>{item.password}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

            </div>
        </div>
    );
}

export default EndpointsList;
