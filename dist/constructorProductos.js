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
const productosModel_1 = require("./productosModel");
const carritoModel_1 = require("./carritoModel");
const utils_1 = require("./utils");
class Productos {
    constructor() {
        this.listarProductos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let existQueryStrings = Object.keys(req.query).length;
            const existance = yield productosModel_1.Producto.find();
            if (existQueryStrings) {
                let nombre = req.query.nombre || undefined;
                let minPrice = req.query.minPrice || 0;
                let maxPrice = req.query.maxPrice || Infinity;
                if (nombre !== undefined) {
                    let findByAllQueries = yield productosModel_1.Producto.find({ $and: [
                            { precio: { $gte: minPrice } },
                            { precio: { $lte: maxPrice } },
                            { nombre: nombre }
                        ]
                    }).then((value) => {
                        value.length === 0
                            ? res.status(404).send(`Busqueda sin resultados para los siguienes filtros: 
                        nombre: ${nombre || 'sin especificar'} 
                        precio mínimo: ${minPrice}
                        precio máximo: ${maxPrice === Infinity ? 'precio máximo posible' : maxPrice}`)
                            : res.status(200).send(value);
                    });
                }
                else if (nombre === undefined) {
                    let findByPrice = yield productosModel_1.Producto.find({ $and: [
                            { precio: { $gte: minPrice } },
                            { precio: { $lte: maxPrice } },
                        ]
                    }).then((value) => {
                        value.length === 0
                            ? res.status(404).send(`Busqueda sin resultados para los siguienes filtros: 
                    nombre: ${nombre || 'sin especificar'} 
                    precio mínimo: ${minPrice}
                    precio máximo: ${maxPrice === Infinity ? 'precio máximo posible' : maxPrice}`)
                            : res.status(200).send(value);
                    });
                }
            }
            else if (!existQueryStrings && existance.length !== 0) {
                const existance = yield productosModel_1.Producto.find();
                res.status(200).json({ "Productos cargados": existance });
            }
            else {
                res.status(404).json({ Error: 'No hay productos cargados' });
            }
        });
        this.listarProductoIndividual = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { id } = req.params;
            id = parseInt(id);
            let existance = yield productosModel_1.Producto.find({ id: id });
            id !== 0 && existance.length !== 0
                ? res.status(200).json(existance[0])
                : res.status(404).json({ Error: `el producto con id ${id} no existe` });
        });
        this.mockGenerator = (req, res) => {
            let quantityOfObject = Number(req.query.cant || 10);
            let fakeArray = utils_1.fakeGenerator(quantityOfObject);
            fakeArray.length > 0
                ? res.status(200).json({ Productos: fakeArray })
                : res.status(404).json({ Error: 'No hay productos cargados' });
        };
        this.agregarProducto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { nombre, descripcion, codigo, foto, precio, stock } = req.body;
            let existance = yield productosModel_1.Producto.find({ codigo: codigo });
            if (existance && existance.length !== 0) {
                res.status(404).json({ "Error - Producto ya existente": existance[0] });
            }
            else {
                const timestamp = new Date().toLocaleString();
                const newItem = yield productosModel_1.Producto.find()
                    .sort({ id: -1 })
                    .limit(1)
                    .then((value) => {
                    let id;
                    if (value.length === 0) {
                        id = 1;
                    }
                    else {
                        id = value[0].id + 1;
                    }
                    return {
                        id,
                        timestamp,
                        nombre,
                        descripcion,
                        codigo,
                        foto,
                        precio,
                        stock
                    };
                });
                const productoSaveModel = new productosModel_1.Producto(newItem);
                yield productoSaveModel.save();
                res.status(200).json({ "Producto cargado exitosamente": newItem });
            }
        });
        this.modificarProducto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { id } = req.params;
            id = parseInt(id);
            let itemInStock = yield productosModel_1.Producto.find({ id: id });
            let existance = itemInStock[0];
            if (id !== 0 && existance && existance.length !== 0) {
                const propsToReplace = Object
                    .keys(req.body)
                    .filter((key) => existance[key] !== req.body[key]);
                if (propsToReplace.length) {
                    let update = {};
                    propsToReplace.forEach((prop) => __awaiter(this, void 0, void 0, function* () { return update[prop] = req.body[prop]; }));
                    const up = yield productosModel_1.Producto.updateOne({ id: id }, { $set: update });
                    const productoModificado = yield productosModel_1.Producto.find({ id: id });
                    return res.status(200).json({ "Modificacion exitosa": productoModificado });
                }
                return res.status(200).json({ Alerta: "Ningun dato ingresado difiere de los datos actuales" });
            }
            else if (!existance) {
                return res.status(200).json({ Alerta: 'Producto no encontrado' });
            }
        });
        this.eliminarProducto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { id } = req.params;
            id = parseInt(id);
            let itemInStock = yield productosModel_1.Producto.find({ id: id });
            let existance = itemInStock[0];
            if (id !== 0 && existance && existance.length !== 0) {
                const deletedItemFromProducto = yield productosModel_1.Producto.findOneAndDelete({ id: id });
                // Falta eliminar el producto del carrito
                const deletedItemFromCarrito = yield carritoModel_1.Carro.findOneAndDelete({ id: id });
                return res.status(200).json({ "Producto eliminado": deletedItemFromProducto });
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
