import express, { Application } from 'express';

import { productosRoutes } from './productosRoutes';

import { carritoRoutes } from './carritoRoutes';

import { Productos } from './constructorProductos';

import { Carrito } from './constructorCarrito';

// Set up

const app:Application = express();

const PORT = process.env.PORT || 8080

export const admin = true;

export let instanciaProductos = new Productos([{
    id: 1, 
    timestamp: "3/7/2021, 6:53:25 PM",
    nombre: "ipod",
    descripcion: "un ipod a todo trapo",
    codigo: "21493423sadasa",
    foto: "/url/a/una/foto/del/ipod",
    precio: 76030, 
    stock: 43
}]);

export let instanciaCarrito = new Carrito([{
    id: 2, 
    timestamp: "3/7/2021, 6:53:25 PM",
    nombre: "tablet",
    descripcion: "una tablet cualquiera",
    codigo: "984395843maldmassd",
    foto: "/url/a/una/foto/del/tablet",
    precio: 85620, 
    stock: 32,
    cantidad: 1
}])

// Middleware

app.use(express.json());

app.use('/productos', productosRoutes);

app.use('/carrito', carritoRoutes);


// Server


const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});


server.on("Error", (error: Error) => {
    console.log(`Se produjo un error al iniciar el servidor. Error: ${error}`) 
});

