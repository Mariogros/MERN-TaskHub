# Task Hub 📝

Sistema de gestión de tareas construido con MERN stack (MongoDB, Express, React, Node.js) y análisis en Python.

![Task Hub Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=Task+Hub+Application)

> **Nota**: Aplicación desarrollada como prueba técnica para demostrar conocimientos en desarrollo full-stack.

## 📚 Documentación Adicional

- 📋 [MONGODB.md](MONGODB.md) - Explicación de cómo funciona la conexión a MongoDB
- 🧪 [TESTING.md](TESTING.md) - Ejemplos de testing con cURL y PowerShell
- 🏗️ [STRUCTURE.md](STRUCTURE.md) - Estructura detallada del proyecto
- 📝 [TODO.md](TODO.md) - Lista de mejoras futuras

## 🚀 Inicio Rápido

### Opción 1: Docker (Recomendado)

```bash
# Clonar repositorio y navegar al directorio
cd taskhub

# Copiar variables de entorno
cp .env.example .env

# Levantar todos los servicios
docker-compose up -d

# La aplicación estará disponible en:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000
# - MongoDB: localhost:27017
```

### Opción 2: Ejecución Local

**Requisitos:**
- Node.js 18+ 
- MongoDB 7.0+
- Python 3.10+

**Backend:**
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
npm install
npm start
```

**Script Python:**
```bash
cd python-script
python analyze_tasks.py
```

## 📋 Variables de Entorno

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/taskhub
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## 🧪 Testing

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm test
```

**Observabilidad:**
```bash
# Ver métricas en tiempo real
curl http://localhost:5000/metrics

# O con PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/metrics"

# Demo completo de observabilidad
.\demo-observability.ps1
```

## 🏗️ Estructura del Proyecto

```
taskhub/
├── backend/              # API REST (Node.js/Express)
│   ├── src/
│   │   ├── models/      # Modelos Mongoose
│   │   ├── routes/      # Endpoints de la API
│   │   └── server.js    # Configuración del servidor
│   ├── tests/           # Tests con Jest/Supertest
│   └── Dockerfile
├── frontend/            # Aplicación React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── services/    # Llamadas a la API
│   │   └── tests/       # Tests con RTL
│   └── Dockerfile
├── python-script/       # Script de análisis
│   └── analyze_tasks.py
└── docker-compose.yml
```

## 🔧 Decisiones Técnicas

### Backend
- **Express.js**: Framework minimalista y ampliamente usado, ideal para APIs REST
- **Mongoose**: ODM que simplifica el trabajo con MongoDB y proporciona validación
- **Morgan**: Logger HTTP simple para desarrollo
- **UUID**: Generación de request IDs únicos para trazabilidad
- **Jest + Supertest**: Stack estándar para testing de APIs en Node.js

### Frontend
- **React (sin frameworks adicionales)**: Mantiene el proyecto simple, usando solo hooks
- **CSS vanilla**: Evita dependencias innecesarias; diseño responsive básico pero funcional
- **Debounce manual**: Implementado con setTimeout, evita librerías como lodash
- **Estado local con useState**: Suficiente para esta aplicación; evita complejidad de Redux/Zustand

### Python
- **urllib (stdlib)**: Sin dependencias externas; más robusto que usar requests para una prueba técnica
- **Manejo de errores completo**: HTTPError, URLError, JSON parsing, etc.
- **Formato ISO 8601**: Compatible con el estándar de la API

### DevOps
- **Docker multi-stage builds**: Reduce tamaño de imágenes (frontend)
- **docker-compose**: Orquestación simple de los 3 servicios
- **Nginx**: Servidor web ligero para servir el build de React

## ⚠️ Limitaciones Conocidas

1. **Autenticación**: No implementada (fuera del scope de la prueba)
2. **Paginación**: Las listas cargan todas las tareas (aceptable para POC)
3. **Edición de tareas**: Solo CREATE, READ y DELETE implementados (falta UPDATE/PATCH)
4. **Validaciones**: Básicas del lado del cliente (mejorables con react-hook-form)
5. **Tests**: Coverage parcial (casos principales cubiertos)
6. **Manejo de fechas**: Sin timezone handling avanzado
7. **Accesibilidad**: Básica (sin ARIA labels completos)
8. **Confirmación de eliminación**: Simple confirm() nativo (mejorable con modal personalizado)

## 🎁 Bonus Implementados

- ✅ **Docker**: Dockerfile para backend/frontend + docker-compose completo
- ✅ **Testing**: Tests básicos para API (Jest/Supertest) y Frontend (RTL)
- ✅ **Observabilidad**: Logging estructurado con request IDs + endpoint /metrics
- ✅ **Código limpio**: Estructura modular, nombres descriptivos

## 🔮 Mejoras Futuras

Con más tiempo implementaría:
- Endpoints PATCH/DELETE, paginación y validación con Joi/Zod
- React Query, formularios con react-hook-form, notificaciones y dark mode
- E2E tests con Playwright, CI/CD con GitHub Actions
- Health checks, monitoreo con Prometheus/Grafana

---

**Desarrollado como prueba técnica** | Tiempo estimado: ~2.5 horas
