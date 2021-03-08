import express, { Request, Response } from 'express';

import { instanciaCarrito } from './server'

export const carritoRoutes = express.Router();

carritoRoutes.get('/', (req: Request, res: Response) => {

    instanciaCarrito.listarProductos(req, res);

})

carritoRoutes.get('/:id', (req: Request, res: Response) => {
    
    instanciaCarrito.listarProductoIndividual(req, res);

})

carritoRoutes.post('/', (req: Request, res: Response) => {
  
    instanciaCarrito.agregarProducto(req, res);

})

carritoRoutes.put('/', (req: Request, res: Response) => {
    
})

carritoRoutes.delete('/', (req: Request, res: Response) => {
    
})