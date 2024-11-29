import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onAuthChange }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Eliminar el token de localStorage
        localStorage.removeItem('access_token');

        // Notificar el cambio de autenticación
        if (onAuthChange) {
            onAuthChange(false); // Indica que el usuario ha cerrado sesión
        }

        // Redirigir al login
        navigate('/login');
    }, [navigate, onAuthChange]);

    return <div>Logging out...</div>; // Puede mostrar un mensaje mientras redirige
};

export default Logout;
