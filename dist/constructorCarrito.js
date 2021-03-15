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
const casual_1 = __importDefault(require("casual"));
const { options } = require('../options/mysql.js');
const knex = require('knex')(options);
class Carrito {
    constructor() {
        this.listarProductos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const queryItem = () => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    try {
                        knex.from('carrito').select('*')
                            .then((rows) => {
                            const string = JSON.stringify(rows);
                            const json = JSON.parse(string);
                            if (json.length === 0) {
                            }
                            else {
                                for (let row of rows) {
                                    console.log(`${row['id']} | ${row['timestamp']} | ${row['nombre']} | ${row['descripcion']} | ${row['codigo']} | ${row['foto']} | ${row['precio']} | ${row['stock']} | ${row['cantidad']}`);
                                }
                            }
                            resolve(json);
                        })
                            .then((res) => res)
                            .catch((err) => {
                            console.log(err);
                        });
                    }
                    catch (err) {
                        reject(err);
                    }
                });
            });
            let existance = yield queryItem();
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
            let itemQuery = () => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    knex('productos')
                        .where({ id: id })
                        .then((value) => {
                        resolve(value);
                    })
                        .catch((err) => console.log(err));
                });
            });
            const existance = yield itemQuery();
            id !== 0 && existance.length !== 0
                ? res.status(200).json({ "Producto encontrado": existance[0] })
                : res.status(404).json({ Error: `el producto con id ${id} no existe` });
        });
        this.agregarProducto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { id_producto } = req.params;
            id_producto = parseInt(id_producto);
            let itemEnCarrito = () => {
                return new Promise((resolve, reject) => {
                    knex.from('carrito')
                        .where({ 'id': id_producto })
                        .then((value) => {
                        resolve(value);
                    })
                        .catch((err) => console.log(err));
                });
            };
            const existeEnCarrito = yield itemEnCarrito();
            let itemEnProductos = () => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    try {
                        knex('productos')
                            .where({ 'id': id_producto })
                            .then((value) => {
                            resolve(value[0]);
                        })
                            .catch((err) => { reject(err); console.log(err); });
                    }
                    catch (err) {
                        console.log(err);
                    }
                });
            });
            let existeEnProductos = yield itemEnProductos();
            if (id_producto !== 0
                && existeEnCarrito.length !== 0
                && existeEnCarrito.cantidad !== 0
                && existeEnProductos !== undefined
                && existeEnProductos.stock > 0) {
                yield knex('carrito').where('id', '=', id_producto).increment('cantidad', 1)
                    .then(() => console.log('Nueva unidad agregada'))
                    .catch((err) => console.log(err));
                return res.status(200).json("Producto en carrito - Se agregó una unidad más");
            }
            else if (id_producto !== 0
                && existeEnCarrito.length === 0
                && existeEnProductos !== undefined
                && existeEnProductos.stock > 0) {
                let nuevoProducto = existeEnProductos;
                nuevoProducto.cantidad = 1;
                knex('carrito').insert(nuevoProducto)
                    .then(() => console.log('Producto agregado a tabla productos', nuevoProducto))
                    .catch((err) => console.log(err));
                res.status(200).json({ "Producto agregado": nuevoProducto });
            }
            else if (existeEnProductos === undefined || existeEnProductos.stock === 0) {
                res.status(404).json({ Error: "producto inexistente o sin stock" });
            }
        });
        this.eliminarProducto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { id } = req.params;
            id = parseInt(id);
            let itemTarget = () => {
                return new Promise((resolve, reject) => {
                    knex.from('carrito')
                        .where({ 'id': id })
                        .then((value) => resolve(value[0]))
                        .catch((err) => console.log(err));
                });
            };
            const existeEnCarrito = yield itemTarget();
            if (existeEnCarrito === undefined) {
                return res.status(404).json({ Error: 'Producto no encontrado en carrito' });
            }
            else if (id !== 0 && existeEnCarrito.cantidad === 1) {
                yield knex.from('carrito').where("id", "=", id).del()
                    .then(() => console.log(`Producto con ${id} eliminado`))
                    .catch((err) => { console.log(err); throw err; });
                res.status(200).json({ "Solicitud exitosa": `Producto con id ${id} eliminado` });
            }
            else if (id !== 0 && existeEnCarrito.cantidad > 1) {
                yield knex('carrito').where('id', '=', id).decrement('cantidad', 1)
                    .then(() => console.log('Se ha eliminado una unidad del producto en carrito'))
                    .catch((err) => console.log(err));
                return res.status(200).json({ "Solicitud exitosa": 'Se ha eliminado una unidad del producto en carrito' });
            }
        });
        this.id = casual_1.default.uuid;
        this.timestamp = new Date().toLocaleString();
    }
}
exports.Carrito = Carrito;
