const pedidosContainer = document.getElementById("pedidos");

const pedidosIniciales = [
  {
    nombre: "Pedido 1",
    direccion: "Direccion 1",
    telefono: "123456789",
    precio: 100,
  },
  {
    nombre: "Pedido 2",
    direccion: "Direccion 2",
    telefono: "123456789",
    precio: 200,
  },
];
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
}

/*
Suma el precio de todos los pedidos y lo muestra en pantalla
*/
const calcularVentasTotales = () => {
  let ventasTotales = 0;
  pedidos.forEach((pedido) => (ventasTotales += pedido.precio));
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
  render();
};

/*
Cambia el estado "entregado" del pedido entre true or false y lo guarda
en el localStorage
*/
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

/*
Elimina un pedido del array segun su id
*/
const eliminarPedido = (id) => {
  pedidos = pedidos.filter((pedido) => pedido.id !== id);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  render();
};

/*
Muestra o oculta el modal de ingreso de pedidos
*/
const changeModalStatus = (status) => {
  if (status) document.getElementById("modal").style.display = "flex";
  else document.getElementById("modal").style.display = "none";
};

/*
Levanta los datos ingresados en el modal de agregar pedido, verifica que esten
completos, y de ser asi crea un nuevo pedido con esos datos y lo guarda en el LocalStorage
*/
const agregarPedido = () => {
  const nombre = document.getElementById("input-nombre").value;
  const direccion = document.getElementById("input-direccion").value;
  const telefono = document.getElementById("input-telefono").value;
  const precio = Number.parseFloat(
    document.getElementById("input-precio").value
  );

  if (nombre && direccion && telefono && precio) {
    const pedidoNew = new Pedido({ nombre, direccion, telefono, precio });
    pedidos.push(pedidoNew);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    render();
    changeModalStatus(false);
  } else {
    alert("Faltan datos!");
  }
};

/*
Renderiza en pantalla la lista de pedidos del array, y actualiza el valor de
ventas totales
*/
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

/*
Codigo que inicializa el proyecto. Primero busca el array de pedidos en el
localStorage. Si no encuentra nada, levanta los pedidos hardcodeados en la constante
pedidosIniciales. Luego mapea ese JSON creando los objetos de tipo Pedido y los guarda
en el array "pedidos". Finalmente, guarda estos datos en el localStorage, y llama
a la funcion que renderiza la pantalla.
*/
const pedidosJSON =
  JSON.parse(localStorage.getItem("pedidos")) || pedidosIniciales;
let pedidos = pedidosJSON.map((pedido) => new Pedido(pedido));
localStorage.setItem("pedidos", JSON.stringify(pedidos));

render();
