// index.js (VERSIÓN CORREGIDA Y SIMPLIFICADA PARA LOCAL)

import app from "./app.js";
import sequelize from "./src/config/database.js";

let dbConnected = false;

// ... (ensureDatabaseConnection function se mantiene) ...
async function ensureDatabaseConnection() {
  if (!dbConnected) {
    try {
      await sequelize.authenticate();
      console.log("Conexión a la base de datos establecida correctamente");
      dbConnected = true;
    } catch (error) {
      console.error("Error conectando a la base de datos:", error);
      throw error;
    }
  }
}

async function main() {
  try {
    const init = process.argv[2];

    // Sincronización de BD
    if (init) await sequelize.sync({ force: true });
    else await sequelize.sync({ force: false });

    console.log("Base de datos Sincronizada!");

    const port = process.env.PORT || 3005;

    app.listen(port, "0.0.0.0", () => {
      console.log("Server is running on port: " + port);
    });
  } catch (error) {
    console.log(error);
  }
}

// Detectar si estamos en Vercel o desarrollo local
if (process.env.VERCEL) {
  // Código de Vercel (se mantiene)
  app.use(async (req, res, next) => {
    await ensureDatabaseConnection();
    next();
  });
} else {
  // En local, ejecutar el servidor
  main();
}

// Exportar para Vercel
export default app;
