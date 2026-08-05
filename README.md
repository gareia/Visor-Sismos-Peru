
## Visor de Sismos - Perú (Versión 1)

🔗 **Backend desplegado en:** https://visor-sismos-peru.onrender.com/

Aplicación web para la visualización de eventos sísmicos en Perú utilizando datos abiertos, con un backend desarrollado en **FastAPI**, un frontend con **React + Typescript** y una base de datos espacial **PostgreSQL + PostGIS**

🔗 **Base de datos desplegada en:** Supabase
🔗 **Backend desplegado en Render:** https://visor-sismos-peru.onrender.com/
🔗 **Frontend desplegado en Netlify:** (https://peppy-clafoutis-e3704c.netlify.app/)

La REST API está versionada bajo `/api/v1` y documentada automáticamente mediante **OpenAPI/Swagger** en `/docs` y `/openapi.json`

![Visor](docs/visor_080526.png)

Los pasos para replicarlo:

1. Clonar el repositorio
2. Crear entorno virtual con Python 3.12.13
3. Instalar dependencias: pip install -r requirements.txt
4. Crear archivo .env basado en .env.example
5. Configurar variables de entorno
6. Ejecutar las migraciones de Alembic: cd backend | alembic upgrade head
7. Ejecutar el script de carga de sismos: python -m scripts.load_earthquakes
8. Ejecutar el backend: cd backend Desarrollo: uvicorn app.main:app --reload 
9. Ejecutar el frontend: cd frontend Desarrollo: npm run dev


## 📚 Fuentes y créditos

- Datos sísmicos: Instituto Geofísico del Perú (IGP)  
  https://www.datosabiertos.gob.pe/

- Límites departamentales: shapefile obtenido de IGN
  https://www.datosabiertos.gob.pe/dataset/limites-departamentales

- Base cartográfica: OpenStreetMap  
  © OpenStreetMap contributors