import express, { Request, Response } from 'express';

import { instancia } from './server'

export const productosRoutes = express.Router();

productosRoutes.get('/', (req: Request, res: Response) => {

    instancia.listarProductos(req, res);    

})

productosRoutes.get('/:id', (req: Request, res: Response) => {
    
    instancia.listarProductoIndividual(req, res);

})

productosRoutes.post('/', (req: Request, res: Response) => {
    
    instancia.agregarProducto(req, res);  

})

productosRoutes.put('/:id', (req: Request, res: Response) => {
    
    instancia.modificarProducto(req, res);

})

productosRoutes.delete('/:id', (req: Request, res: Response) => {
    
    instancia.eliminarProducto(req, res);

})

