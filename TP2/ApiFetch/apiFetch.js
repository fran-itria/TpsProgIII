const fs = require('fs');
const urlApi = 'https://fakestoreapi.com/products';
const ARCHIVO_LOCAL = './FileSystem/productos.json';

async function safeJsonFetch(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.error("Error al parsear JSON:", err);
    return null;
  }
}

function mostrarProductosLista(productos, titulo = 'Productos') {
  console.log(`\n--- ${titulo} ---`);
  if (!productos || productos.length === 0) {
    console.log('No hay productos para mostrar.');
    return;
  }
  productos.forEach((p, i) => {
    if (!p) {
      console.log(`\nProducto ${i + 1} no encontrado (null).`);
      console.log('-------------------------');
      return;
    }
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

async function obtenerTodosProductos() {
  const res = await fetch(urlApi);
  const data = await safeJsonFetch(res);
  mostrarProductosLista(data, 'Todos los productos (GET)');
  return data;
}

async function obtenerProductosLimitados(limit = 5) {
  const res = await fetch(`${urlApi}?limit=${limit}`);
  const data = await safeJsonFetch(res);
  mostrarProductosLista(data, `Primeros ${limit} productos (GET limitado)`);
  return data;
}

function guardarProductosEnJSON(productos) {
  if (!fs.existsSync('../FileSystem')) fs.mkdirSync('../FileSystem');
  fs.writeFileSync(ARCHIVO_LOCAL, JSON.stringify(productos, null, 2));
  console.log(`\n--- Productos guardados en ${ARCHIVO_LOCAL} ---`);
}

async function agregarProductoAPI() {
  const res = await fetch(urlApi, {
    method: 'POST',
    body: JSON.stringify({
      title: 'Nuevo Producto',
      price: 29.99,
      description: 'Descripción del producto',
      image: 'https://i.pravatar.cc',
      category: 'electronics'
    }),
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await safeJsonFetch(res);
  mostrarProductosLista([data], 'Producto agregado (POST)');
  return data;
}

async function buscarProductoPorID(id) {
  const res = await fetch(`${urlApi}/${id}`);
  const data = await safeJsonFetch(res);
  mostrarProductosLista([data], `Producto con ID ${id} (GET por ID)`);
  return data;
}

async function eliminarProducto(id) {
  const res = await fetch(`${urlApi}/${id}`, { method: 'DELETE' });
  const data = await safeJsonFetch(res);
  mostrarProductosLista([data], `Producto eliminado con ID ${id} (DELETE)`);
  return data;
}

async function modificarProducto(id) {
  const res = await fetch(`${urlApi}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title: 'Producto Modificado', price: 99.99 }),
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await safeJsonFetch(res);
  mostrarProductosLista([data], `Producto modificado con ID ${id} (UPDATE)`);
  return data;
}

async function main() {
  const todosProductos = await obtenerTodosProductos();

  const productosLimitados = await obtenerProductosLimitados(5);

  guardarProductosEnJSON(productosLimitados);


  await agregarProductoAPI();

  if (todosProductos && todosProductos.length > 0) {
    const idExistente = todosProductos[0].id;

    await buscarProductoPorID(idExistente);

    await eliminarProducto(idExistente);

    await modificarProducto(idExistente);
  } else {
    console.log('No hay productos existentes en la API para GET, DELETE o UPDATE.');
  }

  console.log("\n--- PROCESO FINALIZADO ---");
}

main();
