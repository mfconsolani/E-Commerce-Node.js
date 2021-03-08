import express, { Application } from 'express';

import { productosRoutes } from './productosRoutes';

import { carritoRoutes } from './carritoRoutes';

import { Productos } from './constructorProductos';

import { Carrito } from './constructorCarrito';

// Set up

const app:Application = express();

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
    timestamp: "3/8/2021, 3:55:49 PM",
    nombre: "Lenovo T14",
    descripcion: "La computadora mas sarpada del momento",
    codigo: "94389n129321",
    foto: "/url/a/una/foto/de/la/lenovo",
    precio: 350000,
    stock: 150,
    cantidad: 1
}])

// Middleware

app.use(express.json());

app.use('/productos', productosRoutes);

app.use('/carrito', carritoRoutes);


// Server

const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Server listening on port ${process.env.PORT || 8080}`)
});


server.on("Error", (error: Error) => {
    console.log(`Se produjo un error al iniciar el servidor. Error: ${error}`) 
});

