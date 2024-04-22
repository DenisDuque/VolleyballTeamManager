import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/volleyballteammanager';

export async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI, {
            // @ts-ignore
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conexión exitosa a la base de datos MongoDB');
    } catch (error) {
        console.error('Error al conectar con la base de datos MongoDB:', error);
    }
}
