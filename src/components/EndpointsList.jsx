import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

function EndpointsList() {
    const [dados, setDados] = useState([]);

    useEffect(() => {
        fetch(`${apiUrl}/circuits`)
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
                            <th>Circuito</th>
                            <th>Username</th>
                            <th>Password</th>
                            <th>IP</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {dados.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.username}</td>
                                <td>{item.password}</td>
                                <td>{item.ip}</td>
                                <td>{item.online ? `Online - ${item.rtt}` : 'Offline'}</td>
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
