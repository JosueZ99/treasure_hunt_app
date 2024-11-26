import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Enviar los datos al backend para el registro
            const response = await fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    email,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Redirigir a la página de login después del registro
                alert('Registro exitoso. Por favor inicie sesión');
                navigate('/login');
            } else {
                // Mostrar el error
                setError(data.error || 'Error en el registro');
            }
        } catch (err) {
            setError('Hubo un error al conectar con el servidor');
        }
    };

    return (
        <div>
            <h2>Registrar cuenta</h2>
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
                <div>
                    <label>Email</label>
                    <input 
                        type="email" 
                        placeholder="Ingrese su correo electrónico"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
};

export default Register;
