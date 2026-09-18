# EventHub 🎟️

**EventHub** es una plataforma web completa para la administración, publicación, venta de entradas y control de asistencia a eventos mediante códigos QR seguros.

---

## 🚀 Tech Stack

| Capa       | Tecnología                                           |
|------------|------------------------------------------------------|
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS, React Router DOM v6, `qrcode.react` |
| Backend    | Node.js, Express, TypeScript (NodeNext/ESM)          |
| ORM        | Prisma ORM                                           |
| Base de datos | PostgreSQL (Supabase compatible)                 |
| Auth       | JWT + Bcrypt                                         |
| QR Tokens  | Criptografía `crypto.randomBytes` (hex)              |
| Despliegue | GitHub Pages (frontend) · Docker + docker-compose (backend) |

---

## 🗂️ Estructura del Proyecto

```
EvenHUB 2/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Modelos de datos
│   │   └── seed.ts                # Datos iniciales
│   └── src/
│       ├── config/                # Env + Prisma client
│       ├── controllers/           # Controladores HTTP
│       ├── interfaces/            # DTOs e interfaces TS
│       ├── middlewares/           # Auth, autorización, errores
│       ├── repositories/          # Capa de acceso a datos (Prisma)
│       ├── routes/                # Router Express por módulo
│       ├── services/              # Lógica de negocio
│       └── utils/                 # JWT, bcrypt, QR token, AppError
├── frontend/
│   └── src/
│       ├── components/            # Componentes reutilizables
│       ├── context/               # AuthContext
│       ├── hooks/                 # useAuth
│       ├── interfaces/            # Tipos TypeScript del cliente
│       ├── layouts/               # Navbar, Sidebar, Layouts
│       ├── routes/                # AppRoutes + ProtectedRoute
│       ├── services/              # Llamadas a la API (Axios)
│       └── views/                 # Vistas por módulo funcional
├── docker-compose.yml
└── package.json
```

---

## 👥 Roles y Permisos

| Rol          | Permisos principales |
|--------------|----------------------|
| `ADMIN`      | CRUD completo de eventos, usuarios, categorías, reportes globales |
| `ORGANIZADOR`| Crear y gestionar sus propios eventos, validar QR en puerta |
| `USUARIO`    | Explorar eventos, comprar entradas, ver tickets digitales con QR |

---

## 🔐 Flujo de Ticket QR

```
Compra → Ticket emitido con qrToken único (EVH-TK-<hex>) → QR Code generado en frontend
→ Escaneo / ingreso manual → Validación en backend → Registro de Attendance (con timestamp y auditor)
```

- El `qrToken` **no expone datos sensibles** — es un token opaco único.
- El `ticketNumber` (`EVH-YYYY-XXXXX`) permite ingreso manual como alternativa.
- La tabla `Attendance` tiene restricción `UNIQUE` en `ticketId` para prevenir duplicados.

---

## ⚙️ Configuración Local

### Prerrequisitos

- Node.js v18+
- PostgreSQL local o cuenta en [Supabase](https://supabase.com)
- Docker (opcional, para contenedores)

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/eventhub.git
cd "EvenHUB 2"
```

### 2. Configurar el Backend

```bash
cd backend
cp .env.example .env
```

Edita `backend/.env`:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/eventhub_db"
JWT_SECRET="tu-secreto-super-seguro-jwt"
PORT=4000
NODE_ENV=development
```

**Con Supabase:**
```env
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

### 3. Configurar el Frontend

```bash
cd ../frontend
cp .env.example .env
```

Edita `frontend/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

```bash
npm install
npm run dev
```

La app estará disponible en `http://localhost:5173`

---

## 🐳 Docker (Recomendado para producción)

```bash
# Desde la raíz del monorepo
cp backend/.env.example backend/.env
# (Editar variables de entorno)

docker compose up --build
```

Servicios:
- **PostgreSQL**: `localhost:5432`
- **Backend API**: `localhost:4000`
- **Frontend**: `localhost:3000`

---

## 🌐 Despliegue en GitHub Pages

El frontend está configurado con `base: './'` en Vite y usa `HashRouter` para compatibilidad con GitHub Pages.

```bash
cd frontend
npm run build
# Publica la carpeta dist/ en GitHub Pages
```

Configura `VITE_API_URL` en los secrets del repositorio o en el archivo `.env.production`.

---

## 🌱 Datos de Prueba (Seed)

Tras ejecutar `npx prisma db seed`, tendrás:

| Email                     | Contraseña   | Rol          |
|---------------------------|--------------|--------------|
| `admin@eventhub.bo`       | `Admin123!`  | ADMIN        |
| `organizador@eventhub.bo` | `Org123!`    | ORGANIZADOR  |
| `usuario@eventhub.bo`     | `User123!`   | USUARIO      |

---

## 📡 API Endpoints (Principales)

| Método | Ruta                      | Descripción                                  |
|--------|---------------------------|----------------------------------------------|
| POST   | `/api/auth/login`         | Iniciar sesión y obtener JWT                 |
| POST   | `/api/auth/register`      | Crear nueva cuenta                           |
| GET    | `/api/events`             | Listar eventos con filtros opcionales        |
| GET    | `/api/events/:id`         | Obtener detalle de un evento                 |
| POST   | `/api/events`             | Crear evento (ORGANIZADOR/ADMIN)             |
| POST   | `/api/purchases`          | Comprar entradas (atómico con Prisma $tx)    |
| GET    | `/api/tickets/my-tickets` | Cartera digital de entradas del usuario      |
| GET    | `/api/tickets/:id`        | Detalle completo de un ticket con QR token   |
| POST   | `/api/qr/validate`        | Validar entrada por QR token o ticketNumber  |
| GET    | `/api/statistics/dashboard`| Métricas y estadísticas en tiempo real      |
| GET    | `/api/reports`            | Generador de reportes con filtros y CSV      |
| GET    | `/api/health`             | Health check del servidor                    |

---

## 🧱 Arquitectura Backend

```
Request → Router → Middleware (Auth/Authorize) → Controller → Service → Repository → Prisma → PostgreSQL
                                                                    ↑
                                                          AppError (manejo centralizado)
```

---

## 📦 Scripts Disponibles

### Backend
```bash
npm run dev      # Desarrollo con ts-node/tsx watch
npm run build    # Compilar TypeScript a dist/
npm run start    # Ejecutar dist/server.js
npm run seed     # Poblar base de datos con datos iniciales
```

### Frontend
```bash
npm run dev      # Servidor de desarrollo Vite
npm run build    # Build de producción en dist/
npm run preview  # Vista previa del build
```

---

## 🔒 Seguridad

- Tokens JWT firmados con `HS256` y expiración configurable
- Contraseñas hasheadas con `bcrypt` (cost factor 12)
- Tokens QR opacos: no exponen información del usuario ni del evento
- Middleware de autorización por rol en cada ruta protegida
- `Attendance.ticketId` con restricción UNIQUE para prevenir doble validación

---

## 📄 Licencia

MIT — Proyecto académico desarrollado con fines educativos.
