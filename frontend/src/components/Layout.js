import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Container, IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Layout = ({ children, userName = "Usuario", userPoints = 0 }) => {
    const location = useLocation(); // Hook para obtener la ruta actual
    const hideNavbar = location.pathname === '/login' || location.pathname === '/register'; // Condición para ocultar la barra

    // Estado para el menú desplegable
    const [anchorEl, setAnchorEl] = useState(null);

    // Manejar la apertura del menú al hacer clic en el nombre del usuario
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Manejar el cierre del menú
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Manejar el cierre de sesión
    const handleLogout = () => {
        handleClose();
        // Aquí puedes redirigir al usuario a la página de logout
        window.location.href = '/logout';
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header */}
            {!hideNavbar && (
                <AppBar position="sticky" color="primary">
                    <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
                        {/* Nombre del usuario y menú desplegable */}
                        <Box>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="user menu"
                                onClick={handleMenu}
                                sx={{ p: 0, ml: 0.1 }} // Añadido margen a la izquierda
                            >
                                <AccountCircle sx={{ mr: 1 }} />
                                <Typography variant="h6" component="div">
                                    {userName}
                                </Typography>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                            </Menu>
                        </Box>

                        {/* Puntos del usuario en la esquina derecha */}
                        <Typography variant="h6" component="div">
                            {`${userPoints} pts`}
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flex: '1 0 auto',
                    bgcolor: 'background.default',
                    color: 'text.primary',
                    py: 3,
                }}
            >
                <Container>{children}</Container>
            </Box>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    bgcolor: 'background.paper',
                    py: 2,
                    textAlign: 'center',
                    mt: 'auto',
                }}
            >
                <Typography variant="body2">
                    © 2024 EcoTreasure Hunt. Todos los derechos reservados.
                </Typography>
            </Box>
        </Box>
    );
};

export default Layout;
