import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('access_token') !== null; // Verifica si el token está almacenado

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
