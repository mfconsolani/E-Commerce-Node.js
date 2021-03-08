"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carritoRoutes = void 0;
const express_1 = __importDefault(require("express"));
const server_1 = require("./server");
exports.carritoRoutes = express_1.default.Router();
exports.carritoRoutes.get('/', (req, res) => {
    server_1.instanciaCarrito.listarProductos(req, res);
});
exports.carritoRoutes.get('/:id', (req, res) => {
    server_1.instanciaCarrito.listarProductoIndividual(req, res);
});
exports.carritoRoutes.post('/:id_producto', (req, res) => {
    server_1.instanciaCarrito.agregarProducto(req, res);
});
exports.carritoRoutes.delete('/:id', (req, res) => {
    server_1.instanciaCarrito.eliminarProducto(req, res);
});
