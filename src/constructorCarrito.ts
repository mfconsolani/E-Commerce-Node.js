import { Request, Response } from 'express';

import { Item } from './interfaces';

import casual from 'casual';
import { productosRoutes } from './productosRoutes';

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

        const productoBuscado = this.productosEnCarrito.filter(producto => producto.id === id)[0]

        if (id !== 0 && this.productosEnCarrito.length && productoBuscado){
            
            return res.status(200).json({"Producto encontrado": productoBuscado});

        }

        return res.status(200).json({ Alerta: "El producto buscado no está en el carrito" });

    }

    agregarProducto = (req: Request, res: Response) => {

    }

}