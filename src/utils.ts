import faker from 'faker';

faker.locale = 'es'

export const fakeGenerator = (quantity:Number) => {
    let fakeItemsArray = []
    for(let i = 0; i < quantity; i++){
        fakeItemsArray.push({
            timestamp: faker.date.recent(),
            nombre: faker.commerce.productName(),
            descripcion: faker.commerce.productDescription(),
            codigo: faker.datatype.uuid(),
            foto: faker.image.imageUrl(),
            precio: Number(faker.commerce.price()),
            stock: Number(faker.datatype.number())
        })
    }
    return fakeItemsArray
}
