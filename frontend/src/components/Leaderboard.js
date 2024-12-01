import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, LinearProgress, List, ListItem } from '@mui/material';
import ForestIcon from '@mui/icons-material/Forest'; // Ícono de árbol (MUI Icons)

const Leaderboard = ({ onBack }) => {
    const [players, setPlayers] = useState([]); // Guardar los datos del ranking
    const [loading, setLoading] = useState(true); // Indicador de carga
    const [error, setError] = useState(null); // Almacenar posibles errores

    // Función para obtener los datos del ranking desde la API
    const fetchLeaderboard = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/leaderboard/'); // URL API
            if (!response.ok) {
                throw new Error('Error al obtener los datos del ranking.');
            }
            const data = await response.json();
            setPlayers(data); // Guarda los datos en el estado
        } catch (err) {
            setError('Error al cargar el ranking.');
        } finally {
            setLoading(false); // Deja de mostrar "cargando"
        }
    };

    // Llama a fetchLeaderboard al montar el componente
    useEffect(() => {
        fetchLeaderboard();
    }, []);

    // Calcula el puntaje máximo para normalizar las barras de progreso
    const maxPoints = players.length > 0 ? Math.max(...players.map((player) => player.points)) : 1;

    return (
        <Box
            sx={{
                textAlign: 'center',
                backgroundColor: '#E8F5E9', // Fondo verde claro
                color: '#2E7D32', // Verde bosque para texto
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
            }}
        >
            {/* Encabezado con árboles a los lados */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2, // Espacio entre íconos y texto
                    mb: 3,
                }}
            >
                <ForestIcon sx={{ fontSize: 40, color: '#4CAF50' }} /> {/* Árbol izquierdo */}
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Ranking de Puntos
                </Typography>
                <ForestIcon sx={{ fontSize: 40, color: '#4CAF50' }} /> {/* Árbol derecho */}
            </Box>

            {/* Muestra un indicador de carga, error o la lista */}
            {loading ? (
                <CircularProgress sx={{ color: '#4CAF50' }} />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Box sx={{ width: '100%', maxWidth: 600, textAlign: 'left' }}>
                    <List>
                        {players.map((player) => (
                            <ListItem
                                key={player.rank}
                                sx={{
                                    backgroundColor: '#C8E6C9', // Verde claro para tarjetas
                                    borderRadius: 2,
                                    mb: 2,
                                    p: 2,
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                }}
                            >
                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="h6" sx={{ color: '#1B5E20' }}> {/* Verde oscuro */}
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
                                                        ? '#FFD54F' // Amarillo para el primer lugar
                                                        : '#4CAF50', // Verde para los demás
                                            },
                                        }}
                                    />
                                    <Typography variant="body2" sx={{ mt: 1, color: '#388E3C' }}> {/* Verde medio */}
                                        Puntos: {player.points}
                                    </Typography>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {/* Botón para regresar */}
            <Button
                variant="contained"
                sx={{
                    mt: 3,
                    backgroundColor: '#4CAF50', // Verde medio
                    color: 'white',
                    '&:hover': { backgroundColor: '#388E3C' }, // Verde más oscuro al pasar el mouse
                }}
                onClick={onBack}
            >
                Regresar
            </Button>
        </Box>
    );
};

export default Leaderboard;

