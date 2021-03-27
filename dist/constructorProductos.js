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
class Productos {
    constructor() {
        this.listarProductos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let existance = yield productosModel_1.Producto.find();
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
            let existance = yield productosModel_1.Producto.find({ id: id });
            id !== 0 && existance.length !== 0
                ? res.status(200).json(existance[0])
                : res.status(404).json({ Error: `el producto con id ${id} no existe` });
        });
        this.agregarProducto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { nombre, descripcion, codigo, foto, precio, stock } = req.body;
            let existance = yield productosModel_1.Producto.find({ codigo: codigo });
            if (existance && existance.length !== 0) {
                res.status(404).json({ "Error - Producto ya existente": existance[0] });
            }
            else {
                const timestamp = new Date().toLocaleString();
                const lastItemInDb = yield productosModel_1.Producto.find().sort({ id: 1 }).limit(1);
                let id;
                if (lastItemInDb.length === 0) {
                    id = 1;
                }
                else {
                    id = lastItemInDb[0].id + 1;
                }
                const nuevoProducto = {
                    id,
                    timestamp,
                    nombre,
                    descripcion,
                    codigo,
                    foto,
                    precio,
                    stock
                };
                const productoSaveModel = new productosModel_1.Producto(nuevoProducto);
                yield productoSaveModel.save();
                res.status(200).json({ "Producto cargado exitosamente": nuevoProducto });
            }
        });
        this.modificarProducto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { id } = req.params;
            id = parseInt(id);
            let itemInStock = yield productosModel_1.Producto.find({ id: id });
            let existance = itemInStock[0];
            // console.log(existance)
            if (id !== 0 && existance && existance.length !== 0) {
                const propsToReplace = Object
                    .keys(req.body)
                    .filter((key) => existance[key] !== req.body[key]);
                // const propsToReplace = ['precio'] 
                if (propsToReplace.length) {
                    propsToReplace.forEach((prop) => __awaiter(this, void 0, void 0, function* () {
                        console.log('{id:', id, '}', ',', '{$set', '{', prop, ":", req.body[prop], '}', '}');
                        // let propi = prop.toString()
                        // const update = { $set: { prop: req.body[prop] } };
                        const update = yield productosModel_1.Producto.updateOne({ id: 2 }, { $set: { prop: req.body[prop] } });
                        // console.log(`Dato modificado: ${prop}: ${req.body[prop]}`)
                    }));
                    // const updateProduct:any = () => {
                    //     return new Promise((resolve:any, reject) => {
                    //         propsToReplace.forEach(async (prop:any) => {
                    //             knex('productos')
                    //             .where(prop,'=', existance[prop])
                    //             .update(prop, req.body[prop])
                    //             .then((value:any)=> {
                    //                 console.log(`Dato modificado: ${prop}: ${req.body[prop]}`)
                    //             })
                    //             .catch((err:Error) => console.log(err))
                    //             resolve();
                    //         })
                    //     })
                    // }
                    // await updateProduct();
                    const productoModificado = yield productosModel_1.Producto.find({ id: id });
                    return res.status(200).json({ "Modificacion exitosa": 'si' });
                }
                return res.status(200).json({ Alerta: "Ningun dato ingresado difiere de los datos actuales" });
            }
            else if (!existance) {
                return res.status(200).json({ Alerta: 'producto no encontrado' });
            }
        });
        //     eliminarProducto = async (req: Request, res: Response) => {
        //         let { id }:any = req.params;
        //         id = parseInt(id)
        //         let itemQuery = () => {
        //             return new Promise((resolve, reject:any)=> {
        //                 knex('productos')
        //                 .where({'id': id})
        //                 .then((value:any) => {
        //                     resolve(value[0]);
        //                 })
        //                 .catch((err:any)=> {
        //                     console.log(err)
        //                 })
        //             })
        //         }
        //         let existance:any = await itemQuery()
        //         if (id !== 0 && existance && existance.length !== 0){
        //             await knex.from('productos').where("id", "=", id).del()
        //             .then(() => console.log(`Producto con ${id} eliminado`))
        //             .catch((err:Error)=> {console.log(err); throw err})
        //             await knex.from('carrito').where("id", "=", id).del()
        //             .then(() => console.log(`Producto con ${id} eliminado del carrito del usuario`))
        //             .catch((err:Error)=> {console.log(err); throw err})
        //             return res.status(200).json({"Solicitud exitosa": `Producto con id ${id} eliminado`})
        //         } 
        //         return res.status(200).json({ Alerta: 'producto no encontrado' })
        //     }
        this.solicitudNoAutorizada = (req, res) => {
            res.status(403).json({
                error: -1,
                descripcion: `ruta ${req.originalUrl} método ${req.method} no autorizada`
            });
        };
    }
}
exports.Productos = Productos;
