import express, { Request, Response } from 'express';

import { instanciaProductos } from './server'

export const productosRoutes = express.Router();

productosRoutes.get('/', (req: Request, res: Response) => {

    instanciaProductos.listarProductos(req, res);    

})

productosRoutes.get('/:id', (req: Request, res: Response) => {
    
    instanciaProductos.listarProductoIndividual(req, res);

})

productosRoutes.post('/', (req: Request, res: Response) => {
    
    instanciaProductos.agregarProducto(req, res);  

})

productosRoutes.put('/:id', (req: Request, res: Response) => {
    
    instanciaProductos.modificarProducto(req, res);

})

productosRoutes.delete('/:id', (req: Request, res: Response) => {
    
    instanciaProductos.eliminarProducto(req, res);

})

