import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EndpointsList from './components/EndpointsList.jsx';
import Index from './components/Index.jsx';

function App() {
    return (
        <div className="container">
            <Router>
                <Routes>
                    <Route path="/circuits" element={<EndpointsList />} />
                    <Route path="/" element={<Index />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;

