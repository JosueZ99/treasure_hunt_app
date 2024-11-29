import React from 'react';
import { Box, Typography, Paper, Fab } from '@mui/material';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

// Importar imágenes
import ecoImage from '../assets/images/carousel/eco.jpg';
import eco2Image from '../assets/images/carousel/eco2.jpg';
import eco3Image from '../assets/images/carousel/eco3.jpg';

const Home = () => {
    // Configuración del carrusel
    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
    };

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%', 
                bgcolor: 'background.default', 
                color: 'text.primary', 
                position: 'relative' 
            }}
        >
            {/* Contenido principal */}
            <Box sx={{ flex: '1 0 auto', p: 3, textAlign: 'center' }}>
                {/* Título */}
                <Typography variant="h4" sx={{ mb: 2 }}>
                    Eco-Treasure Hunt
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

                {/* Carrusel */}
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
            </Box>

            {/* Iconos flotantes para acciones */}
            <Fab 
                color="secondary" 
                aria-label="Leaderboard" 
                sx={{ 
                    position: 'fixed', 
                    bottom: 16, 
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
                    bottom: 16, 
                    right: 16 
                }}
            >
                <QrCodeScannerIcon />
            </Fab>
        </Box>
    );
};

export default Home;
