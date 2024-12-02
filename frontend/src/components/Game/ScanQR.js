import React, { useEffect, useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ScanQR = () => {
    const navigate = useNavigate();
    const [isCameraAvailable, setIsCameraAvailable] = useState(false);

    useEffect(() => {
        // Verificar si el navegador tiene acceso a la cámara
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            setIsCameraAvailable(true);
        } else {
            console.error("El navegador no soporta acceso a la cámara.");
            setIsCameraAvailable(false);
        }
    }, []);

    const handleScan = (data) => {
        if (data) {
            console.log("Scanned QR code:", data);
            // Navegar a la página del challenge o procesar el token recibido
            navigate(`/challenge?token=${data}`);
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
                    style={{ height: 300, width: 400 }} // Ajusta el tamaño aquí
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
