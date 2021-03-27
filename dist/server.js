"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanciaCarrito = exports.instanciaProductos = exports.admin = void 0;
const express_1 = __importDefault(require("express"));
const productosRoutes_1 = require("./productosRoutes");
const carritoRoutes_1 = require("./carritoRoutes");
const constructorProductos_1 = require("./constructorProductos");
const constructorCarrito_1 = require("./constructorCarrito");
const mongoose_1 = __importDefault(require("mongoose"));
// Set up
const app = express_1.default();
exports.admin = true;
exports.instanciaProductos = new constructorProductos_1.Productos();
exports.instanciaCarrito = new constructorCarrito_1.Carrito();
// Middleware
app.use(express_1.default.json());
app.use('/productos', productosRoutes_1.productosRoutes);
app.use('/carrito', carritoRoutes_1.carritoRoutes);
// Mongoose
CRUD();
function CRUD() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const URL = 'mongodb://localhost:27017/ecommerce';
            let response = yield mongoose_1.default.connect(URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            });
            console.log('Conectado a MongoDB');
        }
        catch (e) {
            console.log(e);
        }
    });
}
// Server
const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Server listening on port ${process.env.PORT || 8080}`);
});
server.on("Error", (error) => {
    console.log(`Se produjo un error al iniciar el servidor. Error: ${error}`);
});
