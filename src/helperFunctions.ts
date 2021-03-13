import fs from 'fs';

import path from 'path'

import { instanciaProductos, instanciaCarrito } from './server'

import {Item} from './interfaces';

export const loadPersistedProductos = () => {

  const dataBaseLoad = fs.readFileSync(path.join(__dirname, '../productos.txt'), 'utf-8')
  
  const parsedDataBase = JSON.parse(dataBaseLoad)
  
  const normalizedProductsArray = parsedDataBase.map((element:any) => {
  
    let { id, precio, stock, rest} = element;
      element.id = parseInt(id)
      rest 
      element.precio = parseInt(precio);
      element.stock = parseInt(stock);
      return element
  })

      return normalizedProductsArray
}

export const loadPersistedCarrito = () => {

  const dataBaseLoad = fs.readFileSync(path.join(__dirname, '../carrito.txt'), 'utf-8')
  
  const parsedDataBase = JSON.parse(dataBaseLoad)
  
  const normalizedCarritoArray = parsedDataBase.map((element:any) => {
  
      let {id, precio, stock, cantidad, rest} = element;
      element.id = parseInt(id);
      rest 
      element.precio = parseInt(precio);
      element.stock = parseInt(stock);
      element.cantidad = parseInt(cantidad);
      return element
  })

      return normalizedCarritoArray

}