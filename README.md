# Task Hub

Sistema de gestión de tareas construido con MERN stack (MongoDB, Express, React, Node.js) y script de análisis en Python.

## 🚀 Inicio Rápido

**Requisitos:** Docker y Docker Compose

```bash
# Levantar todos los servicios
docker-compose up -d

# Acceder a la aplicación
# - Frontend: http://localhost:3000
# - API: http://localhost:5000
```

### Ejecución sin Docker

**Requisitos:** Node.js 18+, MongoDB 7.0+, Python 3.10+

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (nueva terminal)
cd frontend && npm install && npm start

# Script Python
python python-script/analyze_tasks.py
```

## 📋 Variables de Entorno

Copiar archivos `.env.example` a `.env` en cada directorio según necesidad.

## 🧪 Testing

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# Métricas de observabilidad
curl http://localhost:5000/metrics
```

## 🔧 Decisiones Técnicas

**Backend:**
- Express.js por su simplicidad y ecosistema maduro
- Mongoose para schemas y validación con MongoDB
- Jest + Supertest como stack estándar de testing
- UUID para request IDs únicos (trazabilidad)

**Frontend:**
- React con hooks, sin frameworks adicionales
- CSS vanilla para evitar dependencias innecesarias
- Debounce implementado con setTimeout (sin librerías)
- Estado local con useState (suficiente para el scope)

**Python:**
- urllib (stdlib) para evitar dependencias externas
- Manejo robusto de errores (HTTP, red, JSON)

**DevOps:**
- Docker multi-stage para optimizar tamaño de imágenes
- docker-compose para orquestación de servicios
- Nginx como servidor web para React

## 🎁 Bonus Implementados

- **Docker**: Dockerfiles + docker-compose con 3 servicios
- **Testing**: Jest/Supertest (backend) + React Testing Library (frontend)
- **Observabilidad**: Request IDs únicos + endpoint /metrics con estadísticas

---

*Desarrollado como prueba técnica para posición de Software Engineer Full-Stack*
