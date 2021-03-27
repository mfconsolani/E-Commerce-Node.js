import mongoose from 'mongoose';

const { Schema } = mongoose;

const productoSchema = new Schema({
    id: { type: Number, required: true },
    timestamp: { type: String, required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    codigo: { type: String, required: true },
    foto: { type: String, required: true },
    precio: { type: Number, required: true }, 
    stock: { type: Number, required: true }
})

export const Producto = mongoose.model('Producto', productoSchema);