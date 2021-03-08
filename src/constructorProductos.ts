import { Request, Response } from 'express';

import { Item } from './interfaces';

export class Productos {

    database:Array<Item>;

    constructor(database:Array<Item>){

        this.database = database;
    }

    listarProductos = (req: Request, res: Response) => {

        this.database.length
        ? res.status(200).json(this.database)
        : res.status(404).json({Error: 'No hay productos cargados'})

    }

    listarProductoIndividual = (req: Request, res: Response) => {
        
        let { id }:any = req.params
        
        id = parseInt(id)

        const productoRequerido = this.database.filter(producto => producto.id === id)[0]

        id !== 0 && this.database.length && productoRequerido
        ? res.status(200).json(productoRequerido)
        : res.status(404).json({ Error: `el producto con id ${id} no existe` })

    }

    agregarProducto = (req: Request, res: Response) => {

        let { nombre, descripcion, codigo, foto, precio, stock }:any = req.body;

        let itemEnStock: Item = this.database.filter(producto => (producto.codigo === codigo))[0]

        if (this.database.length && itemEnStock) {

            res.status(404).json({"Error - Producto ya existente": itemEnStock})

        } else {
            
            const id:number = this.database.length == 0 ? 1 : this.database.slice(-1)[0].id +1

            const timestamp:string = new Date().toLocaleString()
            
            const nuevoProducto:Item = {
                id,
                timestamp,
                nombre,
                descripcion,
                codigo,
                foto,
                precio,
                stock
            }

            this.database.push(nuevoProducto)

            res.status(200).json({"Producto cargado exitosamente": nuevoProducto })

        }
    }

    modificarProducto = (req: Request, res: Response) => {
        
        let { id }:any = req.params;

        id = parseInt(id)

        let itemTarget:any = this.database.filter(item => (item.id === id))[0]

        if (id !== 0 && this.database.length && itemTarget){
            
            const propsToReplace = Object
                .keys(req.body)
                .filter((key:string) => itemTarget[key] !== req.body[key])

            
            if (propsToReplace.length) {
            
                propsToReplace.forEach((prop:string) => itemTarget[prop] = req.body[prop])
                
                return res.status(200).json({"Modificación exitosa": itemTarget})
            } 

            return res.status(200).json({ Alerta: "Ningun dato ingresado difiere de los datos actuales" })
            
        }

        return res.status(200).json({ Alerta: 'producto no encontrado' })
    }

    eliminarProducto = (req: Request, res: Response) => {

        let { id }:any = req.params;

        id = parseInt(id)

        let itemTarget:Item = this.database.filter(item => (item.id === id))[0]

        if (id !== 0 && this.database.length && itemTarget){

            this.database = this.database.filter(item => item.id !== itemTarget.id)

            return res.status(200).json({"Solicitud exitosa": `Producto con id ${id} eliminado`})
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
