# Guía de Despliegue en Vercel

Esta guía detalla los pasos necesarios para desplegar una aplicación Node.js con Express, Sequelize y PostgreSQL en Vercel.

## Requisitos Previos

- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [GitHub](https://github.com)
- Base de datos PostgreSQL (Azure, AWS RDS, Supabase, etc.)
- Node.js instalado localmente (>=18.x)

## 1. Preparación del Proyecto

### 1.1 Estructura del proyecto

Asegúrate de que tu proyecto tenga la siguiente estructura básica:

```
proyecto/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── ...
├── app.js
├── index.js
├── package.json
├── package-lock.json
└── vercel.json
```

### 1.2 Configurar `package.json`

Asegúrate de tener las siguientes configuraciones en tu `package.json`:

```json
{
  "name": "back-end",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js",
    "build": "echo 'No build step required'"
  },
  "engines": {
    "node": ">=18.x"
  },
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "body-parser": "^2.2.0",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.16.3",
    "sequelize": "^6.37.7"
  }
}
```

**Importante**: El paquete `pg` debe estar listado en `dependencies`.

## 2. Cambios en el Código

### 2.1 Modificar `src/config/database.js`

Este es el cambio más importante para que funcione en Vercel:

```javascript
import Sequelize from 'sequelize'
import pg from 'pg'  // ⭐ IMPORTANTE: Importar pg explícitamente

// Usar variables de entorno
const hostname = process.env.DB_HOST || 'tu-servidor.postgres.database.azure.com';
const username = process.env.DB_USERNAME || 'postgres';
const password = process.env.DB_PASSWORD || 'tu-password';
const database = process.env.DB_NAME || 'tiendadb';
const port = process.env.DB_PORT || 5432;
const dialect = 'postgres'

const sequelize = new Sequelize(database, username, password, {
    host: hostname,
    port: port,
    dialect: dialect,
    dialectModule: pg  // ⭐ IMPORTANTE: Especificar el módulo del dialecto
})

export default sequelize;
```

**¿Por qué estos cambios?**
- `import pg from 'pg'`: Importa explícitamente el driver de PostgreSQL
- `dialectModule: pg`: Le dice a Sequelize que use el módulo importado en lugar de intentar cargarlo dinámicamente, lo cual no funciona bien en el entorno serverless de Vercel

### 2.2 Modificar `index.js`

Asegúrate de tener una configuración específica para Vercel:

```javascript
import app from './app.js'
import sequelize from './src/config/database.js'

// Validar conexión a la base de datos
let dbConnected = false;

async function ensureDatabaseConnection() {
    if (!dbConnected) {
        try {
            await sequelize.authenticate();
            console.log('Conexión a la base de datos establecida correctamente');
            dbConnected = true;
        } catch (error) {
            console.error('Error conectando a la base de datos:', error);
            throw error;
        }
    }
}

// Para desarrollo local
async function main() {
    try {
        const init = process.argv[2];

        if (init)
            await sequelize.sync({ force: true});
        else
            await sequelize.sync({ force: false});

        console.log('Base de datos Sincronizada!')

        const port = process.env.PORT || 3005;

        app.listen(port, () => {
            console.log('Server is running on port: ' + port)
        })

    } catch (error) {
        console.log(error)
    }
}

// Detectar si estamos en Vercel o desarrollo local
if (process.env.VERCEL) {
    // En Vercel, solo validar conexión (no sincronizar esquema)
    app.use(async (req, res, next) => {
        await ensureDatabaseConnection();
        next();
    });
} else {
    // En local, ejecutar el servidor normalmente
    main();
}

// Exportar para Vercel
export default app;
```

### 2.3 Configurar `app.js`

Tu archivo `app.js` debe exportar la aplicación Express:

```javascript
import express from 'express';
import productoRouter from './src/routes/producto.js'
import usuarioRouter from './src/routes/usuario.js'
import tiendaRouter from './src/routes/tienda.js'
import bodyParser from 'body-parser';
import cors from 'cors'

const app = express();
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, resp) => {
    return resp.json({ mensaje: "Hola mundo", code: 200});
})

app.use('/producto', productoRouter);
app.use('/tienda', tiendaRouter);
app.use('/auth', usuarioRouter);

export default app
```

## 3. Configurar Vercel

### 3.1 Crear archivo `vercel.json`

Crea un archivo `vercel.json` en la raíz del proyecto:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

### 3.2 Crear archivo `.gitignore`

Es importante no subir archivos innecesarios al repositorio:

```
node_modules/
.env
.DS_Store
*.log
.vercel
```

## 4. Configurar Variables de Entorno en Vercel

### 4.1 Desde el Dashboard de Vercel

1. Ve a tu proyecto en Vercel
2. Navega a **Settings** → **Environment Variables**
3. Agrega las siguientes variables:

```
DB_HOST=tu-servidor.postgres.database.azure.com
DB_USERNAME=postgres
DB_PASSWORD=tu-password-seguro
DB_NAME=tiendadb
DB_PORT=5432
```

### 4.2 Para todas las variables, selecciona:
- ✅ Production
- ✅ Preview
- ✅ Development

## 5. Despliegue

### 5.1 Desde GitHub

1. **Sube tu código a GitHub**:
   ```bash
   git add .
   git commit -m "Preparar para despliegue en Vercel"
   git push origin main
   ```

2. **Conecta con Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en **"Add New Project"**
   - Selecciona tu repositorio de GitHub
   - Haz clic en **"Import"**

3. **Configurar el proyecto**:
   - Framework Preset: **Other**
   - Root Directory: `./` (dejar vacío si está en la raíz)
   - Build Command: `npm install` (o dejar por defecto)
   - Output Directory: dejar por defecto
   - Install Command: `npm install`

4. **Agregar variables de entorno** (si no lo hiciste en el paso 4)

5. **Deploy**: Haz clic en **"Deploy"**

### 5.2 Desde la CLI de Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

## 6. Verificar el Despliegue

### 6.1 Revisar los logs

En el dashboard de Vercel:
1. Ve a tu proyecto
2. Haz clic en la última deployment
3. Ve a la pestaña **"Functions"** → Selecciona tu función → **"View Logs"**

### 6.2 Probar los endpoints

```bash
# Probar endpoint principal
curl https://tu-proyecto.vercel.app/

# Probar otros endpoints
curl https://tu-proyecto.vercel.app/producto
curl https://tu-proyecto.vercel.app/tienda
```

## 7. Solución de Problemas Comunes

### Error: "Please install pg package manually"

**Solución**: Asegúrate de:
1. Tener `pg` en `dependencies` del `package.json`
2. Importar `pg` explícitamente en `database.js`
3. Usar `dialectModule: pg` en la configuración de Sequelize

### Error: "Cannot find module"

**Solución**:
- Verifica que todos los imports usen rutas relativas correctas
- Asegúrate de usar extensiones `.js` en los imports
- Ejemplo: `import app from './app.js'` ✅

### Error de conexión a la base de datos

**Solución**:
1. Verifica las variables de entorno en Vercel
2. Asegúrate de que tu base de datos permite conexiones desde IPs externas
3. Verifica que las credenciales sean correctas

### Timeout en funciones serverless

**Solución**: Las funciones serverless de Vercel tienen un límite de tiempo. Considera:
- Optimizar queries de base de datos
- Usar índices en tu base de datos
- Implementar caché cuando sea posible

## 8. Redespliegue Automático

Cada vez que hagas push a la rama `main` en GitHub, Vercel automáticamente:
1. Detectará los cambios
2. Instalará las dependencias
3. Desplegará la nueva versión

```bash
git add .
git commit -m "Actualización de la aplicación"
git push origin main
```

## 9. Comandos Útiles

```bash
# Ver información del proyecto
vercel

# Ver logs en tiempo real
vercel logs

# Listar despliegues
vercel ls

# Ejecutar localmente con entorno de Vercel
vercel dev

# Eliminar un deployment
vercel rm <deployment-url>
```

## 10. Buenas Prácticas

1. **Nunca commits credenciales**: Usa siempre variables de entorno
2. **Mantén actualizado `package-lock.json`**: Súbelo al repositorio
3. **Usa .gitignore**: Excluye `node_modules/` y archivos sensibles
4. **Prueba localmente**: Usa `vercel dev` antes de desplegar
5. **Monitorea los logs**: Revisa regularmente los logs de producción
6. **Configura dominios personalizados**: En Settings → Domains

## Recursos Adicionales

- [Documentación oficial de Vercel](https://vercel.com/docs)
- [Documentación de Sequelize](https://sequelize.org/docs/v6/)
- [Documentación del driver pg](https://node-postgres.com/)
- [Express.js](https://expressjs.com/)

---

**Fecha de creación**: Noviembre 2025
**Versión**: 1.0
