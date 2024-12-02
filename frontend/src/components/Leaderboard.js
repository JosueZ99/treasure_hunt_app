import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, LinearProgress, List, ListItem, Fab } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Ícono para el botón flotante

const Leaderboard = ({ onBack, currentUser }) => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL; // Obtenemos backendUrl de las variables de entorno

    // Obtener datos del ranking
    const fetchLeaderboard = async () => {
        const token = localStorage.getItem('access_token');
        
        // Verificar si el token está disponible
        if (!token) {
            console.error("Token no encontrado. Redirigiendo al login.");
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/leaderboard/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                console.error("Token no válido o expirado. Redirigiendo al login.");
                navigate('/login');
                return;
            }

            if (!response.ok) {
                throw new Error('Error al obtener los datos del ranking.');
            }

            const data = await response.json();
            setPlayers(data);
        } catch (err) {
            setError('Error al cargar el ranking.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const maxPoints = players.length > 0 ? Math.max(...players.map((player) => player.points)) : 1;

    return (
        <Box
            sx={{
                textAlign: 'center',
                background: 'linear-gradient(135deg, #E3F2FD, #FFFFFF)', // Degradado azul claro a blanco
                color: '#1E88E5',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 3,
                position: 'relative',
                borderRadius: 3,
            }}
        >
            {/* Encabezado */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.5,
                    mb: 4,
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1B5E20' }}>
                    🌱Ranking de Puntos🌱
                </Typography>
            </Box>

            {/* Indicador de carga, error o lista */}
            {loading ? (
                <CircularProgress sx={{ color: '#1E88E5' }} />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Box sx={{ width: '100%', maxWidth: 600, textAlign: 'left', mt: 2 }}>
                    <List>
                        {players.map((player) => (
                            <ListItem
                                key={player.rank}
                                sx={{
                                    backgroundColor: currentUser === player.name ? '#FFE082' : '#FFFFFF', // Fondo amarillo suave si es el usuario actual
                                    borderRadius: '15px',
                                    mb: 2,
                                    p: 2,
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Sombra más suave
                                    border: '1px solid #E0E0E0', // Borde ligero
                                }}
                            >
                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="h6" sx={{ color: '#1B5E20' }}>
                                        {player.rank}. {player.name}
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(player.points / maxPoints) * 100}
                                        sx={{
                                            height: 10,
                                            borderRadius: 5,
                                            mt: 1,
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor:
                                                    player.rank === 1
                                                        ? '#FFCA28' // Dorado para el primer lugar
                                                        : '#4CAF50', // Verde para los demás
                                            },
                                        }}
                                    />
                                    <Typography variant="body2" sx={{ mt: 1, color: '#2E7D32' }}>
                                        Puntos: {player.points}
                                    </Typography>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {/* Botón flotante */}
            <Fab
                color="primary"
                sx={{
                    position: 'fixed',
                    bottom: 60,
                    right: 16,
                    backgroundColor: '#43A047', // Verde para el botón flotante
                    '&:hover': { backgroundColor: '#2E7D32' }, // Verde más oscuro al pasar el mouse
                }}
                onClick={() => navigate('/home')}
            >
                <ArrowBackIcon /> {/* Icono para regresar */}
            </Fab>
        </Box>
    );
};

export default Leaderboard;
