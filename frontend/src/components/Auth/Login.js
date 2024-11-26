import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Usado para redirigir al usuario después del login

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();  // Para redirigir después de login exitoso

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Enviar las credenciales al backend
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Guardar el token en localStorage
                localStorage.setItem('access_token', data.access_token);
                // Redirigir al usuario a la página principal
                navigate('/home');
            } else {
                // Mostrar el error devuelto por el backend
                setError(data.error || 'Credenciales incorrectas');
            }
        } catch (err) {
            setError('Hubo un error al conectar con el servidor');
        }
    };

    // Redirigir a la página de registro
    const handleRegister = () => {
        navigate('/register'); // Asumimos que tienes una ruta de registro en el frontend
    };

    return (
        <div>
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Usuario</label>
                    <input 
                        type="text" 
                        placeholder="Ingrese su nombre de usuario"
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Contraseña</label>
                    <input 
                        type="password" 
                        placeholder="Ingrese su contraseña"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Iniciar sesión</button>
            </form>
            <button onClick={handleRegister}>¿No tienes cuenta? Regístrate</button>
        </div>
    );
};

export default Login;
