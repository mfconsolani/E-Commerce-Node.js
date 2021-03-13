import { Request, Response } from 'express';

import { Item } from './interfaces';

import { instanciaProductos } from './server';

import casual from 'casual';

import fs from 'fs';

import path from 'path';

export class Carrito {

    id: any;
    
    timestamp: string;
    
    productosEnCarrito: Array<Item>;

    constructor(productosEnCarrito: Array<Item>){
        
        this.id = casual.uuid;

        this.timestamp = new Date().toLocaleString();
        
        this.productosEnCarrito = productosEnCarrito; 
    }

    listarProductos = (req: Request, res: Response) => {

        this.productosEnCarrito.length
        ? res.status(200).json(this.productosEnCarrito)
        : res.status(404).json({ Error: 'No hay productos cargados' })

    }

    listarProductoIndividual = (req: Request, res: Response) => {
    
        let { id }:any = req.params;

        id = parseInt(id);

        const productoBuscado = this.productosEnCarrito.filter(producto => producto.id === id)[0];

        if (id !== 0 && this.productosEnCarrito.length && productoBuscado){
            
            return res.status(200).json({"Producto encontrado": productoBuscado});

        }

        return res.status(200).json({ Alerta: "El producto buscado no está en el carrito" });

    }

    agregarProducto = (req: Request, res: Response) => {

        let { id_producto }:any = req.params;

        id_producto = parseInt(id_producto);

        // Chequea si ya esta en el carrito
        const itemEnCarrito: Item = this.productosEnCarrito.filter(item => item.id === id_producto)[0];
        
        // Chequea si esta en la base de datos y si hay stock
        let itemSeleccionado: Item = instanciaProductos.database
            .filter(producto => producto.stock !== 0 && producto.id === id_producto)[0]

        if (itemEnCarrito && itemEnCarrito.cantidad) {

            itemEnCarrito.cantidad += 1

            fs.writeFileSync(path.join(__dirname, '../carrito.txt'), JSON.stringify(this.productosEnCarrito));

            return res.status(200).json({"Producto en carrito - Se agregó una unidad más": itemEnCarrito})
            
        } else if (id_producto !== 0 && instanciaProductos.database.length && itemSeleccionado) {

                this.productosEnCarrito.push(itemSeleccionado);
    
                itemSeleccionado.cantidad = 1

                fs.writeFileSync(path.join(__dirname, '../carrito.txt'), JSON.stringify(this.productosEnCarrito));
    
                res.status(200).json({"Producto agregado": itemSeleccionado})
    
        } else {

            res.status(404).json({Error: "producto inexistente o sin stock"})
        }

    }

    eliminarProducto = (req: Request, res: Response) => {

        let { id }:any = req.params;

        id = parseInt(id)

        let itemTarget:Item = this.productosEnCarrito.filter(item => (item.id === id))[0]

        if (!itemTarget){

            return res.status(404).json({ Error: 'Producto no encontrado en carrito' })

        } else if (id !== 0 && this.productosEnCarrito.length && itemTarget.cantidad === 1){

            this.productosEnCarrito = this.productosEnCarrito.filter(item => item.id !== itemTarget.id)

            fs.writeFileSync(path.join(__dirname, '../carrito.txt'), JSON.stringify(this.productosEnCarrito));

            res.status(200).json({"Solicitud exitosa": `Producto con id ${id} eliminado`})

        } else if (itemTarget.cantidad !== undefined && itemTarget.cantidad > 1 ){

            itemTarget.cantidad -= 1

            fs.writeFileSync(path.join(__dirname, '../carrito.txt'), JSON.stringify(this.productosEnCarrito));
    
            return res.status(200).json(
                    { "Solicitud exitosa": 'Se ha eliminado una unidad del producto en carrito'}
                )

        }

    }

}