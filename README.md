# Here are your Instructions
README - Todo List App con CRUD y Autenticación OAuth
Descripción del Proyecto | Project Description

La aplicación Todo List es una herramienta de gestión de tareas que permite a los usuarios crear, editar, eliminar y listar sus tareas. Además, incluye un sistema de autenticación con Google OAuth y un sistema de sesiones con MongoDB. Los usuarios pueden filtrar las tareas por estado y prioridad, todo con un diseño moderno y responsive.

The Todo List app is a task management tool that allows users to create, edit, delete, and list their tasks. It also includes Google OAuth authentication and a session management system with MongoDB. Users can filter tasks by status and priority, all with a modern and responsive design.

Características Implementadas | Implemented Features
Autenticación | Authentication:

Google OAuth: Los usuarios pueden iniciar sesión con su cuenta de Google.

Sistema de sesiones: Gestión de sesiones con MongoDB, duración de 7 días.

Cookies seguras: Cookies configuradas con httpOnly, secure y SameSite para mayor seguridad.

Logout funcional: Permite cerrar sesión correctamente.

Gestión de Tareas (CRUD) | Task Management (CRUD):

Crear tareas: Los usuarios pueden crear tareas con título, descripción, fecha límite y prioridad.

Listar tareas: Visualiza todas las tareas asociadas al usuario autenticado.

Editar tareas: Modifica las tareas existentes.

Marcar tareas como completadas/pendientes: Actualiza el estado de las tareas.

Eliminar tareas: Elimina tareas cuando ya no sean necesarias.

Aislamiento por usuario: Cada usuario solo puede ver sus propias tareas.

Filtros Avanzados | Advanced Filters:

Filtro por estado: Filtra tareas por estado (todas/pendientes/completadas).

Filtro por prioridad: Filtra tareas por prioridad (todas/alta/media/baja).

Diseño UI/UX | UI/UX Design:

Landing Page vibrante: Uso de gradientes modernos y colores vibrantes como azul, púrpura, rosa y verde.

Dashboard con estadísticas: Muestra estadísticas del total de tareas, completadas y pendientes.

Fuentes modernas: Space Grotesk para títulos e Inter para el texto.

Animaciones suaves: Transiciones fluidas en los elementos hover.

Diseño responsive: La aplicación es completamente funcional en dispositivos móviles, tabletas y escritorios.

Estado de Pruebas | Testing Results

Backend: 100% de los endpoints funcionan correctamente según los tests realizados (8/8 endpoints).

Frontend: 90% de las funcionalidades operativas.
Problema menor: Los dropdowns tienen interacción limitada en las pruebas automatizadas (prioridad baja).

Backend: 100% of the endpoints are working correctly according to the tests (8/8 endpoints).

Frontend: 90% of the core functionalities are working.
Minor issue: Dropdowns have limited interaction in automated testing (low priority).

Instrucciones para Ejecutar el Proyecto | Instructions to Run the Project
Requisitos previos | Prerequisites:

Node.js y npm (para el frontend)

Python y pip (para el backend)

MongoDB (para la base de datos)

Credenciales de Google OAuth (si deseas habilitar la autenticación con Google)

Pasos para ejecutar el frontend | Steps to run the frontend:

Clona el repositorio:

git clone https://github.com/tu_usuario/todo-list-app.git


Navega a la carpeta del frontend:

cd todo-list-app/frontend


Instala las dependencias de Node.js:

npm install


Inicia el servidor de desarrollo:

npm start


Abre tu navegador y visita http://localhost:3000
.

Pasos para ejecutar el backend | Steps to run the backend:

Navega a la carpeta del backend:

cd todo-list-app/backend


Crea un entorno virtual (opcional, pero recomendado):

python -m venv venv
source venv/bin/activate  # En Linux/Mac
venv\Scripts\activate     # En Windows


Instala las dependencias:

pip install -r requirements.txt


Configura las credenciales de MongoDB en el archivo config.py.

Inicia el servidor:

python app.py


El backend debería estar corriendo en http://localhost:5000
.

Ejecutar pruebas automáticas | Run automated tests:

Para ejecutar los tests de backend, usa pytest:

pytest


Para ejecutar los tests del frontend, usa npm test:

npm test

Contribución | Contributing

Si deseas contribuir al proyecto, sigue estos pasos:

Haz un fork del repositorio.

Crea una rama con tu nueva característica o corrección:

git checkout -b nueva-caracteristica


Realiza los cambios y haz commit:

git commit -m "Agregada nueva característica"


Sube los cambios a tu fork:

git push origin nueva-caracteristica


Crea un Pull Request desde tu fork al repositorio principal.
