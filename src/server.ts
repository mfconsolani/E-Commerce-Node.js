import express, { Application } from 'express';

import { productosRoutes } from './productosRoutes';

import { carritoRoutes } from './carritoRoutes';

import { Productos } from './constructorProductos';

import { Carrito } from './constructorCarrito';

import { checkIfTable, createTableCarrito, createTableProductos } from './createTable';

import mongoose from 'mongoose';

// Set up

const app:Application = express();

export const admin = true;

export let instanciaProductos = new Productos();

export let instanciaCarrito = new Carrito()


// Middleware

app.use(express.json());

app.use('/productos', productosRoutes);

app.use('/carrito', carritoRoutes);


// Mongoose

CRUD()

async function CRUD() {
    try {
        const URL = 'mongodb://localhost:27017/ecommerce'

        let response = await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Conectado a MongoDB')
    } catch (e) {
        console.log(e)
    }
}

// Server

const server = app.listen(process.env.PORT || 8080, () => {
    checkIfTable(createTableProductos, 'productos');
    checkIfTable(createTableCarrito, 'carrito');
    console.log(`Server listening on port ${process.env.PORT || 8080}`)
});


server.on("Error", (error: Error) => {
    console.log(`Se produjo un error al iniciar el servidor. Error: ${error}`) 
});
