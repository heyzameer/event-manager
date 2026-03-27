import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <BrowserRouter>
            {/* Global Toast Container */}
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: '#1a1a1a',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(0,0,0,0.1)',
                        fontWeight: 500,
                        padding: '12px 24px',
                        fontSize: '0.95rem'
                    }
                }}
            />

            <Routes>
                <Route path="/" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
