export const refreshAccessToken = async () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const refreshToken = localStorage.getItem('refresh_token');
  
    if (!refreshToken) {
      throw new Error('No hay refresh token disponible');
    }
  
    try {
      const response = await fetch(`${backendUrl}/api/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return data.access;
      } else {
        console.error('Error al renovar el access token.');
        throw new Error('Error al renovar el access token');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      throw error; // Lanza el error para que la lógica en App.js lo maneje
    }
  };
  