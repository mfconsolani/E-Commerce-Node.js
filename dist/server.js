"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanciaCarrito = exports.instanciaProductos = exports.admin = void 0;
const express_1 = __importDefault(require("express"));
const productosRoutes_1 = require("./productosRoutes");
const carritoRoutes_1 = require("./carritoRoutes");
const constructorProductos_1 = require("./constructorProductos");
const constructorCarrito_1 = require("./constructorCarrito");
const createTable_1 = require("./createTable");
// Set up
const app = express_1.default();
exports.admin = true;
exports.instanciaProductos = new constructorProductos_1.Productos();
exports.instanciaCarrito = new constructorCarrito_1.Carrito();
// Middleware
app.use(express_1.default.json());
app.use('/productos', productosRoutes_1.productosRoutes);
app.use('/carrito', carritoRoutes_1.carritoRoutes);
// Server
const server = app.listen(process.env.PORT || 8080, () => {
    createTable_1.checkIfTable(createTable_1.createTableProductos, 'productos');
    createTable_1.checkIfTable(createTable_1.createTableCarrito, 'carrito');
    console.log(`Server listening on port ${process.env.PORT || 8080}`);
});
server.on("Error", (error) => {
    console.log(`Se produjo un error al iniciar el servidor. Error: ${error}`);
});
