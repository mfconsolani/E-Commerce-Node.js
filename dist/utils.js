"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeGenerator = void 0;
const faker_1 = __importDefault(require("faker"));
faker_1.default.locale = 'es';
const fakeGenerator = (quantity) => {
    let fakeItemsArray = [];
    for (let i = 0; i < quantity; i++) {
        fakeItemsArray.push({
            timestamp: faker_1.default.date.recent(),
            nombre: faker_1.default.commerce.productName(),
            descripcion: faker_1.default.commerce.productDescription(),
            codigo: faker_1.default.datatype.uuid(),
            foto: faker_1.default.image.imageUrl(),
            precio: Number(faker_1.default.commerce.price()),
            stock: Number(faker_1.default.datatype.number())
        });
    }
    return fakeItemsArray;
};
exports.fakeGenerator = fakeGenerator;
