const { options } = require('../options/mysql.js')
const knex = require('knex')(options);

export const createTableProductos = (tableName:any) => {
    knex.schema.createTable(tableName, function (table:any) {
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
      .catch((err:Error) => console.log(err))
      .finally(()=> {
          knex.destroy();
      })
}

export const createTableCarrito = (tableName:any) => {
    knex.schema.createTable(tableName, function (table:any) {
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
      .catch((err:Error) => console.log(err))
      .finally(()=> {
          knex.destroy();
      })
}

export const checkIfTable = (createTableCallback: any, tableName: any) => {
    knex.schema.hasTable(tableName).then(function(exists:any) {
        if (!exists) {
            createTableCallback(tableName);
        } else if (exists) {
            console.log(`La tabla ${tableName} ya existe`)
    }
  })
  .catch((err:Error) => console.log(err))
}
