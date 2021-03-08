"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Productos = void 0;
class Productos {
    constructor(database) {
        this.listarProductos = (req, res) => {
            this.database.length
                ? res.status(200).json(this.database)
                : res.status(404).json({ Error: 'No hay productos cargados' });
        };
        this.listarProductoIndividual = (req, res) => {
            let { id } = req.params;
            id = parseInt(id);
            const productoRequerido = this.database.filter(producto => producto.id === id)[0];
            id !== 0 && this.database.length && productoRequerido
                ? res.status(200).json(productoRequerido)
                : res.status(404).json({ Error: `el producto con id ${id} no existe` });
        };
        this.agregarProducto = (req, res) => {
            let { nombre, descripcion, codigo, foto, precio, stock } = req.body;
            let itemEnStock = this.database.filter(producto => (producto.codigo === codigo))[0];
            if (this.database.length && itemEnStock) {
                res.status(404).json({ "Error - Producto ya existente": itemEnStock });
            }
            else {
                const id = this.database.length == 0 ? 1 : this.database.slice(-1)[0].id + 1;
                const timestamp = new Date().toLocaleString();
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
                this.database.push(nuevoProducto);
                res.status(200).json({ "Producto cargado exitosamente": nuevoProducto });
            }
        };
        this.modificarProducto = (req, res) => {
            let { id } = req.params;
            id = parseInt(id);
            let itemTarget = this.database.filter(item => (item.id === id))[0];
            if (id !== 0 && this.database.length && itemTarget) {
                const propsToReplace = Object
                    .keys(req.body)
                    .filter((key) => itemTarget[key] !== req.body[key]);
                if (propsToReplace.length) {
                    propsToReplace.forEach((prop) => itemTarget[prop] = req.body[prop]);
                    return res.status(200).json({ "Modificación exitosa": itemTarget });
                }
                return res.status(200).json({ Alerta: "Ningun dato ingresado difiere de los datos actuales" });
            }
            return res.status(200).json({ Alerta: 'producto no encontrado' });
        };
        this.eliminarProducto = (req, res) => {
            let { id } = req.params;
            id = parseInt(id);
            let itemTarget = this.database.filter(item => (item.id === id))[0];
            if (id !== 0 && this.database.length && itemTarget) {
                this.database = this.database.filter(item => item.id !== itemTarget.id);
                return res.status(200).json({ "Solicitud exitosa": `Producto con id ${id} eliminado` });
            }
            return res.status(200).json({ Alerta: 'producto no encontrado' });
        };
        this.solicitudNoAutorizada = (req, res) => {
            res.status(403).json({
                error: -1,
                descripcion: `ruta ${req.originalUrl} método ${req.method} no autorizada`
            });
        };
        this.database = database;
    }
}
exports.Productos = Productos;
