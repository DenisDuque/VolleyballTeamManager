import express, { Application } from 'express';
import router from './api/router';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);
const MONGODB_URI = 'mongodb://localhost:27017/volleyballteammanager';

try {
    mongoose.connect(MONGODB_URI);
  console.log('Conexión exitosa a MongoDB');
} catch (error) {
  console.error('Error al conectar con la base de datos MongoDB:', error);
}

app.use(bodyParser.json());
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});