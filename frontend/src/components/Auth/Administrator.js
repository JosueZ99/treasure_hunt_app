
import theme from "../../theme";
import React, { useState } from 'react';

// Componente principal para la administración de retos
const Administrator = () => {
  // Estado para los retos y puntuaciones
  const [challenges, setChallenges] = useState([
    { id: 1, title: "Reto de Programación", description: "Resuelve un problema de algoritmos", deadline: "2024-12-20", score: 85 },
    { id: 2, title: "Desafío Creativo", description: "Diseña una página web creativa", deadline: "2024-12-25", score: 92 }
  ]);

  // Estado para el formulario de crear reto
  const [newChallenge, setNewChallenge] = useState({ title: '', description: '', deadline: '', score: '' });
  const [editing, setEditing] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);

  // Maneja los cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChallenge((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Maneja el envío del formulario para crear o editar retos
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      // Edita el reto
      setChallenges((prevChallenges) =>
        prevChallenges.map((challenge) =>
          challenge.id === currentChallenge.id
            ? { ...challenge, ...newChallenge }
            : challenge
        )
      );
      setEditing(false);
      setCurrentChallenge(null);
    } else {
      // Crea un nuevo reto
      const newId = challenges.length + 1;
      setChallenges([...challenges, { id: newId, ...newChallenge }]);
    }
    setNewChallenge({ title: '', description: '', deadline: '', score: '' });
  };

  // Edita un reto
  const handleEdit = (challenge) => {
    setCurrentChallenge(challenge);
    setNewChallenge({ title: challenge.title, description: challenge.description, deadline: challenge.deadline, score: challenge.score });
    setEditing(true);
  };

  // Elimina un reto
  const handleDelete = (id) => {
    setChallenges(challenges.filter((challenge) => challenge.id !== id));
  };

  return (
    <div>
      <h2>Administrador de Retos</h2>

      {/* Formulario para crear/editar retos */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Título del reto"
          value={newChallenge.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descripción del reto"
          value={newChallenge.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="deadline"
          value={newChallenge.deadline}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="score"
          placeholder="Puntuación"
          value={newChallenge.score}
          onChange={handleInputChange}
          required
        />
        <button type="submit">
          {editing ? 'Actualizar Reto' : 'Crear Reto'}
        </button>
      </form>

      {/* Lista de retos */}
      <h3>Retos Actuales</h3>
      <ul>
        {challenges.map((challenge) => (
          <li key={challenge.id}>
            <h4>{challenge.title}</h4>
            <p>{challenge.description}</p>
            <p><strong>Fecha límite:</strong> {challenge.deadline}</p>
            <p><strong>Puntuación:</strong> {challenge.score}</p>
            <button onClick={() => handleEdit(challenge)}>Editar</button>
            <button onClick={() => handleDelete(challenge.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Administrator;