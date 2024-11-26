import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState({});  // Errores de validación
    const [backendError, setBackendError] = useState(''); // Error del backend
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();  // Para redirigir al usuario después de un registro exitoso

    // Validar el formulario antes de enviarlo
    const validateForm = () => {
        let errors = {};
        if (!firstName.trim()) {
            errors.firstName = "El nombre es obligatorio.";
        }
        if (!lastName.trim()) {
            errors.lastName = "El apellido es obligatorio.";
        }
        if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            errors.email = "Por favor ingrese un correo electrónico válido.";
        }
        if (password.length < 6) {
            errors.password = "La contraseña debe tener al menos 6 caracteres.";
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

        // Limpiar cualquier mensaje de error previo
        setBackendError('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Si el registro es exitoso, mostrar un mensaje de éxito
                setSuccessMessage('Registro exitoso. Ahora puedes iniciar sesión.');
                setFormErrors({}); // Limpiar errores de validación en caso de éxito
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                // Si hay un error, mostrar el mensaje de error
                setBackendError(data.error || 'Hubo un error al registrar la cuenta.');
            }
        } catch (err) {
            setBackendError('Hubo un error al conectar con el servidor');
        }
    };

    return (
        <div>
            <h2>Registro de cuenta</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div>
                    <label>Email</label>
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
                    <label>Nombre</label>
                    <input
                        type="text"
                        placeholder="Ingrese su nombre"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    {formErrors.firstName && <p style={{ color: 'red' }}>{formErrors.firstName}</p>}
                </div>
                <div>
                    <label>Apellido</label>
                    <input
                        type="text"
                        placeholder="Ingrese su apellido"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    {formErrors.lastName && <p style={{ color: 'red' }}>{formErrors.lastName}</p>}
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
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
};

export default Register;
