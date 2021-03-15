import { Request, Response } from 'express';

import { Item } from './interfaces';

const { options } = require('../options/mysql.js')
const knex = require('knex')(options);

export class Productos {

    listarProductos = async (req: Request, res: Response) => {

        const queryItem = async () => {
            return new Promise ((resolve: any, reject:any) => {
                try {

                    knex.from('productos').select('*')
                    .then((rows:any)=> {
                        const string = JSON.stringify(rows);
                        const json = JSON.parse(string);
                        if (json.length === 0){
                        } else {
                            for (let row of rows) {
                                console.log(`${row['id']} | ${row['timestamp']} | ${row['nombre']} | ${row['descripcion']} | ${row['codigo']} | ${row['foto']} | ${row['precio']} | ${row['stock']}`)
                            }
                        } 
                        resolve(json)
                    })
                    .then((res:any) => res)
                    .catch((err:Error) => {
                        console.log(err)
                    })
                } catch (err) {

                    reject(err);
                }
            })           
        }
            
        let existance:any = await queryItem()

        if (existance && existance.length !== 0) {
            res.status(200).json({"Productos cargados": existance})
        } else {
            res.status(404).json({Error: 'No hay productos cargados'})
        }
    }

    listarProductoIndividual = async (req: Request, res: Response) => {
        
        let { id }:any = req.params
        
        id = parseInt(id)

        let itemQuery = async () => {
            return new Promise((resolve, reject)=> {

                knex('productos')
                .where({id: id})
                .then((value:any) => {
                    resolve(value);
                })
                .catch((err:any)=> console.log(err))
            })
        } 

        const existance:any = await itemQuery()

        id !== 0 && existance.length !== 0
        ? res.status(200).json(existance[0])
        : res.status(404).json({ Error: `el producto con id ${id} no existe` })

    }

    agregarProducto = async (req: Request, res: Response) => {

        let { nombre, descripcion, codigo, foto, precio, stock }:any = req.body;

        let itemEnStockFromDB = async () => {
            return new Promise((resolve, reject)=> {

                knex('productos')
                .where({codigo: codigo})
                .then((value:any) => {
                    resolve(value);
                })
                .catch((err:any)=> console.log(err))
            })
        } 

        const existance:any = await itemEnStockFromDB()

        if (existance.length !== 0) {

            res.status(404).json({"Error - Producto ya existente": existance[0]})

        } else {
            
            const timestamp:string = new Date().toLocaleString()
            
            const nuevoProducto = {
                timestamp,
                nombre,
                descripcion,
                codigo,
                foto,
                precio,
                stock
            }

            knex('productos').insert(nuevoProducto)
            .then(()=> console.log('Producto agregado a tabla productos', nuevoProducto))
            .catch((err:Error)=> console.log(err))

            res.status(200).json({"Producto cargado exitosamente": nuevoProducto })

        }
    }

    modificarProducto = async (req: Request, res: Response) => {
        
        let { id }:any = req.params;

        id = parseInt(id)

        let itemQuery = () => {
            return new Promise((resolve, reject:any)=> {

                knex('productos')
                .where({'id': id})
                .then((value:any) => {
                    resolve(value[0]);
                })
                .catch((err:any)=> {
                    console.log(err)
                })
            })
        } 
        
        let existance:any = await itemQuery()
        
        if (id !== 0 && existance && existance.length !== 0){
            
            const propsToReplace = Object
                .keys(req.body)
                .filter((key:string) => existance[key] !== req.body[key])
                
            if (propsToReplace.length) {
            
                const updateProduct:any = () => {
                    return new Promise((resolve:any, reject) => {

                        propsToReplace.forEach(async (prop:any) => {
                            
                            knex('productos')
                            .where(prop,'=', existance[prop])
                            .update(prop, req.body[prop])
                            .then((value:any)=> {
                                console.log(`Dato modificado: ${prop}: ${req.body[prop]}`)
                            })
                            .catch((err:Error) => console.log(err))
                            resolve();
                        })
                    })
                }
                
                    await updateProduct();

                return res.status(200).json({"Estado de la modificación": "Exitosa"})
            } 

            return res.status(200).json({ Alerta: "Ningun dato ingresado difiere de los datos actuales" })
            
        } else if (!existance) {

            return res.status(200).json({ Alerta: 'producto no encontrado' })
        }

    }

    eliminarProducto = async (req: Request, res: Response) => {

        let { id }:any = req.params;

        id = parseInt(id)

        let itemQuery = () => {
            return new Promise((resolve, reject:any)=> {

                knex('productos')
                .where({'id': id})
                .then((value:any) => {
                    resolve(value[0]);
                })
                .catch((err:any)=> {
                    console.log(err)
                })
            })
        }

        let existance:any = await itemQuery()

        if (id !== 0 && existance && existance.length !== 0){

            await knex.from('productos').where("id", "=", id).del()
            .then(() => console.log(`Producto con ${id} eliminado`))
            .catch((err:Error)=> {console.log(err); throw err})

            await knex.from('carrito').where("id", "=", id).del()
            .then(() => console.log(`Producto con ${id} eliminado del carrito del usuario`))
            .catch((err:Error)=> {console.log(err); throw err})

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
