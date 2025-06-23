# 📦 Gestión de Cursos - Node.js

Este proyecto es una aplicación web construida con Node.js para la gestión de cursos. Incluye integración con base de datos y está preparada para ser desplegada en contenedores Docker.

## 🚀 Despliegue con Docker Compose

A continuación se detallan los pasos para levantar el entorno completo usando Docker.

---

### ✅ Requisitos previos

- Tener instalado Docker y Docker Compose.
- Clonar este repositorio:

```bash
git clone https://github.com/Yessica-chavez/gestion-cursos-node.git
cd gestion-cursos-node
```

---

### 🛠️ Estructura del Proyecto

- `Dockerfile`: Define la imagen de la aplicación.
- `docker-compose.yml`: Define los servicios (app y base de datos si aplica).
- `package.json`: Dependencias del proyecto.
- `index.js`: Punto de entrada de la app.
- `.env`: Variables de entorno.

---

### ⚙️ Levantar la aplicación

Ejecuta el siguiente comando:

```bash
sudo docker compose up -d
```

Esto levantará todos los servicios en segundo plano.

---

### 📂 Verificar contenedores

Puedes verificar que los contenedores estén corriendo con:

```bash
sudo docker ps
```

---

### 🌐 Acceso a la aplicación

La aplicación quedará disponible en:

```
http://localhost:3000
```

(Según el puerto mapeado en `docker-compose.yml`)

---

### 🧪 Probar el servicio

Puedes realizar peticiones HTTP con Postman o curl a las rutas disponibles, como por ejemplo:

```
GET http://localhost:3000/cursos
```

---

### 📤 Apagar el entorno

Para detener los contenedores:

```bash
sudo docker compose down
```

---

### 🧑‍💻 Autor

Desarrollado por Yessica Chávez - Laboratorio Kali