import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import theme from './theme';
import Layout from './components/Layout';
import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import Register from './components/Auth/Register';
import { refreshAccessToken } from './tokenUtils';
import { jwtDecode } from 'jwt-decode';
import Administrator,{saludo} from './components/Auth/Administrator';

function App() {
  const [userName, setUserName] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true; // En caso de error, asumimos que el token está expirado
    }
  };

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      let token = localStorage.getItem('access_token');

      if (!token || isTokenExpired(token)) {
        // Intentar renovar el token si está expirado
        try {
          token = await refreshAccessToken();
        } catch (error) {
          console.error('No se pudo renovar el token:', error);
          setRedirectToLogin(true);
          return;
        }
      }

      const response = await fetch(`${backendUrl}/api/user-data/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserName(data.name);
        setUserPoints(data.points);
        setRedirectToLogin(false); // El usuario está autenticado, no redirigir
      } else {
        console.error('Error al obtener los datos del usuario.');
        setRedirectToLogin(true);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setRedirectToLogin(true);
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleAuthChange = () => {
    fetchUserData();
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            bgcolor: 'background.default',
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout userName={userName} userPoints={userPoints}>
          <Routes>
            <Route path="/login" element={<Login onAuthChange={handleAuthChange} />} />
            <Route path="/logout" element={<Logout onAuthChange={handleAuthChange} />} />
            <Route path="/register" element={<Register onAuthChange={handleAuthChange} />} />
            <Route
              path="/home"
              element={
                redirectToLogin ? (
                  <Navigate to="/login" replace />
                ) : (
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                )
              }
            />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
