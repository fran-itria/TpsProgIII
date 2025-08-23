const fs = require('fs');
const path = require('path');
const urlApi = 'https://fakestoreapi.com/products';
const ARCHIVO_LOCAL = path.join(__dirname, '..', 'FileSystem', 'productos.json');

async function guardarJsonFetch(res) {
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
  const datos = await guardarJsonFetch(res);
  mostrarProductosLista(datos, 'Todos los productos (GET)');
  return datos;
}

async function obtenerProductosLimitados(limit = 5) {
  const res = await fetch(`${urlApi}?limit=${limit}`);
  const datos = await guardarJsonFetch(res);
  mostrarProductosLista(datos, `Primeros ${limit} productos (GET limitado)`);
  return datos;
}

function guardarProductosEnJSON(productos) {
  const dir = path.dirname(ARCHIVO_LOCAL);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
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
  const datos = await guardarJsonFetch(res);
  mostrarProductosLista([datos], 'Producto agregado (POST)');
  return datos;
}

async function buscarProductoPorID(id) {
  const res = await fetch(`${urlApi}/${id}`);
  const datos = await guardarJsonFetch(res);
  mostrarProductosLista([datos], `Producto con ID ${id} (GET por ID)`);
  return datos;
}

async function eliminarProducto(id) {
  const res = await fetch(`${urlApi}/${id}`, { method: 'DELETE' });
  const datos = await guardarJsonFetch(res);
  mostrarProductosLista([datos], `Producto eliminado con ID ${id} (DELETE)`);
  return datos;
}

async function modificarProducto(id) {
  const res = await fetch(`${urlApi}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title: 'Producto Modificado', price: 99.99 }),
    headers: { 'Content-Type': 'application/json' }
  });
  const datos = await guardarJsonFetch(res);
  mostrarProductosLista([datos], `Producto modificado con ID ${id} (UPDATE)`);
  return datos;
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
