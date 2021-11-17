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
  render();
};

const cambiarEstadoPedido = (id) => {
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
  pedidos = pedidos.filter((pedido) => pedido.id !== id);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  render();
};

const changeModalStatus = (status) => {
  if (status) document.getElementById("modal").style.display = "flex";
  else document.getElementById("modal").style.display = "none";
};

const agregarPedido = () => {
  const nombre = document.getElementById("input-nombre").value;
  const direccion = document.getElementById("input-direccion").value;
  const telefono = document.getElementById("input-telefono").value;
  const precio = Number.parseFloat(
    document.getElementById("input-precio").value
  );

  if (nombre && direccion && telefono && precio) {
    console.log(nombre, direccion, telefono, precio);
    const pedidoNew = new Pedido({ nombre, direccion, telefono, precio });
    alert(pedidoNew.format());
    console.log("Nuevo pedido: ", pedidoNew);
    pedidos.push(pedidoNew);
    console.log("Array actual: ", pedidos);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    render();
    changeModalStatus(false);
  } else {
    alert("Faltan datos!");
  }
  console.log(inputNombre);
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
    <p><b>Precio:</b> $${pedido.precio.toFixed(2)}</p>
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
