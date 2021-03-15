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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Productos = void 0;
const { options } = require('../options/mysql.js');
const knex = require('knex')(options);
class Productos {
    constructor() {
        this.listarProductos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const queryItem = () => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    try {
                        knex.from('productos').select('*')
                            .then((rows) => {
                            const string = JSON.stringify(rows);
                            const json = JSON.parse(string);
                            if (json.length === 0) {
                            }
                            else {
                                for (let row of rows) {
                                    console.log(`${row['id']} | ${row['timestamp']} | ${row['nombre']} | ${row['descripcion']} | ${row['codigo']} | ${row['foto']} | ${row['precio']} | ${row['stock']}`);
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
                ? res.status(200).json(existance[0])
                : res.status(404).json({ Error: `el producto con id ${id} no existe` });
        });
        this.agregarProducto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { nombre, descripcion, codigo, foto, precio, stock } = req.body;
            let itemEnStockFromDB = () => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    knex('productos')
                        .where({ codigo: codigo })
                        .then((value) => {
                        resolve(value);
                    })
                        .catch((err) => console.log(err));
                });
            });
            const existance = yield itemEnStockFromDB();
            if (existance.length !== 0) {
                res.status(404).json({ "Error - Producto ya existente": existance[0] });
            }
            else {
                const timestamp = new Date().toLocaleString();
                const nuevoProducto = {
                    timestamp,
                    nombre,
                    descripcion,
                    codigo,
                    foto,
                    precio,
                    stock
                };
                knex('productos').insert(nuevoProducto)
                    .then(() => console.log('Producto agregado a tabla productos', nuevoProducto))
                    .catch((err) => console.log(err));
                res.status(200).json({ "Producto cargado exitosamente": nuevoProducto });
            }
        });
        this.modificarProducto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { id } = req.params;
            id = parseInt(id);
            let itemQuery = () => {
                return new Promise((resolve, reject) => {
                    knex('productos')
                        .where({ 'id': id })
                        .then((value) => {
                        resolve(value[0]);
                    })
                        .catch((err) => {
                        console.log(err);
                    });
                });
            };
            let existance = yield itemQuery();
            if (id !== 0 && existance && existance.length !== 0) {
                const propsToReplace = Object
                    .keys(req.body)
                    .filter((key) => existance[key] !== req.body[key]);
                if (propsToReplace.length) {
                    const updateProduct = () => {
                        return new Promise((resolve, reject) => {
                            propsToReplace.forEach((prop) => __awaiter(this, void 0, void 0, function* () {
                                knex('productos')
                                    .where(prop, '=', existance[prop])
                                    .update(prop, req.body[prop])
                                    .then((value) => {
                                    console.log(`Dato modificado: ${prop}: ${req.body[prop]}`);
                                })
                                    .catch((err) => console.log(err));
                                resolve();
                            }));
                        });
                    };
                    yield updateProduct();
                    return res.status(200).json({ "Estado de la modificación": "Exitosa" });
                }
                return res.status(200).json({ Alerta: "Ningun dato ingresado difiere de los datos actuales" });
            }
            else if (!existance) {
                return res.status(200).json({ Alerta: 'producto no encontrado' });
            }
        });
        this.eliminarProducto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { id } = req.params;
            id = parseInt(id);
            let itemQuery = () => {
                return new Promise((resolve, reject) => {
                    knex('productos')
                        .where({ 'id': id })
                        .then((value) => {
                        resolve(value[0]);
                    })
                        .catch((err) => {
                        console.log(err);
                    });
                });
            };
            let existance = yield itemQuery();
            if (id !== 0 && existance && existance.length !== 0) {
                yield knex.from('productos').where("id", "=", id).del()
                    .then(() => console.log(`Producto con ${id} eliminado`))
                    .catch((err) => { console.log(err); throw err; });
                yield knex.from('carrito').where("id", "=", id).del()
                    .then(() => console.log(`Producto con ${id} eliminado del carrito del usuario`))
                    .catch((err) => { console.log(err); throw err; });
                return res.status(200).json({ "Solicitud exitosa": `Producto con id ${id} eliminado` });
            }
            return res.status(200).json({ Alerta: 'producto no encontrado' });
        });
        this.solicitudNoAutorizada = (req, res) => {
            res.status(403).json({
                error: -1,
                descripcion: `ruta ${req.originalUrl} método ${req.method} no autorizada`
            });
        };
    }
}
exports.Productos = Productos;
