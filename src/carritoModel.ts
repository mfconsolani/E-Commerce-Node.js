import mongoose from 'mongoose';

const { Schema } = mongoose;

const carritoSchema = new Schema({
    id: { type: Number, required: true },
    timestamp: { type: String, required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    codigo: { type: String, required: true },
    foto: { type: String, required: true },
    precio: { type: Number, required: true }, 
    stock: { type: Number, required: true },
    cantidad: { type: Number , required: true}
}, {collection: 'carrito'})

export const Carro = mongoose.model('Carro', carritoSchema);