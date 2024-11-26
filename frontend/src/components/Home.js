import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Bienvenido a la página de inicio</h1>
      <p>¡Felicidades, has iniciado sesión correctamente!</p>
      <Link to="/logout">Cerrar sesión</Link>
    </div>
  );
};

export default Home;
