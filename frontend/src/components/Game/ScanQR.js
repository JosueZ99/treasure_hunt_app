import React, { useEffect, useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { Box, Typography, Fab, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Ícono para el botón flotante

const ScanQR = () => {
    const navigate = useNavigate();
    const [isCameraAvailable, setIsCameraAvailable] = useState(false);
    const [isScanning, setIsScanning] = useState(false); // Nueva bandera para evitar escaneos repetidos

    useEffect(() => {
        // Verificar si el navegador tiene acceso a la cámara
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            setIsCameraAvailable(true);
        } else {
            console.error("El navegador no soporta acceso a la cámara.");
            setIsCameraAvailable(false);
        }
    }, []);

    const handleScan = async (data) => {
        if (data && !isScanning) {
            console.log("Scanned QR code:", data);
            setIsScanning(true); // Bloquear nuevos escaneos mientras se procesa la solicitud

            if (data.text) {
                try {
                    // Obtener el parámetro qr_code de la URL escaneada
                    const url = new URL(data.text);
                    const qrCodeValue = url.searchParams.get('qr_code');

                    if (qrCodeValue) {
                        console.log("QR Code encontrado:", qrCodeValue);

                        try {
                            // Enviar el código QR al backend para obtener el token
                            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/scan-qr/`, {
                                qr_code: qrCodeValue
                            }, {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                                }
                            });

                            if (response.status === 200) {
                                const token = response.data.token;
                                console.log("Token encontrado:", token);
                                // Navegar a la página del challenge usando el parámetro de ruta
                                console.log(`Redirigiendo a /challenge/${token}`);
                                navigate(`/challenge/${token}`);
                            } else {
                                console.error('Error al procesar el código QR. Intenta nuevamente.');
                                alert('Error al procesar el código QR. Intenta nuevamente.');
                            }
                        } catch (error) {
                            console.error('Error al enviar el código QR al backend:', error);
                            alert('Error al procesar el código QR. Intenta nuevamente.');
                        } finally {
                            setIsScanning(false); // Permitir nuevos escaneos después de finalizar la solicitud
                        }

                    } else {
                        console.error('El QR escaneado no contiene un código válido.');
                        alert('El QR escaneado no contiene un código válido. Por favor intenta con otro código.');
                        setIsScanning(false);
                    }
                } catch (error) {
                    console.error('El QR escaneado no tiene un formato de URL válido.');
                    alert('El QR escaneado no tiene un formato de URL válido. Por favor intenta con otro código.');
                    setIsScanning(false);
                }
            }
        }
    };

    const handleError = (error) => {
        console.error("Error scanning QR code:", error);
        alert("No se pudo acceder a la cámara. Por favor revisa los permisos o asegúrate de que tu dispositivo tenga una cámara activa.");
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '60vh',
                bgcolor: 'linear-gradient(135deg, #E3F2FD, #FFFFFF)', // Fondo con degradado
                color: 'text.primary',
                p: 3,
            }}
        >
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#1E88E5' }}>
                Escanea el Código QR
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, color: '#FFFFFF' }}>
                Alinea el código QR dentro del recuadro para comenzar
            </Typography>
            
            {isCameraAvailable ? (
                <Box
                    sx={{
                        width: '300px',
                        height: '300px',
                        borderRadius: '15px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'background.paper'
                    }}
                >
                    {isScanning && (
                        <Box
                            sx={{
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10,
                                width: '100%',
                                height: '100%',
                                bgcolor: 'rgba(255, 255, 255, 0.7)',
                            }}
                        >
                            <CircularProgress sx={{ color: '#1E88E5' }} />
                        </Box>
                    )}
                    <QrScanner
                        delay={300}
                        style={{ height: '100%', width: '100%' }}
                        onError={handleError}
                        onScan={handleScan}
                    />
                </Box>
            ) : (
                <Typography variant="body1" color="error" sx={{ mb: 2 }}>
                    La cámara no está disponible. Por favor, habilita los permisos o verifica la compatibilidad de tu navegador.
                </Typography>
            )}
            
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

export default ScanQR;
