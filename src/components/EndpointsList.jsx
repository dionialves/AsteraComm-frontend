import { useEffect, useState } from 'react';

function EndpointsList() {
    const [dados, setDados] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8090/circuits')
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
        <div>
            <h1>Lista de Endpoints</h1>
            {dados.length === 0 ? (
                <p>Carregando...</p>
            ) : (
                <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>CallerID</th>
                        <th>Username</th>
                        <th>Password</th>
                    </tr>
                    </thead>
                    <tbody>
                    {dados.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.callerid}</td>
                            <td>{item.username}</td>
                            <td>{item.password}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default EndpointsList;
