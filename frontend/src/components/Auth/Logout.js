import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onAuthChange }) => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    }, [navigate]);
    
    return <div>Logging out...</div>; // Puede mostrar un mensaje mientras redirige
};

export default Logout;
