import { Request, Response } from 'express';
import { Producto } from './productosModel';
import { Carro } from './carritoModel'
import { fakeGenerator } from './utils'

export class Productos {

    listarProductos = async (req: Request, res: Response) => {
        let existQueryStrings = Object.keys(req.query).length
        const existance = await Producto.find();

        if (existQueryStrings){
            let nombre = req.query.nombre || undefined
            let minPrice = req.query.minPrice || 0
            let maxPrice = req.query.maxPrice || Infinity

            if (nombre !== undefined){
                let findByAllQueries = await Producto.find({$and: 
                    [
                        {precio: {$gte: minPrice}}, 
                        {precio: {$lte: maxPrice}},
                        {nombre: nombre}
                    ]
                }).then((value:any) => {
                    value.length === 0
                    ? res.status(404).send(`Busqueda sin resultados para los siguienes filtros: 
                        nombre: ${nombre || 'sin especificar'} 
                        precio mínimo: ${minPrice}
                        precio máximo: ${maxPrice === Infinity ? 'precio máximo posible' : maxPrice}`)
                    : res.status(200).send(value)
                })
            } else if (nombre === undefined){
                let findByPrice = await Producto.find({$and: 
                    [
                        {precio: {$gte: minPrice}}, 
                        {precio: {$lte: maxPrice}},
                    ]
                }).then((value:any) => {
                    value.length === 0
                    ? res.status(404).send(`Busqueda sin resultados para los siguienes filtros: 
                    nombre: ${nombre || 'sin especificar'} 
                    precio mínimo: ${minPrice}
                    precio máximo: ${maxPrice === Infinity ? 'precio máximo posible' : maxPrice}`)
                    : res.status(200).send(value)
                })
            }
         
        } else if (!existQueryStrings && existance.length !== 0) {
            const existance = await Producto.find();
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

    mockGenerator = (req: Request, res:Response) => {
        let quantityOfObject:Number = Number(req.query.cant || 10) 
        let fakeArray = fakeGenerator(quantityOfObject)
        fakeArray.length > 0 
        ? res.status(200).json({Productos: fakeArray})
        : res.status(404).json({Error: 'No hay productos cargados'})
    }

    agregarProducto = async (req: Request, res: Response) => {
        let { nombre, descripcion, codigo, foto, precio, stock }:any = req.body;
        let existance = await Producto.find({codigo: codigo})
        if (existance && existance.length !== 0 ) {
            res.status(404).json({"Error - Producto ya existente": existance[0]})
        } else {
            const timestamp:string = new Date().toLocaleString()
            const newItem = await Producto.find()
            .sort({id: -1})
            .limit(1)
            .then((value:any) => {
                let id
                if (value.length === 0){
                    id = 1
                } else {
                    id = value[0].id + 1
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
                }
            })
            const productoSaveModel = new Producto(newItem)
            await productoSaveModel.save();
            res.status(200).json({"Producto cargado exitosamente": newItem })
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