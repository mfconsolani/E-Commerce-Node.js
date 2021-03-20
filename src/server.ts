import express, { Application } from 'express';

import { productosRoutes } from './productosRoutes';

import { carritoRoutes } from './carritoRoutes';

import { Productos } from './constructorProductos';

import { Carrito } from './constructorCarrito';

import { loadPersistedProductos, loadPersistedCarrito } from './helperFunctions';

import fs from 'fs';

// Set up

const app:Application = express();

export const admin = true;

export let instanciaProductos = new Productos([]);

export let instanciaCarrito = new Carrito([]);

// Middleware

app.use(express.json());

app.use('/productos', productosRoutes);

app.use('/carrito', carritoRoutes);


// Server

const server = app.listen(process.env.PORT || 8080, () => {

    instanciaProductos.database = loadPersistedProductos();
    instanciaCarrito.productosEnCarrito = loadPersistedCarrito()
    
    console.log('Productos cargados:', instanciaProductos.database);
    console.log('Carrito:', instanciaCarrito.productosEnCarrito);

    console.log(`Server listening on port ${process.env.PORT || 8080}`)

});


server.on("Error", (error: Error) => {
    console.log(`Se produjo un error al iniciar el servidor. Error: ${error}`) 
});
