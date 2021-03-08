export interface Item {
    id: number; 
    timestamp: string;
    nombre: string
    descripcion: string;
    codigo: any;
    foto: string;
    precio: number; 
    stock: number;
    cantidad?: number;
}