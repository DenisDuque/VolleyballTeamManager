import express, { Application } from 'express';
import router from './api/router';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

dotenv.config();

const cors = require('cors');

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/volleyballteammanager';

try {
    mongoose.connect(MONGODB_URI);
  console.log('Conexión exitosa a MongoDB');
} catch (error) {
  console.error('Error al conectar con la base de datos MongoDB:', error);
}

app.use(cors());
app.use(bodyParser.json());
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Servidor Express en el puerto ${PORT}`);
});

app.use(cors({
  origin: function (origin: string, callback: (error: Error | null, allow: boolean) => void) {
    if (origin === 'http://localhost:3001' || origin === process.env.CLIENT) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  }
}));