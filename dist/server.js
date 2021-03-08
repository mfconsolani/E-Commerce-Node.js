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
// Set up
const app = express_1.default();
exports.admin = true;
exports.instanciaProductos = new constructorProductos_1.Productos([{
        id: 1,
        timestamp: "3/7/2021, 6:53:25 PM",
        nombre: "ipod",
        descripcion: "un ipod a todo trapo",
        codigo: "21493423sadasa",
        foto: "/url/a/una/foto/del/ipod",
        precio: 76030,
        stock: 43
    }]);
exports.instanciaCarrito = new constructorCarrito_1.Carrito([{
        id: 2,
        timestamp: "3/8/2021, 3:55:49 PM",
        nombre: "Lenovo T14",
        descripcion: "La computadora mas sarpada del momento",
        codigo: "94389n129321",
        foto: "/url/a/una/foto/de/la/lenovo",
        precio: 350000,
        stock: 150,
        cantidad: 1
    }]);
// Middleware
app.use(express_1.default.json());
app.use('/productos', productosRoutes_1.productosRoutes);
app.use('/carrito', carritoRoutes_1.carritoRoutes);
// Server
const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Server listening on port ${process.env.PORT || 8080}`);
});
server.on("Error", (error) => {
    console.log(`Se produjo un error al iniciar el servidor. Error: ${error}`);
});
