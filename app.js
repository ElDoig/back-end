// app.js (VERSIÓN CORREGIDA)

import express from "express";
import productoRouter from "./src/routes/producto.js";
import usuarioRouter from "./src/routes/usuario.js";
import tiendaRouter from "./src/routes/tienda.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true 
  })
);

app.use(bodyParser.json()); 


app.get("/", (req, resp) => {
  return resp.json({ mensaje: "Hola mundo", code: 200 });
});

app.use("/producto", productoRouter);
app.use("/tienda", tiendaRouter);
app.use("/auth", usuarioRouter);

export default app;