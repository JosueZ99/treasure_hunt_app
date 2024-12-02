import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, CircularProgress, RadioGroup, FormControlLabel, Radio, Fab } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Challenge = () => {
    const { token } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [earnedPoints, setEarnedPoints] = useState(0);
    const [hint, setHint] = useState('');
    const [isHintShown, setIsHintShown] = useState(false);
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchChallenge = async () => {
            if (!token) {
                console.error("Token no válido.");
                navigate('/home');
                return;
            }

            try {
                const response = await axios.get(`${backendUrl}/api/get_challenge/${token}/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                if (response.status === 200) {
                    setChallenge(response.data);
                } else {
                    console.error("Desafío no encontrado.");
                    navigate('/home');
                }
            } catch (error) {
                console.error("Error al obtener el desafío:", error);
                navigate('/home');
            } finally {
                setLoading(false);
            }
        };

        fetchChallenge();
    }, [token, backendUrl, navigate]);

    const handleSolveChallenge = async () => {
        if (!selectedAnswer) {
            alert("Por favor, selecciona una respuesta.");
            return;
        }
    
        try {
            const response = await axios.post(`${backendUrl}/api/validate_answer/${token}/`, {
                answer: selectedAnswer
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
    
            if (response.status === 200) {
                setFeedbackMessage(response.data.message);
                setIsAnswered(true);
    
                if (response.data.correct) {
                    setEarnedPoints(response.data.points);
                    console.log("Respuesta correcta. Intentando actualizar el progreso del usuario...");
                    await updateProgress(); // Actualizar el progreso si la respuesta es correcta
                    await fetchNextHint(); // Obtener la siguiente pista si la respuesta es correcta
                }
            } else {
                console.error("Error al validar la respuesta.");
                setFeedbackMessage("Error al validar la respuesta. Inténtalo de nuevo más tarde.");
            }
        } catch (error) {
            console.error("Error al validar la respuesta:", error);
            setFeedbackMessage("Error al validar la respuesta. Inténtalo de nuevo más tarde.");
        }
    };

    const updateProgress = async () => {
        console.log("Intentando actualizar el progreso del usuario...");
        try {
            const response = await axios.post(`${backendUrl}/api/update_user_progress/${token}/`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.status === 200) {
                console.log("Progreso del usuario actualizado con éxito:", response.data);
                setFeedbackMessage((prev) => `${prev} ¡Has ganado ${earnedPoints} puntos!`);
            } else {
                console.error("Error al actualizar el progreso del usuario.");
            }
        } catch (error) {
            console.error("Error al actualizar el progreso del usuario:", error);
        }
    };

    const fetchNextHint = async () => {
        console.log("Intentando obtener la siguiente pista...");
        try {
            const response = await axios.get(`${backendUrl}/api/get_next_hint/${token}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.status === 200) {
                console.log("Pista obtenida con éxito:", response.data);
                setHint(response.data.hint);
                setIsHintShown(true); // Marcar que la pista ya ha sido mostrada
            } else {
                console.error("No se pudo obtener la siguiente pista.");
            }
        } catch (error) {
            console.error("Error al obtener la pista:", error);
        }
    };

    const handleNextHint = () => {
        if (isHintShown) {
            // Si la pista ya se mostró, regresar a home
            console.log("Pista mostrada, navegando a home...");
            navigate('/home');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                bgcolor: 'background.default',
                color: 'text.primary',
                p: 3,
            }}
        >
            {challenge ? (
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ mb: 2 }}>
                        Desafío
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4 }}>
                        {challenge.question}
                    </Typography>
                    <RadioGroup
                        value={selectedAnswer}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                        sx={{ mb: 2 }}
                    >
                        {challenge.options.map((option, index) => (
                            <FormControlLabel
                                key={index}
                                value={option}
                                control={<Radio disabled={isAnswered} />}
                                label={option}
                            />
                        ))}
                    </RadioGroup>
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
                    {!isAnswered ? (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSolveChallenge}
                            sx={{ mb: 2 }}
                        >
                            Resolver
                        </Button>
                    ) : hint ? (
                        <>
                            <Typography variant="body1" color="info.main" sx={{ mt: 2, mb: 2 }}>
                                {hint}
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleNextHint}
                                sx={{ mt: 2 }}
                            >
                                {isHintShown ? 'Regresar a Home' : 'Siguiente Pista'}
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={fetchNextHint}
                            sx={{ mt: 2 }}
                        >
                            Siguiente Pista
                        </Button>
                    )}
                    {feedbackMessage && (
                        <Typography variant="body1" color={feedbackMessage.includes("correcta") ? "success.main" : "error"} sx={{ mt: 2 }}>
                            {feedbackMessage}
                        </Typography>
                    )}
                </Box>
            ) : (
                <Typography variant="body1" color="error">
                    No hay desafíos disponibles para esta ubicación.
                </Typography>
            )}
        </Box>
    );
};

export default Challenge;
