# SlotSpot MJ API

API del sistema de administracion de parqueadero SlotSpot MJ. El frontend vive en [slotspot-mj-frontend](https://github.com/MariaJoseMontepequeZet/slotspot-mj-frontend).

**Desarrolladora:** Maria Jose Montepeque Zet  
**Tecnologias:** Python 3.12, FastAPI, PostgreSQL 16, Docker, Docker Compose

---

## Estado actual

Esta es la base del backend. Hoy expone un solo endpoint y sirve para validar el despliegue automatico. Los demas endpoints se agregan por etapas.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/salud` | Devuelve `{"estado": "ok"}`. Lo usa el healthcheck de Docker |

En el servidor, Caddy publica la API bajo `/api/*`, por lo que desde el navegador la ruta es `/api/salud`.

## Estructura

```
slotspot-mj/
├── app/
│   └── main.py                 # Aplicacion FastAPI
├── tests/
│   └── test_salud.py           # Pruebas con pytest
├── .github/workflows/
│   └── desplegar.yml           # Despliegue automatico al hacer push a main
├── Dockerfile                  # Imagen de la API
├── requirements.txt            # Dependencias de ejecucion
├── requirements-dev.txt        # Dependencias de desarrollo (pytest, ruff)
├── pyproject.toml              # Configuracion de ruff y pytest
└── .env.example                # Nombres de las variables de entorno
```

## Ejecutar en local

```bash
python -m venv .venv
.venv/Scripts/activate        # En Linux o macOS: source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

La API queda en `http://127.0.0.1:8000`. La documentacion interactiva de FastAPI esta en `/docs`.

## Calidad del codigo

| Comando | Descripcion |
|---------|-------------|
| `pytest` | Ejecuta las pruebas |
| `ruff check .` | Revisa el codigo |
| `ruff format --check .` | Verifica el formato |

## Variables de entorno

Los nombres estan en `.env.example`. Los valores reales viven en el archivo `.env` del servidor y **nunca se suben al repositorio**.

| Variable | Uso |
|----------|-----|
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | Credenciales de la base de datos |
| `JWT_SECRET` | Firma de los tokens de sesion |
| `ALLOWED_ORIGINS` | Origenes permitidos por CORS |

## Despliegue

Cada push a `main` despliega la API en el servidor propio mediante un runner self-hosted de GitHub Actions (etiqueta `slotspot`).

1. El workflow copia el codigo a `~/slotspot/slotspot-mj` con `rsync`, excluyendo `.git`, `.env` y `.venv`.
2. Ejecuta `~/slotspot/desplegar.sh api`, que reconstruye el servicio con Docker Compose y espera a que el healthcheck de `/salud` quede sano.

El servidor ejecuta tres servicios: `db` (PostgreSQL con volumen), `api` (esta aplicacion) y `web` (Caddy, que sirve el frontend y envia `/api/*` a la API).

Flujo de ramas: una rama por tarea, pull request hacia `dev` y de `dev` a `main` al cerrar cada entrega. Solo el merge a `main` despliega.

## Licencia

Proyecto academico desarrollado por Maria Jose Montepeque Zet.
