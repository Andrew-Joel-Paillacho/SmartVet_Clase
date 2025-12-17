// Requerir módulos
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import cloudinary from 'cloudinary'
import fileUpload from "express-fileupload"

import routerVeterinarios from '../src/routers/veterinario_routes.js'
import routerPacientes from './routers/paciente_routers.js';


// Inicializaciones
const app = express();
dotenv.config();

// Configuraciones 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
 
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}))

// Variables globales
app.set('port', process.env.PORT || 3000);

// Rutas
app.get('/', (req, res) => res.send("Server on"));

// Rutas para veterinarios
app.use('/api', routerVeterinarios);

// Rutas para pacientes
app.use('/api', routerPacientes);

// Manejo de una ruta que no sea encontrada (404)
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

// Exportar la instancia de express
export default app;
