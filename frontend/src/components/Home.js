import React, { useState } from 'react';
import { Box, Typography, Paper, Fab } from '@mui/material';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import Leaderboard from './Leaderboard';

// Importar imágenes
import ecoImage from '../assets/images/carousel/eco.jpg';
import eco2Image from '../assets/images/carousel/eco2.jpg';
import eco3Image from '../assets/images/carousel/eco3.jpg';

const Home = () => {
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0); // Índice actual del carrusel

    // Funciones para alternar entre vistas
    const handleViewLeaderboard = () => {
        setShowLeaderboard(true);
    };

    const handleBackToHome = () => {
        setShowLeaderboard(false);
    };

    // Configuración del carrusel
    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex), // Actualiza el índice
    };

    // Frases para cada imagen
    const ecoTips = [
        "Planta un árbol: ¡puede absorber hasta 22 kg de CO2 por año!",
        "Reduce, reutiliza, recicla: cada acción cuenta.",
        "Elige transporte sostenible: camina, usa bicicleta o transporte público."
    ];

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor: 'background.default',
                color: 'text.primary',
                position: 'relative',
            }}
        >
            {/* Mostrar condicionalmente el contenido principal o el ranking */}
            {showLeaderboard ? (
                <Leaderboard onBack={handleBackToHome} />
            ) : (
                <>
                    {/* Página principal */}
                    <Box sx={{ flex: '1 0 auto', p: 3, textAlign: 'center' }}>
                        {/* Título */}
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            EcoTreasure Hunt
                        </Typography>

                        {/* Instrucciones */}
                        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                ¡Bienvenido a Eco-Treasure Hunt! Escanea los códigos QR escondidos
                                por el campus, resuelve los desafíos y acumula puntos.
                            </Typography>
                            <Typography variant="body1">
                                Ayuda al planeta siguiendo nuestros consejos para reducir tu huella de carbono.
                            </Typography>
                        </Paper>

                        {/* Carrusel de imágenes */}
                        <Box
                            sx={{
                                mb: 3,
                                width: '100%',
                                maxWidth: '800px',
                                mx: 'auto'
                            }}
                        >
                            <Slider {...carouselSettings}>
                                <Box
                                    component="img"
                                    src={ecoImage}
                                    alt="Imagen 1"
                                    sx={{
                                        width: '100%',
                                        height: { xs: '200px', sm: '300px', md: '400px' },
                                        objectFit: 'cover'
                                    }}
                                />
                                <Box
                                    component="img"
                                    src={eco2Image}
                                    alt="Imagen 2"
                                    sx={{
                                        width: '100%',
                                        height: { xs: '200px', sm: '300px', md: '400px' },
                                        objectFit: 'cover'
                                    }}
                                />
                                <Box
                                    component="img"
                                    src={eco3Image}
                                    alt="Imagen 3"
                                    sx={{
                                        width: '100%',
                                        height: { xs: '200px', sm: '300px', md: '400px' },
                                        objectFit: 'cover'
                                    }}
                                />
                            </Slider>
                        </Box>

                        {/* Carrusel de frases sincronizado */}
                        <Typography
                            variant="body1"
                            sx={{
                                mt: 3,
                                fontWeight: 'bold',
                                bgcolor: 'background.default',
                                color: 'primary.main',
                                textAlign: 'center',
                            }}
                        >
                            {ecoTips[currentSlide]} {/* Muestra la frase correspondiente al índice */}
                        </Typography>
                    </Box>

                    {/* Botones flotantes */}
                    <Fab
                        color="secondary"
                        aria-label="Leaderboard"
                        onClick={handleViewLeaderboard} // Aquí se activa la vista del ranking
                        sx={{
                            position: 'fixed',
                            bottom: { xs: 60, md: 90 },
                            left: 16
                        }}
                    >
                        <LeaderboardIcon />
                    </Fab>

                    <Fab
                        color="primary"
                        aria-label="QR Scanner"
                        sx={{
                            position: 'fixed',
                            bottom: { xs: 60, md: 90 },
                            right: 16
                        }}
                    >
                        <QrCodeScannerIcon />
                    </Fab>
                </>
            )}
        </Box>
    );
};

export default Home;
