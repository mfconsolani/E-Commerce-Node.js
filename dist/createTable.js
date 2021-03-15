"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfTable = exports.createTableCarrito = exports.createTableProductos = void 0;
const { options } = require('../options/mysql.js');
const knex = require('knex')(options);
const createTableProductos = (tableName) => {
    knex.schema.createTable(tableName, function (table) {
        table.increments('id');
        table.string('timestamp').notNullable();
        table.string('nombre').notNullable();
        table.text('descripcion').notNullable();
        table.string('codigo').notNullable();
        table.string('foto').notNullable();
        table.bigInteger('precio').notNullable();
        table.bigInteger('stock').notNullable();
    })
        .then(() => console.log(`Tabla ${tableName} ha sido creada`))
        .catch((err) => console.log(err))
        .finally(() => {
        knex.destroy();
    });
};
exports.createTableProductos = createTableProductos;
const createTableCarrito = (tableName) => {
    knex.schema.createTable(tableName, function (table) {
        table.increments('id');
        table.string('timestamp').notNullable();
        table.string('nombre').notNullable();
        table.text('descripcion').notNullable();
        table.string('codigo').notNullable();
        table.string('foto').notNullable();
        table.bigInteger('precio').notNullable();
        table.bigInteger('stock').notNullable();
        table.bigInteger('cantidad').notNullable();
    })
        .then(() => console.log(`Tabla ${tableName} ha sido creada`))
        .catch((err) => console.log(err))
        .finally(() => {
        knex.destroy();
    });
};
exports.createTableCarrito = createTableCarrito;
const checkIfTable = (createTableCallback, tableName) => {
    knex.schema.hasTable(tableName).then(function (exists) {
        if (!exists) {
            createTableCallback(tableName);
        }
        else if (exists) {
            console.log(`La tabla ${tableName} ya existe`);
        }
    })
        .catch((err) => console.log(err));
};
exports.checkIfTable = checkIfTable;
