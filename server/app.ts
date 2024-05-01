import express, { Application, Request, Response, NextFunction } from 'express';
import router from './api/router';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();  

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/volleyballteammanager';

try {
    mongoose.connect(MONGODB_URI);
    console.log('Conexión exitosa a MongoDB');
} catch (error) {
    console.error('Error al conectar con la base de datos MongoDB:', error);
}

const customOrigin = (origin: string | undefined, callback: (error: Error | null, allow: boolean) => void) => {
  if (!origin || origin === 'http://localhost:3001' || origin === process.env.CLIENT) {
      callback(null, true);
  } else {
      callback(new Error('Not allowed by CORS, port origin: ' + origin), false);
  }
};


app.use(cors({
  origin: customOrigin // Usa la función CustomOrigin
}));

app.use(bodyParser.json());
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Servidor Express en el puerto ${PORT}`);
});
