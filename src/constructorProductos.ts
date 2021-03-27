import { Request, Response } from 'express';

import { Producto } from './productosModel';

import { Carro } from './carritoModel'

export class Productos {

    listarProductos = async (req: Request, res: Response) => {
        let existance = await Producto.find();
        if (existance && existance.length !== 0) {
            res.status(200).json({"Productos cargados": existance})
        } else {
            res.status(404).json({Error: 'No hay productos cargados'})
        }
    }

    listarProductoIndividual = async (req: Request, res: Response) => {
        let { id }:any = req.params
        id = parseInt(id)
        let existance = await Producto.find({id: id});
        id !== 0 && existance.length !== 0
        ? res.status(200).json(existance[0])
        : res.status(404).json({ Error: `el producto con id ${id} no existe` })
    }

    agregarProducto = async (req: Request, res: Response) => {
        let { nombre, descripcion, codigo, foto, precio, stock }:any = req.body;
        let existance = await Producto.find({codigo: codigo})
        if (existance && existance.length !== 0 ) {
            res.status(404).json({"Error - Producto ya existente": existance[0]})
        } else {
            const timestamp:string = new Date().toLocaleString()
            const lastItemInDb = await Producto.find().sort({id: 1}).limit(1);
            let id 
            if (lastItemInDb.length === 0){
                id = 1
            } else {
                id = lastItemInDb[0].id + 1
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
            }
            const productoSaveModel = new Producto(nuevoProducto)
            await productoSaveModel.save();
            res.status(200).json({"Producto cargado exitosamente": nuevoProducto })
        }
    }

    modificarProducto = async (req: Request, res: Response) => {        
        let { id }:any = req.params;
        id = parseInt(id)
        let itemInStock = await Producto.find({id: id})
        let existance = itemInStock[0]
        if (id !== 0 && existance && existance.length !== 0){
            const propsToReplace = Object
                .keys(req.body)
                .filter((key:any) => existance[key] !== req.body[key])
            if (propsToReplace.length) {
                let update:any = {}
                propsToReplace.forEach(async(prop:any) => update[prop] =  req.body[prop])
                const up = await Producto.updateOne({id:id},{$set:update})
                const productoModificado = await Producto.find({id:id})
                return res.status(200).json({"Modificacion exitosa": productoModificado})
            } 
            return res.status(200).json({ Alerta: "Ningun dato ingresado difiere de los datos actuales" })
        } else if (!existance) {
            return res.status(200).json({ Alerta: 'Producto no encontrado' })
        }
    }

    eliminarProducto = async (req: Request, res: Response) => {

        let { id }:any = req.params;
        id = parseInt(id)
        let itemInStock = await Producto.find({id: id})
        let existance = itemInStock[0]

        if (id !== 0 && existance && existance.length !== 0){
            const deletedItemFromProducto = await Producto.findOneAndDelete({id: id});
            // Falta eliminar el producto del carrito
            const deletedItemFromCarrito = await Carro.findOneAndDelete({id:id})
            return res.status(200).json({"Producto eliminado": deletedItemFromProducto})
        } 
        
        return res.status(200).json({ Alerta: 'producto no encontrado' })

    }

    solicitudNoAutorizada = (req: Request, res: Response) => {
        
        res.status(403).json({ 
            error : -1, 
            descripcion: `ruta ${req.originalUrl} método ${req.method} no autorizada`
        });

    }
}