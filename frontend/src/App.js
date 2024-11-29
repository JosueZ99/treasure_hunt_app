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

function App() {
  const [userName, setUserName] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No hay token disponible.');
      }

      const response = await fetch('http://192.168.100.60:8000/api/user-data/', {
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
      } else {
        console.error('Error al obtener los datos del usuario.');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setUserName('');
      setUserPoints(0);
    } finally {
      setLoading(false);
    }
  }, []);

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
            <Route
              path="/login"
              element={<Login onAuthChange={handleAuthChange} />}
            />
            <Route
              path="/logout"
              element={<Logout onAuthChange={handleAuthChange} />}
            />
            <Route path="/register" element={<Register />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
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
