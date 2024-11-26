import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Usado para redirigir al usuario después del login

const Login = () => {
    const [email, setEmail] = useState(''); // Cambiado a email
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState({});  // Errores de validación
    const [backendError, setBackendError] = useState(''); // Error del backend
    const navigate = useNavigate();  // Para redirigir después de login exitoso

    const validateForm = () => {
        let errors = {};
        if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            errors.email = "Por favor ingrese un correo electrónico válido.";
        }
        if (!password) {
            errors.password = "La contraseña es obligatoria.";
        }
        return errors;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formErrors = validateForm();
        
        if (Object.keys(formErrors).length > 0) {
            setFormErrors(formErrors);
            return;  // Evita el envío si hay errores
        }

        try {
            // Enviar las credenciales al backend
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email, // Enviamos email en lugar de username
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
                setBackendError(data.error || 'Credenciales incorrectas');
                setFormErrors({}); // Limpiar los errores de validación en caso de error del backend
            }
        } catch (err) {
            setBackendError('Hubo un error al conectar con el servidor');
            setFormErrors({}); // Limpiar los errores de validación en caso de error de conexión
        }
    };

    // Redirigir a la página de registro
    const handleRegister = () => {
        navigate('/register'); // Asumimos que tienes una ruta de registro en el frontend
    };

    return (
        <div>
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div>
                    <label>Correo electrónico</label>
                    <input 
                        type="email" 
                        placeholder="Ingrese su correo electrónico"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    {formErrors.email && <p style={{ color: 'red' }}>{formErrors.email}</p>}
                </div>
                <div>
                    <label>Contraseña</label>
                    <input 
                        type="password" 
                        placeholder="Ingrese su contraseña"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                    {formErrors.password && <p style={{ color: 'red' }}>{formErrors.password}</p>}
                </div>
                {backendError && <p style={{ color: 'red' }}>{backendError}</p>}
                <button type="submit">Iniciar sesión</button>
            </form>
            <button onClick={handleRegister}>¿No tienes cuenta? Regístrate</button>
        </div>
    );
};

export default Login;
