# MovieReviews API - Backend

Backend de **MovieReviews**, una API REST desarrollada con Node.js y Express para gestionar autenticación, usuarios, reseñas, favoritos y funciones administrativas, además de consumir información cinematográfica desde la API externa de TMDB.

El backend se comunica con una base de datos PostgreSQL y está diseñado para ser consumido por el frontend de MovieReviews.

---

## Tecnologías utilizadas

- Node.js
- Express 5
- PostgreSQL
- `pg`
- JSON Web Tokens (`jsonwebtoken`)
- `bcryptjs`
- Zod
- CORS
- Helmet
- dotenv
- Nodemon
- TMDB API

---

## Arquitectura del proyecto

El backend utiliza una arquitectura por capas:

```text
Request HTTP
    |
    v
Routes
    |
    v
Middlewares
    |
    v
Controllers
    |
    v
Services
    |
    v
Repositories
    |
    v
PostgreSQL
```

Para la información externa de películas y personas:

```text
Controllers
    |
    v
Services
    |
    v
TMDB API
```

---
## Requisitos del sistema

Antes de ejecutar el backend es necesario tener instalado:

- **Node.js 18 o superior**
- **npm**
- **PostgreSQL**
- Acceso a una cuenta de **TMDB** para obtener un API Read Access Token
- El frontend de MovieReviews si se desea probar la aplicación completa

Node.js 18 o superior es necesario porque el proyecto utiliza Express 5 y la función global `fetch()` para consumir TMDB.

Para comprobar las instalaciones:

```bash
node --version
npm --version
psql --version
```

---

## Instalación

### 1. Tener el proyecto de manera local

Clonar el repositorio:

```bash
git clone https://github.com/John03-desing/backend-moviereviews.git
```

Entrar a la carpeta del backend:

```bash
cd backend
```
---

### 2. Instalar dependencias

Ejecutar:

```bash
npm install
```

Esto instalará las dependencias definidas en `package.json`.

Las dependencias principales son:

| Dependencia | Uso |
| --- | --- |
| `express` | Creación de la API REST |
| `pg` | Conexión con PostgreSQL |
| `bcryptjs` | Hash y verificación de contraseñas |
| `jsonwebtoken` | Generación y validación de JWT |
| `zod` | Validación de datos de entrada |
| `cors` | Control de acceso desde el frontend |
| `helmet` | Cabeceras HTTP de seguridad |
| `dotenv` | Lectura de variables de entorno |
| `nodemon` | Reinicio automático en desarrollo |

---

## Nota: Tambien se debe de tener instalado PostgreSQL para tener una base de datos local


## Configuración de PostgreSQL

### 1. Crear la base de datos

Ingresar a PostgreSQL:

```bash
psql -U postgres
```

Crear una base de datos para el proyecto:

```sql
CREATE DATABASE moviereviews;
```

Salir de PostgreSQL:

```sql
\q
```

El nombre `moviereviews` es solo una recomendación. Si se utiliza otro nombre, debe coincidir con `DB_NAME` en el archivo `.env`.

---

### 2. Crear las tablas

El proyecto utiliza tres tablas principales:

```text
users
reviews
favorites
```

Ejecutar el archivo `schema.sql` sobre la base de datos:

```bash
psql -U postgres -d moviereviews -f schema.sql
```

Si `schema.sql` se encuentra en otra carpeta, ajustar la ruta del comando.

El esquema incluye:

- claves primarias;
- claves foráneas;
- restricciones `UNIQUE`;
- restricciones `CHECK`;
- eliminación en cascada de reseñas y favoritos cuando se elimina un usuario;
- roles `user` y `admin`;
- calificaciones entre 1 y 10.

---

## Variables de entorno

El proyecto incluye un archivo `.env.example`.

Crear una copia con el nombre `.env`.

Después editar `.env` con los datos del entorno local.

Ejemplo:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=moviereviews
DB_USER=postgres
DB_PASSWORD=tu_password

CLIENT_ORIGIN=http://localhost:5432

JWT_SECRET=una_clave_muy_segura
JWT_EXPIRES_IN=2h

TMDB_ACCESS_TOKEN=TU_TOKEN_DE_TMDB
TMDB_BASE_URL=https://api.themoviedb.org/3
```

### Descripción de las variables

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto HTTP utilizado por Express. Si no se define, se utiliza `3000`. |
| `DB_HOST` | Host de PostgreSQL. En local normalmente es `localhost`. |
| `DB_PORT` | Puerto de PostgreSQL. Normalmente `5432`. |
| `DB_NAME` | Nombre de la base de datos. |
| `DB_USER` | Usuario de PostgreSQL. |
| `DB_PASSWORD` | Contraseña del usuario de PostgreSQL. |
| `CLIENT_ORIGIN` | Dirección desde la que se ejecuta el frontend y que CORS permitirá. |
| `JWT_SECRET` | Clave privada utilizada para firmar y verificar los JWT. |
| `JWT_EXPIRES_IN` | Tiempo de vigencia del JWT. El proyecto utiliza `2h` por defecto. |
| `TMDB_ACCESS_TOKEN` | API Read Access Token proporcionado por TMDB. |
| `TMDB_BASE_URL` | URL base de TMDB. Por defecto: `https://api.themoviedb.org/3`. |

---

## Configuración de TMDB

El backend consulta TMDB para obtener información sobre películas, géneros, próximos estrenos y personas destacadas.

El token se envía mediante:

```text
Authorization: Bearer <TMDB_ACCESS_TOKEN>
```

Por esta razón es necesario configurar:

```env
TMDB_ACCESS_TOKEN=TU_TOKEN_DE_TMDB
```

La URL base utilizada es:

```env
TMDB_BASE_URL=https://api.themoviedb.org/3
```

Las credenciales de TMDB deben permanecer únicamente en el backend.

---

## Configuración de CORS

El backend permite solicitudes desde la dirección configurada en:

```env
CLIENT_ORIGIN=http://localhost:5173
```

Esta dirección debe coincidir con la URL utilizada por el frontend.

Por ejemplo, si Vite está ejecutándose en:

```text
http://localhost:5173
```

la variable debe conservar ese valor.

Si el frontend utiliza otro puerto, también debe modificarse `CLIENT_ORIGIN`.

---

## Ejecutar el proyecto

### Modo desarrollo

Ejecutar:

```bash
npm run dev
```

Este comando utiliza Nodemon:

```text
nodemon src/server.js
```

Cada vez que se modifica el código, el servidor se reinicia automáticamente.

Cuando la conexión con PostgreSQL es correcta, la terminal debe mostrar mensajes similares a:

```text
PostgreSQL conectado
Servidor ejecutándose en http://localhost:3000
```

---

## Verificar que el servidor funciona

El backend incluye un endpoint de salud:

```http
GET /health
```

Con la configuración predeterminada:

```text
http://localhost:3000/health
```

La respuesta esperada es:

```json
{
  "status": "ok"
}
```

El servidor solamente comienza a escuchar solicitudes después de comprobar correctamente la conexión con PostgreSQL.

Nota: se puede verificar el estatus mediante el uso de Postman

---

## URL base de la API

Con el puerto predeterminado:

```text
http://localhost:3000
```

Los recursos principales se encuentran bajo:

```text
http://localhost:3000/api
```

---

## Endpoints disponibles

### Autenticación

| Método | Endpoint | Acceso | Descripción |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Público | Registrar un usuario |
| `POST` | `/api/auth/login` | Público | Iniciar sesión |

---

### Películas

| Método | Endpoint | Acceso | Descripción |
| --- | --- | --- | --- |
| `GET` | `/api/movies/upcoming` | Público | Obtener próximos estrenos |
| `GET` | `/api/movies/search` | Público | Buscar películas |
| `GET` | `/api/movies/genres` | Público | Obtener géneros |

---

### Personas

| Método | Endpoint | Acceso | Descripción |
| --- | --- | --- | --- |
| `GET` | `/api/people/featured` | Público | Obtener personas destacadas |

---

### Reseñas

| Método | Endpoint | Acceso | Descripción |
| --- | --- | --- | --- |
| `GET` | `/api/reviews` | Público | Obtener reseñas publicadas |
| `GET` | `/api/reviews/mine` | Autenticado | Obtener las reseñas del usuario |
| `GET` | `/api/reviews/mine/:id` | Autenticado | Obtener una reseña propia |
| `POST` | `/api/reviews` | Autenticado | Crear una reseña |
| `PUT` | `/api/reviews/:id` | Autenticado | Actualizar una reseña |
| `DELETE` | `/api/reviews/:id` | Autenticado | Eliminar una reseña |

---

### Favoritos

| Método | Endpoint | Acceso | Descripción |
| --- | --- | --- | --- |
| `GET` | `/api/favorites` | Autenticado | Obtener favoritos |
| `POST` | `/api/favorites` | Autenticado | Agregar una película a favoritos |
| `DELETE` | `/api/favorites/:movieId` | Autenticado | Eliminar una película de favoritos |

---

### Administración

| Método | Endpoint | Acceso | Descripción |
| --- | --- | --- | --- |
| `GET` | `/api/admin/reviews` | Administrador | Consultar reseñas para administración |
| `DELETE` | `/api/admin/reviews/:id` | Administrador | Eliminar cualquier reseña |

Las rutas administrativas requieren autenticación y que el JWT contenga:

```json
{
  "role": "admin"
}
```

---

## Autenticación JWT

Las rutas protegidas esperan un JWT en el encabezado HTTP:

```http
Authorization: Bearer <token>
```

Si no se proporciona el encabezado se devuelve un error de autenticación.

El token se genera durante el inicio de sesión e incluye:

```json
{
  "id": 1,
  "username": "usuario",
  "role": "user"
}
```

La duración se obtiene de:

```env
JWT_EXPIRES_IN=2h
```

Si no se especifica, el backend utiliza `2h`.

---

## Contraseñas

Las contraseñas no se almacenan directamente.

Durante el registro se utiliza `bcryptjs` para generar un hash con un factor de trabajo de:

```text
12
```

Durante el inicio de sesión se compara la contraseña recibida con el hash almacenado en PostgreSQL.

---

## Roles

La tabla `users` admite únicamente:

```text
user
admin
```

Los usuarios registrados normalmente reciben el rol:

```text
user
```

Para preparar un administrador en un entorno local se puede:

1. Registrar normalmente una cuenta.
2. Modificar su rol directamente en PostgreSQL:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'admin@ejemplo.com';
```

3. Cerrar sesión e iniciar sesión nuevamente para generar un JWT que incluya el nuevo rol.

Para comprobar el resultado:

```sql
SELECT id, username, email, role
FROM users
ORDER BY id;
```

---

## Base de datos

El backend utiliza PostgreSQL mediante un `Pool` configurado con:

```text
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
```

Al iniciar el servidor se ejecuta:

```sql
SELECT NOW();
```

para comprobar que PostgreSQL se encuentra disponible.

Si la conexión falla, el servidor no comienza a escuchar peticiones HTTP.

---

## Modelo de datos

### `users`

Almacena las cuentas de usuario.

Campos principales:

```text
id
username
email
password_hash
role
created_at
```

`username` y `email` son únicos.

---

### `reviews`

Almacena las reseñas.

Campos principales:

```text
id
movie_id
user_id
rating
comment
status
created_at
updated_at
```

Reglas principales:

- la calificación debe estar entre 1 y 10;
- cada usuario puede tener una sola reseña por película;
- `user_id` referencia a `users(id)`;
- al eliminar un usuario sus reseñas se eliminan mediante `ON DELETE CASCADE`.

---

### `favorites`

Almacena las películas favoritas de cada usuario.

Campos principales:

```text
id
user_id
movie_id
created_at
```

Cada combinación:

```text
user_id + movie_id
```

debe ser única.

---

## Relación con TMDB

La información completa de las películas no se almacena localmente.

Los campos:

```text
movie_id
```

de `reviews` y `favorites` corresponden al identificador de una película de TMDB.

El backend consulta TMDB cuando necesita información como:

- título;
- póster;
- fecha de estreno;
- géneros;
- próximos estrenos;
- personas destacadas.

Por esta razón no existe una tabla local `movies`.

---

## Seguridad y validación

El backend incluye:

### Helmet

Se ejecuta mediante:

```js
app.use(helmet())
```

para agregar cabeceras HTTP de seguridad.

### CORS

Se limita el origen permitido mediante:

```text
CLIENT_ORIGIN
```

### Validación

Las rutas que reciben información utilizan esquemas de Zod y un middleware de validación.

Cuando los datos no son válidos se responde con:

```json
{
  "message": "Datos inválidos"
}
```

### Autorización

Las rutas protegidas verifican JWT mediante el middleware de autenticación.

Las rutas administrativas comprueban adicionalmente:

```text
role === "admin"
```

---

## Ejecución completa en local

### Terminal 1 - PostgreSQL

Comprobar que PostgreSQL esté iniciado y que exista la base de datos.

Ejecutar el esquema si todavía no se ha realizado:

```bash
psql -U postgres -d moviereviews -f schema.sql
```

### Terminal 2 - Backend

```bash
cd backend
npm install
npm run dev
```

Comprobar:

```text
http://localhost:3000/health
```

### Terminal 3 - Frontend

Desde el proyecto frontend:

```bash
npm install
npm run dev
```

Por defecto el frontend debe coincidir con:

```env
CLIENT_ORIGIN=http://localhost:5173
```

Flujo final:

```text
Frontend
http://localhost:5173
        |
        v
Backend
http://localhost:3000
        |
        +------> PostgreSQL
        |
        +------> TMDB API
```
---

## Notas

- No incluir `.env` en el repositorio.
- Mantener `.env.example` actualizado si lo modificas.
- No exponer `JWT_SECRET`.
- No exponer `TMDB_ACCESS_TOKEN` en el frontend.
- Ejecutar primero PostgreSQL, después el backend y finalmente el frontend.
- Después de cambiar el rol de un usuario, iniciar sesión nuevamente para generar un JWT actualizado.

---

## Autor

Desarrollado como parte del proyecto **MovieReviews**.
