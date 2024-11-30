# Eco-Treasure Hunt
**Explora, resuelve y aprende mientras recorres el campus de la PUCE** 

Aplicación creada para el DevChallenge - Nov 2024

**Tecnología Superior en Desarrollo de Software**

**Proyectos de Software - Bases de Datos II - Desarrollo Web**

Autores: **Josue Zambrano, Alison Carrión , Nelson Allauca**


Eco-Treasure Hunt es una aplicación interactiva diseñada para estudiantes de la Universidad Católica del Ecuador (PUCE).  
El objetivo es fomentar la conciencia ambiental. Los estudiantes registran su progreso mientras escanean códigos QR distribuidos por el campus y resuelven acertijos que los guían hacia nuevas ubicaciones.  

Este proyecto combina tecnología y aprendizaje para crear una experiencia única que integra el entorno físico con soluciones tecnológicas modernas.


# Instalación y Despliegue

Este documento proporciona los pasos necesarios para instalar, configurar y desplegar el backend y el frontend de la aplicación tanto en un entorno local como en un entorno compartido. Asegúrate de seguir los pasos detallados para evitar problemas durante el proceso.

## Requisitos Previos

Asegúrate de tener los siguientes programas instalados:

- [Python 3.9+](https://www.python.org/downloads/)
- [Node.js y npm](https://nodejs.org/en/download/) (para el frontend)
- [Git](https://git-scm.com/)

## Clonación del Repositorio

Clona el repositorio de la aplicación desde GitHub ejecutando el siguiente comando:

```bash
$ git clone <URL del repositorio>
$ cd <nombre_del_proyecto>
```

## Backend - Instalación y Configuración

### 1. Crear el Entorno Virtual

Se recomienda usar un entorno virtual para instalar las dependencias del backend de forma aislada:

```bash
$ python -m venv venv
```

Activa el entorno virtual:

- **Linux/macOS**:
  ```bash
  $ source venv/bin/activate
  ```
- **Windows**:
  ```bash
  $ .\venv\Scripts\activate
  ```

### 2. Instalar las Dependencias del Backend

Instala las dependencias necesarias desde el archivo `requirements.txt`:

```bash
$ pip install -r requirements.txt
```

### 3. Configurar Variables de Entorno para el Backend

Crea un archivo `.env` en el directorio raíz del backend y configura las variables de entorno necesarias, como la URL donde se desplegará el servidor de Django:

```
BACKEND_URL=http://127.0.0.1:8000
```

### 4. Migrar la Base de Datos

Ejecuta las migraciones de la base de datos:

```bash
$ python manage.py makemigrations
$ python manage.py migrate
```

### 5. Crear un Superusuario (Opcional)

Para acceder al panel de administración de Django, crea un superusuario ejecutando:

```bash
$ python manage.py createsuperuser
```

### 6. Correr el Servidor de Desarrollo

Inicia el servidor de desarrollo de Django:

```bash
$ python manage.py runserver
```

El servidor estará disponible en [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Frontend - Instalación y Configuración

### 1. Ir al Directorio del Frontend

Navega al directorio del frontend dentro del proyecto:

```bash
$ cd frontend
```

### 2. Instalar las Dependencias del Frontend

Instala todas las dependencias necesarias para el frontend usando npm:

```bash
$ npm install
```

Esto instalará dependencias como `react`, `react-router-dom`, `@mui/material`, entre otras.

### 3. Configurar Variables de Entorno para el Frontend

Crea un archivo `.env` en el directorio del frontend si es necesario, y configura variables como la URL del backend:

```
FRONTEND_URL=http://127.0.0.1:3000
```

### 4. Correr el Servidor de Desarrollo del Frontend

Para iniciar el servidor de desarrollo de React, ejecuta:

```bash
$ npm start
```

El servidor estará disponible en [http://localhost:3000](http://localhost:3000).

## Contribuir

Para contribuir al proyecto:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

