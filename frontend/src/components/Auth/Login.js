import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

const Login = ({ onAuthChange }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [backendError, setBackendError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const validateForm = () => {
        let errors = {};

        if (!email) {
            errors.email = "El correo electrónico es obligatorio.";
        } else if (!/^[A-Z0-9._%+-]+@puce\.edu\.ec$/i.test(email)) {
            errors.email = "El correo debe pertenecer al dominio @puce.edu.ec.";
        }

        if (!password) {
            errors.password = "La contraseña es obligatoria.";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setFormErrors(formErrors);
            setIsSubmitting(false);
            return;
        }
    
        try {
            const response = await fetch(`${backendUrl}/api/token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // Guarda los tokens en localStorage
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                onAuthChange(); // Asegura que el estado de autenticación esté actualizado
                navigate('/home'); // Redirige al home
            } else {
                setBackendError(data.error || 'Credenciales incorrectas');
            }
        } catch (err) {
            setBackendError('Hubo un error al conectar con el servidor');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: '1 0 auto', // Permite que el contenedor principal ocupe el espacio restante
                justifyContent: 'center',
                alignItems: 'center',
                px: 2, // Padding lateral para dispositivos pequeños
                py: 4, // Padding superior e inferior para evitar que el contenido esté pegado
                bgcolor: 'background.default',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    maxWidth: 400,
                    width: '100%',
                    textAlign: 'center',
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                }}
            >
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Iniciar Sesión
                </Typography>

                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth
                        label="Correo electrónico"
                        variant="outlined"
                        margin="dense"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={Boolean(formErrors.email)}
                        helperText={formErrors.email}
                    />

                    <TextField
                        fullWidth
                        label="Contraseña"
                        type="password"
                        variant="outlined"
                        margin="dense"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={Boolean(formErrors.password)}
                        helperText={formErrors.password}
                    />

                    {backendError && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {backendError}
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={isSubmitting} // Deshabilita el botón mientras se envía la solicitud
                    >
                        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </Button>
                </form>

                <Button
                    onClick={handleRegister}
                    variant="text"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    ¿No tienes cuenta? ¡Regístrate y participa!
                </Button>
            </Paper>
        </Box>
    );
};

export default Login;
