const fs = require('fs');
const ARCHIVO_LOCAL = './FileSystem/productos.json';

function leerProductos() {
  if (!fs.existsSync(ARCHIVO_LOCAL)) {
    console.log(`El archivo ${ARCHIVO_LOCAL} no existe. Se creará uno nuevo al guardar.`);
    return [];
  }
  const datos = fs.readFileSync(ARCHIVO_LOCAL, 'utf-8');
  if (!datos) return [];
  return JSON.parse(datos);
}

function guardarProductos(productos) {
  fs.writeFileSync(ARCHIVO_LOCAL, JSON.stringify(productos, null, 2));
  console.log(`\nDatos guardados en ${ARCHIVO_LOCAL}`);
}

function mostrarProductosLista(productos, titulo = 'Productos') {
  console.log(`\n--- ${titulo} ---`);
  if (!productos || productos.length === 0) {
    console.log('No hay productos para mostrar.');
    return;
  }
  productos.forEach((p, i) => {
    console.log(`\nProducto ${i + 1}:`);
    console.log(`ID: ${p.id}`);
    console.log(`Título: ${p.title}`);
    console.log(`Precio: $${p.price}`);
    console.log(`Descripción: ${p.description}`);
    console.log(`Categoría: ${p.category}`);
    console.log(`Imagen: ${p.image}`);
    console.log('-------------------------');
  });
}

function agregarProductoLocal() {
  const productos = leerProductos();
  const nuevoProducto = {
    id: Date.now(),
    title: 'Producto Local',
    price: 50,
    description: 'Ejemplo de producto en archivo local',
    category: 'electronics',
    image: 'https://i.pravatar.cc'
  };
  productos.push(nuevoProducto);
  guardarProductos(productos);
  console.log('\nProducto agregado al archivo local:');
  mostrarProductosLista([nuevoProducto]);
}

function eliminarProductosPrecioMayor(valor) {
  let productos = leerProductos();
  if (productos.length === 0) {
    console.log('\nNo hay productos en el archivo para eliminar.');
    return;
  }
  const productosOriginales = productos.length;
  productos = productos.filter(p => p.price <= valor);
  guardarProductos(productos);
  console.log(`\nProductos con precio mayor a ${valor} eliminados (${productosOriginales - productos.length} eliminados).`);
}

function main() {
  let productos = leerProductos();
  mostrarProductosLista(productos, 'Productos en archivo local');

  agregarProductoLocal();

  eliminarProductosPrecioMayor(40);

  productos = leerProductos();
  mostrarProductosLista(productos, 'Productos finales en archivo local');
}

main();
