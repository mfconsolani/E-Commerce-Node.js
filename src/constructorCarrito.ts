import { Request, Response } from 'express';

import { Carro } from './carritoModel';

import { Producto } from './productosModel';

import casual from 'casual';

export class Carrito {
    id: any;
    timestamp: string;
    constructor(){
        this.id = casual.uuid;
        this.timestamp = new Date().toLocaleString();
    }

    listarProductos = async (req: Request, res: Response) => {
        let existance = await Carro.find({});
        if (existance && existance.length !== 0) {
            res.status(200).json({"Productos cargados": existance})
        } else {
            res.status(404).json({Error: 'No hay productos cargados'})
        }
    }


    listarProductoIndividual = async (req: Request, res: Response) => {
        let { id }:any = req.params
        id = parseInt(id)
        let existance = await Carro.find({id: id});
        id !== 0 && existance.length !== 0
        ? res.status(200).json(existance[0])
        : res.status(404).json({ Error: `El producto con id ${id} no existe` })
    }


    agregarProducto = async (req: Request, res: Response) => {

        let { id_producto }:any = req.params;

        id_producto = parseInt(id_producto);

        let itemEnCarrito = await Carro.find({'id': id_producto})
        let existeEnCarrito = itemEnCarrito[0]

        let itemEnProductos = await Producto.find({'id': id_producto})
        let existeEnProductos = itemEnProductos[0]

        if (
            id_producto !== 0 
            && existeEnCarrito !== undefined
            && existeEnCarrito.cantidad !== 0
            && existeEnProductos !== undefined
            && existeEnProductos.stock > 0
            ){ 
            const cantidadActual = await Carro.find({'id': id_producto}) 
            const nuevaCantidad = cantidadActual[0].cantidad + 1
            const up = await Carro.findOneAndUpdate(
                {'id': id_producto}, 
                {$set: {cantidad: nuevaCantidad }})
            return res.status(200).json("Producto en carrito - Se agregó una unidad más")
        
        } else if (
                id_producto !== 0 
                && existeEnCarrito === undefined 
                && existeEnProductos !== undefined 
                && existeEnProductos.stock > 0
            ){
            let productoParseado = await Producto.findOne({id: id_producto})
            .select(['-__v']).lean()
            let productoAlCarrito = { ...productoParseado, cantidad: 1}
            let saveNuevoProducto = new Carro(productoAlCarrito) 
            await saveNuevoProducto.save()
            res.status(200).json({"Producto agregado": productoAlCarrito})

        } else if (existeEnProductos === undefined || existeEnProductos.stock === 0){
            res.status(404).json({Error: "producto inexistente o sin stock"})
        }
    }

    eliminarProducto = async (req: Request, res: Response) => {

        let { id }:any = req.params;
        id = parseInt(id)
        let existeEnCarrito = await Carro.find({id: id})
        .then((res:any) => res[0])
        .catch((err:Error) => undefined)

        if (existeEnCarrito === undefined){
            return res.status(404).json({ Error: 'Producto no encontrado en carrito' })

        } else if (id !== 0 && existeEnCarrito.cantidad === 1){
            await Carro.findOneAndDelete({id:id})
            res.status(200).json({"Solicitud exitosa": `Producto con id ${id} eliminado`})
        } else if (id !== 0 && existeEnCarrito.cantidad > 1 ){
            const cantidadActual = await Carro.find({'id': id})
            const nuevaCantidad = cantidadActual[0].cantidad - 1
            const up = await Carro.findOneAndUpdate(
                {'id': id}, 
                {$set: {cantidad: nuevaCantidad }})
            return res.status(200).json(
                { "Solicitud exitosa": 'Se ha eliminado una unidad del producto en carrito'}
            )
        }

    }

}