import React, { useState } from 'react';
import { Box, Typography, Paper, Fab } from '@mui/material';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { useNavigate } from 'react-router-dom';

// Importar imágenes
import eco1Image from '../assets/images/carousel/eco1.jpg';
import eco2Image from '../assets/images/carousel/eco2.jpg';
import eco3Image from '../assets/images/carousel/eco3.jpg';
import eco4Image from '../assets/images/carousel/eco4.jpg';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0); // Índice actual del carrusel
    const navigate = useNavigate();

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
        "Evita la deforestación. Cada árbol en Ecuador puede capturar hasta 22 kg de CO₂ al año.",
        "Usa transporte público o bicicleta. En Quito, si más personas usaran la bicicleta, se podría reducir hasta un 15% de las emisiones de CO₂ generadas por el transporte privado, ayudando a cuidar el aire.",
        "Apoya la agroecología ecuatoriana. Los cultivos sostenibles generan menos emisiones y cuidan la biodiversidad.",
        "El Parque Nacional Yasuní es uno de los más biodiversos del mundo. Evita plásticos para proteger su vida silvestre."
    ];

    // Funciones para manejar la navegación
    const handleScanQR = () => {
        navigate('/scan-qr');
    };

    const handleViewLeaderboard = () => {
        navigate('/leaderboard');
    };

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
                            src={eco1Image}
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
                        <Box
                            component="img"
                            src={eco4Image}
                            alt="Imagen 4"
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

            {/* Iconos flotantes para acciones */}
            <Fab
                color="secondary"
                aria-label="Leaderboard"
                onClick={handleViewLeaderboard}
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
                onClick={handleScanQR}
                sx={{
                    position: 'fixed',
                    bottom: { xs: 60, md: 90 },
                    right: 16
                }}
            >
                <QrCodeScannerIcon />
            </Fab>
        </Box>
    );
};

export default Home;
