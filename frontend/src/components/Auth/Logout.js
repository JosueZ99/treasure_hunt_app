import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Eliminar el token de localStorage
        localStorage.removeItem('access_token');
        // Redirigir al login
        navigate('/login');
    }, [navigate]);

    return <div>Logging out...</div>;  // Puede mostrar un mensaje mientras redirige
};

export default Logout;
