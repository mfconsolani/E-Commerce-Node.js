"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carrito = void 0;
const carritoModel_1 = require("./carritoModel");
const productosModel_1 = require("./productosModel");
const casual_1 = __importDefault(require("casual"));
class Carrito {
    constructor() {
        this.listarProductos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let existance = yield carritoModel_1.Carro.find({});
            if (existance && existance.length !== 0) {
                res.status(200).json({ "Productos cargados": existance });
            }
            else {
                res.status(404).json({ Error: 'No hay productos cargados' });
            }
        });
        this.listarProductoIndividual = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { id } = req.params;
            id = parseInt(id);
            let existance = yield carritoModel_1.Carro.find({ id: id });
            id !== 0 && existance.length !== 0
                ? res.status(200).json(existance[0])
                : res.status(404).json({ Error: `El producto con id ${id} no existe` });
        });
        this.agregarProducto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { id_producto } = req.params;
            id_producto = parseInt(id_producto);
            let itemEnCarrito = yield carritoModel_1.Carro.find({ 'id': id_producto });
            let existeEnCarrito = itemEnCarrito[0];
            let itemEnProductos = yield productosModel_1.Producto.find({ 'id': id_producto });
            let existeEnProductos = itemEnProductos[0];
            if (id_producto !== 0
                && existeEnCarrito !== undefined
                && existeEnCarrito.cantidad !== 0
                && existeEnProductos !== undefined
                && existeEnProductos.stock > 0) {
                const cantidadActual = yield carritoModel_1.Carro.find({ 'id': id_producto });
                const nuevaCantidad = cantidadActual[0].cantidad + 1;
                const up = yield carritoModel_1.Carro.findOneAndUpdate({ 'id': id_producto }, { $set: { cantidad: nuevaCantidad } });
                return res.status(200).json("Producto en carrito - Se agregó una unidad más");
            }
            else if (id_producto !== 0
                && existeEnCarrito === undefined
                && existeEnProductos !== undefined
                && existeEnProductos.stock > 0) {
                let productoParseado = yield productosModel_1.Producto.findOne({ id: id_producto })
                    .select(['-__v']).lean();
                let productoAlCarrito = Object.assign(Object.assign({}, productoParseado), { cantidad: 1 });
                let saveNuevoProducto = new carritoModel_1.Carro(productoAlCarrito);
                yield saveNuevoProducto.save();
                res.status(200).json({ "Producto agregado": productoAlCarrito });
            }
            else if (existeEnProductos === undefined || existeEnProductos.stock === 0) {
                res.status(404).json({ Error: "producto inexistente o sin stock" });
            }
        });
        this.eliminarProducto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { id } = req.params;
            id = parseInt(id);
            let existeEnCarrito = yield carritoModel_1.Carro.find({ id: id })
                .then((res) => res[0])
                .catch((err) => undefined);
            if (existeEnCarrito === undefined) {
                return res.status(404).json({ Error: 'Producto no encontrado en carrito' });
            }
            else if (id !== 0 && existeEnCarrito.cantidad === 1) {
                yield carritoModel_1.Carro.findOneAndDelete({ id: id });
                res.status(200).json({ "Solicitud exitosa": `Producto con id ${id} eliminado` });
            }
            else if (id !== 0 && existeEnCarrito.cantidad > 1) {
                const cantidadActual = yield carritoModel_1.Carro.find({ 'id': id });
                const nuevaCantidad = cantidadActual[0].cantidad - 1;
                const up = yield carritoModel_1.Carro.findOneAndUpdate({ 'id': id }, { $set: { cantidad: nuevaCantidad } });
                return res.status(200).json({ "Solicitud exitosa": 'Se ha eliminado una unidad del producto en carrito' });
            }
        });
        this.id = casual_1.default.uuid;
        this.timestamp = new Date().toLocaleString();
    }
}
exports.Carrito = Carrito;
