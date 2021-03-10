import express, { Request, Response } from 'express';

import { instanciaCarrito } from './server'



export const carritoRoutes = express.Router();



carritoRoutes.get('/', (req: Request, res: Response) => {

    instanciaCarrito.listarProductos(req, res);

});

carritoRoutes.get('/:id', (req: Request, res: Response) => {
    
    instanciaCarrito.listarProductoIndividual(req, res);

});

carritoRoutes.post('/:id_producto', (req: Request, res: Response) => {
  
    instanciaCarrito.agregarProducto(req, res);

});


carritoRoutes.delete('/:id', (req: Request, res: Response) => {
    
    instanciaCarrito.eliminarProducto(req, res);

}); 