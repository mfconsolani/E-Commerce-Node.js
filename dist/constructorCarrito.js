"use strict";
// import { Request, Response } from 'express';
// import casual from 'casual';
// export class Carrito {
//     id: any;
//     timestamp: string;
//     constructor(){
//         this.id = casual.uuid;
//         this.timestamp = new Date().toLocaleString();
//     }
//     listarProductos = async (req: Request, res: Response) => {
//         const queryItem = async () => {
//             return new Promise ((resolve: any, reject:any) => {
//                 try {
//                     knex.from('carrito').select('*')
//                     .then((rows:any)=> {
//                         const string = JSON.stringify(rows);
//                         const json = JSON.parse(string);
//                         if (json.length === 0){
//                         } else {
//                             for (let row of rows) {
//                                 console.log(`${row['id']} | ${row['timestamp']} | ${row['nombre']} | ${row['descripcion']} | ${row['codigo']} | ${row['foto']} | ${row['precio']} | ${row['stock']} | ${row['cantidad']}`)
//                             }
//                         } 
//                         resolve(json)
//                     })
//                     .then((res:any) => res)
//                     .catch((err:Error) => {
//                         console.log(err)
//                     })
//                 } catch (err) {
//                     reject(err);
//                 }
//             })           
//         }
//         let existance:any = await queryItem()
//         if (existance && existance.length !== 0) {
//             res.status(200).json({"Productos cargados": existance})
//         } else {
//             res.status(404).json({Error: 'No hay productos cargados'})
//         }
//     }
//     listarProductoIndividual = async (req: Request, res: Response) => {
//         let { id }:any = req.params
//         id = parseInt(id)
//         let itemQuery = async () => {
//             return new Promise((resolve, reject)=> {
//                 knex('productos')
//                 .where({id: id})
//                 .then((value:any) => {
//                     resolve(value);
//                 })
//                 .catch((err:any)=> console.log(err))
//             })
//         } 
//         const existance:any = await itemQuery()
//         id !== 0 && existance.length !== 0
//         ? res.status(200).json({"Producto encontrado": existance[0]})
//         : res.status(404).json({ Error: `el producto con id ${id} no existe` })
//     }
//     agregarProducto = async (req: Request, res: Response) => {
//         let { id_producto }:any = req.params;
//         id_producto = parseInt(id_producto);
//         let itemEnCarrito = () => {
//             return new Promise((resolve, reject)=> {
//                 knex.from('carrito')
//                 .where({'id': id_producto})
//                 .then((value:any) => {
//                     resolve(value);
//                 })
//                 .catch((err:any)=> console.log(err))
//             })
//         }
//         const existeEnCarrito:any = await itemEnCarrito()
//         let itemEnProductos = async () => {
//             return new Promise((resolve, reject)=> {
//                 try {
//                     knex('productos')
//                     .where({'id': id_producto})
//                     .then((value:any) => {
//                         resolve(value[0]);
//                     })
//                     .catch((err:any)=> {reject(err); console.log(err)})
//                 } catch (err) {
//                     console.log(err)
//                 }
//             })
//         }
//         let existeEnProductos:any = await itemEnProductos();
//         if (
//             id_producto !== 0 
//             && existeEnCarrito.length !== 0 
//             && existeEnCarrito.cantidad !== 0
//             && existeEnProductos !== undefined
//             && existeEnProductos.stock > 0
//             )
//             { await knex('carrito').where('id', '=', id_producto).increment('cantidad', 1)
//             .then(()=> console.log('Nueva unidad agregada'))
//             .catch((err:Error) => console.log(err))
//             return res.status(200).json("Producto en carrito - Se agregó una unidad más")
//         } else if (
//                 id_producto !== 0 
//                 && existeEnCarrito.length === 0 
//                 && existeEnProductos !== undefined 
//                 && existeEnProductos.stock > 0
//             )
//             {   let nuevoProducto = existeEnProductos;
//                 nuevoProducto.cantidad = 1;
//                 knex('carrito').insert(nuevoProducto)
//                 .then(()=> console.log('Producto agregado a tabla productos', nuevoProducto))
//                 .catch((err:Error)=> console.log(err))
//                 res.status(200).json({"Producto agregado": nuevoProducto})
//         } else if (existeEnProductos === undefined || existeEnProductos.stock === 0){
//             res.status(404).json({Error: "producto inexistente o sin stock"})
//         }
//     }
//     eliminarProducto = async (req: Request, res: Response) => {
//         let { id }:any = req.params;
//         id = parseInt(id)
//         let itemTarget = () => {
//             return new Promise((resolve, reject)=> {
//                 knex.from('carrito')
//                 .where({'id': id})
//                 .then((value:any) => resolve(value[0]))
//                 .catch((err:any)=> console.log(err))
//             })
//         }
//         const existeEnCarrito:any = await itemTarget()
//         if (existeEnCarrito === undefined){
//             return res.status(404).json({ Error: 'Producto no encontrado en carrito' })
//         } else if (id !== 0 && existeEnCarrito.cantidad === 1){
//             await knex.from('carrito').where("id", "=", id).del()
//             .then(() => console.log(`Producto con ${id} eliminado`))
//             .catch((err:Error)=> {console.log(err); throw err})
//             res.status(200).json({"Solicitud exitosa": `Producto con id ${id} eliminado`})
//         } else if (id !== 0 && existeEnCarrito.cantidad > 1 ){
//             await knex('carrito').where('id', '=', id).decrement('cantidad', 1)
//             .then(()=> console.log('Se ha eliminado una unidad del producto en carrito'))
//             .catch((err:Error) => console.log(err))
//             return res.status(200).json(
//                     { "Solicitud exitosa": 'Se ha eliminado una unidad del producto en carrito'}
//                 )
//         }
//     }
// }
