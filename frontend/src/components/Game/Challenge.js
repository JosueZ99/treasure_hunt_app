import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Challenge = () => {
    const { token } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/get_challenge/${token}/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                if (response.status === 200) {
                    setChallenge(response.data);
                }
            } catch (error) {
                console.error("Error al obtener el desafío:", error);
                // Si hay error, redirigir al login u otra página
                navigate('/home');
            } finally {
                setLoading(false);
            }
        };

        fetchChallenge();
    }, [token, backendUrl, navigate]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            {challenge ? (
                <div>
                    <h3>Desafío</h3>
                    <p>{challenge.question}</p>
                    <button>Resolver</button>
                    <button onClick={() => navigate('/home')}>Rendirse</button>
                </div>
            ) : (
                <p>No hay desafíos disponibles para esta ubicación.</p>
            )}
        </div>
    );
};

export default Challenge;
