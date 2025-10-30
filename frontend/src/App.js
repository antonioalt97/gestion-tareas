import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import '@/App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth context
const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      // Check if session_id is in URL fragment
      const hash = window.location.hash;
      if (hash && hash.includes('session_id=')) {
        const sessionId = hash.split('session_id=')[1].split('&')[0];
        
        try {
          setLoading(true);
          const response = await axios.post(
            `${API}/auth/session`,
            {},
            { 
              headers: { 'X-Session-ID': sessionId },
              withCredentials: true 
            }
          );
          
          setUser(response.data.user);
          
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
          
          toast.success('¡Bienvenido! ' + response.data.user.name);
          navigate('/dashboard', { replace: true });
        } catch (error) {
          console.error('Session creation error:', error);
          toast.error('Error al iniciar sesión');
          setLoading(false);
        }
        return;
      }

      // Check existing session
      try {
        const response = await axios.get(`${API}/auth/me`, { withCredentials: true });
        setUser(response.data);
        
        if (location.pathname === '/' || location.pathname === '') {
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      navigate('/');
      toast.success('Sesión cerrada');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return children({ user, logout });
};

const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthContext>
          {({ user, logout }) => (
            <>
              <Routes>
                <Route 
                  path="/" 
                  element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute user={user}>
                      <Dashboard user={user} logout={logout} />
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <Toaster position="top-center" richColors />
            </>
          )}
        </AuthContext>
      </BrowserRouter>
    </div>
  );
}

export default App;