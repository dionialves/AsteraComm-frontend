const urlSite = import.meta.env.VITE_URL_SITE;

function Index() {
    return (
        <div className="app-container-index">
            <div className="index">
                <h1>
                    Clique <a href={`${urlSite}/circuits`}>AQUI</a> para acessar os circuitos
                </h1>
            </div>
        </div>
    );
}

export default Index;
