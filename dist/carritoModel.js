"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carro = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const carritoSchema = new Schema({
    id: { type: Number, required: true },
    timestamp: { type: String, required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    codigo: { type: String, required: true },
    foto: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    cantidad: { type: Number, required: true }
}, { collection: 'carrito' });
exports.Carro = mongoose_1.default.model('Carro', carritoSchema);
