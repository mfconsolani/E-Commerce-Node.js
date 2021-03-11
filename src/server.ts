import express, { Application } from 'express';

import { productosRoutes } from './productosRoutes';

import { carritoRoutes } from './carritoRoutes';

import { Productos } from './constructorProductos';

import { Carrito } from './constructorCarrito';

import fs from 'fs';

// Set up

const app:Application = express();

export const admin = true;

export let instanciaProductos = new Productos([]);

export let instanciaCarrito = new Carrito([])

// Middleware

app.use(express.json());

app.use('/productos', productosRoutes);

app.use('/carrito', carritoRoutes);


// Server

const server = app.listen(process.env.PORT || 8080, () => {
    fs.readFile('./test.txt', 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          
        } else {
            data = JSON.parse(data);
            let newData:any = data

            newData.map((element:any) => {
                element.precio = parseInt(element.precio);
                element.stock = parseInt(element.stock);

            })
            // instanciaProductos.database = data
            console.log(newData)
            return newData
        }
      })
    console.log(instanciaProductos.database)
    console.log(`Server listening on port ${process.env.PORT || 8080}`)
});


server.on("Error", (error: Error) => {
    console.log(`Se produjo un error al iniciar el servidor. Error: ${error}`) 
});

