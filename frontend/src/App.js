import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import Register from './components/Auth/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas con PrivateRoute */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home /> {/* El componente que quieres proteger */}
            </PrivateRoute>
          }
        />

        {/* Redirigir a la página de inicio si la ruta no existe */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;
