"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carrito = void 0;
const server_1 = require("./server");
const casual_1 = __importDefault(require("casual"));
class Carrito {
    constructor(productosEnCarrito) {
        this.listarProductos = (req, res) => {
            this.productosEnCarrito.length
                ? res.status(200).json(this.productosEnCarrito)
                : res.status(404).json({ Error: 'No hay productos cargados' });
        };
        this.listarProductoIndividual = (req, res) => {
            let { id } = req.params;
            id = parseInt(id);
            const productoBuscado = this.productosEnCarrito.filter(producto => producto.id === id)[0];
            if (id !== 0 && this.productosEnCarrito.length && productoBuscado) {
                return res.status(200).json({ "Producto encontrado": productoBuscado });
            }
            return res.status(200).json({ Alerta: "El producto buscado no está en el carrito" });
        };
        this.agregarProducto = (req, res) => {
            let { id_producto } = req.params;
            id_producto = parseInt(id_producto);
            // Chequea si ya esta en el carrito
            const itemEnCarrito = this.productosEnCarrito.filter(item => item.id === id_producto)[0];
            // Chequea si esta en la base de datos y si hay stock
            let itemSeleccionado = server_1.instanciaProductos.database
                .filter(producto => producto.stock !== 0 && producto.id === id_producto)[0];
            if (itemEnCarrito && itemEnCarrito.cantidad) {
                itemEnCarrito.cantidad += 1;
                return res.status(200).json({ "Producto en carrito - Se agregó una unidad más": itemEnCarrito });
            }
            else if (id_producto !== 0 && server_1.instanciaProductos.database.length && itemSeleccionado) {
                this.productosEnCarrito.push(itemSeleccionado);
                itemSeleccionado.cantidad = 1;
                res.status(200).json({ "Producto agregado": itemSeleccionado });
            }
            else {
                res.status(404).json({ Error: "producto inexistente o sin stock" });
            }
        };
        this.eliminarProducto = (req, res) => {
            let { id } = req.params;
            id = parseInt(id);
            let itemTarget = this.productosEnCarrito.filter(item => (item.id === id))[0];
            if (!itemTarget) {
                return res.status(404).json({ Error: 'Producto no encontrado en carrito' });
            }
            else if (id !== 0 && this.productosEnCarrito.length && itemTarget.cantidad === 1) {
                this.productosEnCarrito = this.productosEnCarrito.filter(item => item.id !== itemTarget.id);
                res.status(200).json({ "Solicitud exitosa": `Producto con id ${id} eliminado` });
            }
            else if (itemTarget.cantidad !== undefined && itemTarget.cantidad > 1) {
                itemTarget.cantidad -= 1;
                return res.status(200).json({ "Solicitud exitosa": 'Se ha eliminado una unidad del producto en carrito' });
            }
        };
        this.id = casual_1.default.uuid;
        this.timestamp = new Date().toLocaleString();
        this.productosEnCarrito = productosEnCarrito;
    }
}
exports.Carrito = Carrito;
