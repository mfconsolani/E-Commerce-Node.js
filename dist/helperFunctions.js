"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPersistedCarrito = exports.loadPersistedProductos = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const loadPersistedProductos = () => {
    const dataBaseLoad = fs_1.default.readFileSync(path_1.default.join(__dirname, '../productos.txt'), 'utf-8');
    const parsedDataBase = JSON.parse(dataBaseLoad);
    const normalizedProductsArray = parsedDataBase.map((element) => {
        let { id, precio, stock, rest } = element;
        element.id = parseInt(id);
        rest;
        element.precio = parseInt(precio);
        element.stock = parseInt(stock);
        return element;
    });
    return normalizedProductsArray;
};
exports.loadPersistedProductos = loadPersistedProductos;
const loadPersistedCarrito = () => {
    const dataBaseLoad = fs_1.default.readFileSync(path_1.default.join(__dirname, '../carrito.txt'), 'utf-8');
    const parsedDataBase = JSON.parse(dataBaseLoad);
    const normalizedCarritoArray = parsedDataBase.map((element) => {
        let { id, precio, stock, cantidad, rest } = element;
        element.id = parseInt(id);
        rest;
        element.precio = parseInt(precio);
        element.stock = parseInt(stock);
        element.cantidad = parseInt(cantidad);
        return element;
    });
    return normalizedCarritoArray;
};
exports.loadPersistedCarrito = loadPersistedCarrito;
