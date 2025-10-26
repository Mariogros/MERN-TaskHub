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

**Dependencias recomendadas:** Node.js 18+, MongoDB 7.0+, Python 3.10+

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

**Trade-offs (resumen):**
- React + Vite/CRA simple en vez de Next.js (menos setup para este scope)
- Estado local (useState) en vez de Redux (evitar complejidad)
- urllib (stdlib) en vez de requests (cero dependencias extra)
- docker-compose en vez de Kubernetes (proporcional al tamaño)

**Estructura (resumen):**
```
backend/    # API Express + Mongoose
frontend/   # React (components, tests)
python-script/
	analyze_tasks.py
docker-compose.yml
```

## Limitaciones conocidas

- Sin autenticación/autorización
- Sin paginación en listados
- CRUD parcial (falta UPDATE)

Con más tiempo:
- Agregaría UPDATE + validación con Joi/Zod
- React Query para caché/estado de servidor
- CI/CD en GitHub Actions

## Bonus implementados

-Docker (MongoDB, API, Frontend con Nginx)
	```bash
	docker-compose up -d
	docker ps
	```
-Testing (backend y frontend)
	```bash
	cd backend && npm test
	cd ../frontend && npm test
	```
-Observabilidad (/metrics + request IDs)
	```bash
	curl http://localhost:5000/metrics
	# Ver IDs únicos en logs de la API
	```

---

*Desarrollado como prueba técnica para posición de Software Engineer Full-Stack*
