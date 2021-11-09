class Pedido {
  constructor(nombre, direccion, telefono, precio) {
    this.id = Date.now();
    this.fechaCreado = new Date();
    this.nombre = nombre;
    this.direccion = direccion;
    this.telefono = telefono;
    this.precio = Number.parseFloat(precio.toFixed(2));
    this.entregado = false;
  }

  marcarEntregado() {
    this.entregado = true;
  }

  aplicarDescuento(descuentoEnPorcentaje) {
    this.precio = ((this.precio * (100 - descuentoEnPorcentaje)) / 100).toFixed(
      2
    );
  }

  format() {
    return `El pedido esta a nombre de ${this.nombre}, su teléfono es ${
      this.telefono
    }, y la dirección es ${this.direccion}. El precio final es de $${
      this.precio
    }. ${this.entregado ? "Ya fue entregado" : "Aún no ha sido entregado"}.`;
  }
}

/*
Funcion para ingresar un pedido por prompt.
*/
const inputPedido = () => {
  const nombre = prompt("Ingrese nombre del pedido: ");
  const direccion = prompt("Ingrese dirección del pedido: ");
  const telefono = prompt("Ingrese teléfono del pedido: ");
  const precio = Number(prompt("Ingrese el precio del pedido: "));

  if (nombre && direccion && telefono && precio) {
    const pedidoNew = new Pedido(nombre, direccion, telefono, precio);
    alert(pedidoNew.format());
    /*
    Marcar como entregado un pedido por medio a modo de prueba
    */
    if (pedidos.length % 2) pedidoNew.marcarEntregado();
    console.log("Nuevo pedido: ", pedidoNew);
    pedidos.push(pedidoNew);
    console.log("Array actual: ", pedidos);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  } else {
    alert("Debe ingresar todos los datos.");
  }
};

/*
Muestra por consola solo los pedidos marcados como "sin entregar"
*/
const mostrarPedidosSinEntregar = () => {
  const pedidosSinEntregar = pedidos.filter((pedido) => !pedido.entregado);
  console.log("Pedidos sin entregar: ", pedidosSinEntregar);
};

/*
Suma el precio de todos los pedidos y los saca por consola
*/
const calcularVentasTotales = () => {
  let ventasTotales = 0;
  pedidos.forEach((pedido) => (ventasTotales += pedido.precio));
  console.log("Ventas totales: ", "$" + ventasTotales.toFixed(2));
};

/*
Borra todos los pedidos guardados en memoria y en el localStorage
*/
const clearPedidos = () => {
  pedidos = [];
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
};

/*
Ordena el array de pedidos de mayor a menor segun su precio
*/
const ordenarPorPrecio = () => {
  console.log(
    "Lista ordenada por precios: ",
    pedidos.sort((a, b) => b.precio - a.precio)
  );
};

/*
Marca todos los pedidos del array como entregados
*/
const marcarTodosComoEntregados = () => {
  pedidos = pedidos.map((pedido) => {
    pedido.marcarEntregado();
    return pedido;
  });
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  console.log("Nuevo array: ", pedidos);
};

let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
localStorage.setItem("pedidos", JSON.stringify(pedidos));
