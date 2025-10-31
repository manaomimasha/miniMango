🥭 MiniMango
Aplicación web para crear, editar y organizar notas personales con autenticación JWT y categorías personalizadas.

🚀 Stack

Backend: Node.js + Express.js

Base de datos: MongoDB

Frontend: Handlebars + Bootstrap 5

Auth: JWT + bcrypt

Deploy: Vercel (serverless)

⚙️ Variables de entorno (.env)
PORT=4000
MONGO_URI=...
JWT_SECRET=clave_super_segura_min_32
JWT_EXPIRES=7d
SESSION_SECRET=otra_clave_unica
NODE_ENV=development

📦 Instalación rápida
git clone https://github.com/tu-usuario/miniMango.git
cd miniMango
npm install
cp .env.example .env
npm run dev

🗂️ Arquitectura
src/
├── config/ # Configuración JWT, DB
├── controllers/ # Lógica de endpoints
├── models/ # Esquemas Mongoose
├── routes/ # Definición de rutas Express
├── services/ # Lógica de negocio
├── views/ # Templates Handlebars
├── public/ # Archivos estáticos
└── server.js # Configuración principal

🔒 Seguridad

Contraseñas encriptadas con bcrypt

Autenticación con JWT (expiración configurable)

Middleware isAuthenticated protege rutas privadas

Sesiones almacenadas en MongoDB

Build Command: npm install

👤 Autor
Masha Tarima
🔗 Demo en Vercel: https://mini-mango-2-0.vercel.app/
