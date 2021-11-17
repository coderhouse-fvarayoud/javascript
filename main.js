const pedidosContainer = document.getElementById("pedidos");

class Pedido {
  constructor({
    nombre,
    direccion,
    telefono,
    precio,
    entregado,
    id,
    fechaCreado,
  }) {
    this.id = id || Date.now();
    this.fechaCreado = fechaCreado || new Date();
    this.nombre = nombre;
    this.direccion = direccion;
    this.telefono = telefono;
    this.precio = Number.parseFloat(precio.toFixed(2));
    this.entregado = entregado || false;
  }

  marcarEntregado() {
    this.entregado = true;
  }

  marcarPendiente() {
    this.entregado = false;
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
    const pedidoNew = new Pedido({ nombre, direccion, telefono, precio });
    alert(pedidoNew.format());
    console.log("Nuevo pedido: ", pedidoNew);
    pedidos.push(pedidoNew);
    console.log("Array actual: ", pedidos);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  } else {
    alert("Debe ingresar todos los datos.");
  }
  render();
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
  document.getElementById(
    "ventasTotales"
  ).textContent = `$${ventasTotales.toFixed(2)}`;
};

/*
Borra todos los pedidos guardados en memoria y en el localStorage
*/
const clearPedidos = () => {
  pedidos = [];
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  console.log("Nuevo array: ", pedidos);
};

/*
Ordena el array de pedidos de mayor a menor segun su precio
*/
const ordenarPorPrecio = (orden) => {
  pedidos = pedidos.sort((a, b) => {
    if (orden === "mayor") {
      return b.precio - a.precio;
    } else return a.precio - b.precio;
  });
  console.log("Lista ordenada por precios: ", pedidos);
  // pedidos = sortedArray
  render();
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
  render();
};

const marcarTodosComoPendientes = () => {
  pedidos = pedidos.map((pedido) => {
    pedido.marcarPendiente();
    return pedido;
  });
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  console.log("Nuevo array: ", pedidos);
  render();
};

const cambiarEstadoPedido = (id) => {
  console.log("Cambio pedido: ", id);
  pedidos.map((pedido) => {
    if (pedido.id === id) {
      if (pedido.entregado) {
        pedido.marcarPendiente();
      } else {
        pedido.marcarEntregado();
      }
    }
    return pedido;
  });
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  render();
};

const eliminarPedido = (id) => {
  console.log("Cambio pedido: ", id);
  pedidos = pedidos.filter((pedido) => pedido.id !== id);
  // localStorage.setItem("pedidos", JSON.stringify(pedidos));
  render();
};

const render = () => {
  pedidosContainer.innerHTML = "";
  pedidos.map((pedido) => {
    const li = document.createElement("li");
    let pedidoHTML = `
    <div class="pedido__container">
    <p><b>Nombre:</b> ${pedido.nombre}</p>
    <p><b>Direccion:</b> ${pedido.direccion}</p>
    <p><b>Teléfono:</b> ${pedido.telefono}</p>
    <p><b>Precio:</b> $${pedido.precio}</p>
    `;
    pedidoHTML += pedido.entregado
      ? `<button class="primary-button" onClick=cambiarEstadoPedido(${pedido.id})>Entregado</button>`
      : `<button class="primary-button" onClick=cambiarEstadoPedido(${pedido.id})>No entregado</button>`;
    pedidoHTML += `<button class="primary-button" onClick=eliminarPedido(${pedido.id})>Eliminar</button>`;
    pedidoHTML += "</div>";

    li.innerHTML = pedidoHTML;
    pedidosContainer.appendChild(li);
  });
  calcularVentasTotales();
};

const pedidosJSON = JSON.parse(localStorage.getItem("pedidos")) || [];
let pedidos = pedidosJSON.map((pedido) => new Pedido(pedido));
localStorage.setItem("pedidos", JSON.stringify(pedidos));

render();
