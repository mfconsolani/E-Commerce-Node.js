"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productosRoutes = void 0;
const express_1 = __importDefault(require("express"));
const server_1 = require("./server");
const server_2 = require("./server");
exports.productosRoutes = express_1.default.Router();
exports.productosRoutes.get('/', (req, res) => {
    server_1.instanciaProductos.listarProductos(req, res);
});
exports.productosRoutes.get('/:id', (req, res) => {
    let { id } = req.params;
    id = String(id);
    if (id === 'vista-test') {
        server_1.instanciaProductos.mockGenerator(req, res);
    }
    else {
        server_1.instanciaProductos.listarProductoIndividual(req, res);
    }
});
exports.productosRoutes.post('/', (req, res) => {
    server_2.admin
        ? server_1.instanciaProductos.agregarProducto(req, res)
        : server_1.instanciaProductos.solicitudNoAutorizada(req, res);
});
exports.productosRoutes.put('/:id', (req, res) => {
    server_2.admin
        ? server_1.instanciaProductos.modificarProducto(req, res)
        : server_1.instanciaProductos.solicitudNoAutorizada(req, res);
});
exports.productosRoutes.delete('/:id', (req, res) => {
    server_2.admin
        ? server_1.instanciaProductos.eliminarProducto(req, res)
        : server_1.instanciaProductos.solicitudNoAutorizada(req, res);
});
