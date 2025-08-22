const productos = [
    { id: 1, nombre: 'Laptop HP', precio: 850, stock: 5 },
    { id: 2, nombre: 'Mouse inalámbrico', precio: 25, stock: 0 },
    { id: 3, nombre: 'Teclado mecánico', precio: 120, stock: 8 },
    { id: 4, nombre: 'Monitor 24"', precio: 200, stock: 3 },
    { id: 5, nombre: 'Auriculares Bluetooth', precio: 75, stock: 12 }
];

console.log('1. Total de productos en inventario:', productos.length);

console.log('\n2. Productos seleccionados:');
console.log('   - Segundo producto:', productos[1].nombre);
console.log('   - Cuarto producto:', productos[3].nombre);

console.log('\n3. Listado completo de productos:');

console.log('3.1 Con for...of:');
for (const prod of productos) {
    console.log(`   ${prod.nombre} - Precio: $${prod.precio}`);
}

console.log('\n3.2 Con forEach:');
productos.forEach(prod => {
    console.log(`   Producto: ${prod.nombre} | Precio: $${prod.precio} | Stock: ${prod.stock}`);
});

console.log('\n4. Modificando el inventario:');

productos.push(
    { id: 6, nombre: 'Webcam HD', precio: 65, stock: 7 },
    { id: 7, nombre: 'Micrófono USB', precio: 55, stock: 4 }
);
console.log('4.1 Se agregaron 2 nuevos productos:', productos.slice(-2).map(p => p.nombre));

const eliminado = productos.pop();
console.log(`4.2 Se eliminó: ${eliminado.nombre}`);

productos.unshift({ id: 8, nombre: 'Tablet 10"', precio: 180, stock: 6 });
console.log('4.3 Nuevo producto agregado al inicio:', productos[0].nombre);

const primerProd = productos.shift();
console.log(`4.4 Producto removido del inicio: ${primerProd.nombre}`);

const conStock = productos.filter(p => p.stock > 0);
console.log('\n4.5 Productos disponibles:');
conStock.forEach(p => console.log(`   - ${p.nombre} (${p.stock} unidades)`));

const nombres = productos.map(p => p.nombre);
console.log('\n4.6 Nombres de productos:', nombres.join(', '));

const buscarId = 3;
const encontrado = productos.find(p => p.id === buscarId);
console.log(`\n4.7 Búsqueda por ID (${buscarId}):`, encontrado ? encontrado.nombre : 'No encontrado');

const ordenados = [...productos].sort((a, b) => b.precio - a.precio);
console.log('\n4.8 Productos ordenados por precio:');
ordenados.forEach(p => console.log(`   $${p.precio} - ${p.nombre}`));

console.log('\nEstado final del inventario:');
console.log(productos);