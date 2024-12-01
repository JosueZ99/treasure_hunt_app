import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const Leaderboard = ({ onBack }) => {
    const [players, setPlayers] = useState([]); // Guardar los datos del ranking
    const [loading, setLoading] = useState(true); // Indicador de carga
    const [error, setError] = useState(null); // Almacenar posibles errores

    // Función para obtener los datos del ranking desde la API
    const fetchLeaderboard = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/leaderboard/'); // URL de tu API
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

    return (
        <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Ranking de Participantes
            </Typography>

            {/* Muestra un indicador de carga, error o la lista */}
            {loading ? (
                <CircularProgress /> // Indicador de carga
            ) : error ? (
                <Typography color="error">{error}</Typography> // Muestra el error si ocurre
            ) : (
                <List>
                    {players.map((player) => (
                        <ListItem key={player.rank}>
                            <ListItemText
                                primary={`${player.rank}. ${player.name}`} // Muestra el rank y el nombre
                                secondary={`Puntos: ${player.points}`} // Muestra los puntos
                            />
                        </ListItem>
                    ))}
                </List>
            )}

            {/* Botón para regresar */}
            <Button variant="contained" color="primary" onClick={onBack} sx={{ mt: 3 }}>
                Regresar
            </Button>
        </Box>
    );
};

export default Leaderboard;
