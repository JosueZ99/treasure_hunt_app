export const refreshAccessToken = async () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Verificar si el backend URL está configurado
  if (!backendUrl) {
    console.error('La URL del backend no está configurada en las variables de entorno.');
    throw new Error('Error interno: URL del backend no configurada.');
  }

  const refreshToken = localStorage.getItem('refresh_token');

  // Verificar si hay un refresh token disponible
  if (!refreshToken) {
    console.error('No hay refresh token disponible en localStorage.');
    throw new Error('No hay refresh token disponible.');
  }

  try {
    const response = await fetch(`${backendUrl}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    // Manejar respuestas según el código de estado
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      return data.access;
    } else if (response.status === 401) {
      console.error('El refresh token ha expirado o no es válido.');
      throw new Error('El refresh token ha expirado. Debes iniciar sesión nuevamente.');
    } else {
      console.error(`Error inesperado: ${response.status}`);
      throw new Error('Error inesperado al renovar el token.');
    }
  } catch (error) {
    console.error('Error al conectar con el servidor:', error);
    throw new Error('No se pudo conectar con el servidor. Por favor, verifica tu conexión.');
  }
};
