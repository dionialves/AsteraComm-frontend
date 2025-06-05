import { useState, useEffect } from "react";

function EndpointsList() {
    const [dados, setDados] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);

    useEffect(() => {
        fetch(`api/circuits?page=${paginaAtual}&size=1000`)
            .then((response) => {
                if (!response.ok) throw new Error("Erro na resposta da API");
                return response.json();
            })
            .then((data) => {
                setDados(data.content);
                setTotalPaginas(data.totalPages);
            })
            .catch((error) => console.error("Erro ao buscar dados:", error));
    }, [paginaAtual]);

    const irParaPaginaAnterior = () => {
        if (paginaAtual > 0) setPaginaAtual(paginaAtual - 1);
    };

    const irParaProximaPagina = () => {
        if (paginaAtual < totalPaginas - 1) setPaginaAtual(paginaAtual + 1);
    };

    return (
        <div className="app-container-circuits">
            <div className="circuits">
                <h1>Lista dos Circuitos</h1>
                {dados.length === 0 ? (
                    <p>Carregando...</p>
                ) : (
                    <>
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
                                        <td>{item.online ? `Online - ${item.rtt}` : "Offline"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Controles de paginação */}
                        <div className="pagination-controls">
                            <button onClick={irParaPaginaAnterior} disabled={paginaAtual === 0}>
                                Anterior
                            </button>
                            <span>
                                Página {paginaAtual + 1} de {totalPaginas}
                            </span>
                            <button onClick={irParaProximaPagina} disabled={paginaAtual >= totalPaginas - 1}>
                                Próxima
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default EndpointsList;
