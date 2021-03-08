import express, { Request, Response } from 'express';

import { instanciaProductos } from './server'

import { admin } from './server'

export const productosRoutes = express.Router();

productosRoutes.get('/', (req: Request, res: Response) => {

    instanciaProductos.listarProductos(req, res);    

})

productosRoutes.get('/:id', (req: Request, res: Response) => {
    
    instanciaProductos.listarProductoIndividual(req, res);

})

productosRoutes.post('/', (req: Request, res: Response) => {
    
    admin 
    ? instanciaProductos.agregarProducto(req, res)
    : instanciaProductos.solicitudNoAutorizada(req, res)

})

productosRoutes.put('/:id', (req: Request, res: Response) => {
    
    admin 
    ? instanciaProductos.modificarProducto(req, res)
    : instanciaProductos.solicitudNoAutorizada(req, res)

})

productosRoutes.delete('/:id', (req: Request, res: Response) => {
    
    admin 
    ? instanciaProductos.eliminarProducto(req, res)
    : instanciaProductos.solicitudNoAutorizada(req, res)
    

})

