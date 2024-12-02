import React, { useEffect, useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
                height: '100vh',
                bgcolor: 'background.default',
                color: 'text.primary',
                p: 3,
            }}
        >
            <Typography variant="h5" sx={{ mb: 2 }}>
                Escanea el Código QR
            </Typography>
            
            {isCameraAvailable ? (
                <QrScanner
                    delay={300}
                    style={{ height: 300, width: 400 }}
                    onError={handleError}
                    onScan={handleScan}
                />
            ) : (
                <Typography variant="body1" color="error" sx={{ mb: 2 }}>
                    La cámara no está disponible. Por favor, habilita los permisos o verifica la compatibilidad de tu navegador.
                </Typography>
            )}
            
            <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/home')}
                sx={{ mt: 3 }}
            >
                Regresar
            </Button>
        </Box>
    );
};

export default ScanQR;
