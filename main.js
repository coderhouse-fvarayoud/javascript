const pedidosIniciales = [
  {
    id: 1,
    nombre: "Pedido 1",
    direccion: "Direccion 1",
    telefono: "123456789",
    precio: 100,
  },
  {
    id: 2,
    nombre: "Pedido 2",
    direccion: "Direccion 2",
    telefono: "123456789",
    precio: 200,
  },
];

let cotizacionDolar = "";

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
Guarda el array de pedidos en localStorage
*/
const guardarPedidos = () => {
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
};

/*
Suma el precio de todos los pedidos y lo muestra en pantalla
*/
const calcularVentasTotales = () => {
  let ventasTotales = 0;
  pedidos.forEach((pedido) => (ventasTotales += pedido.precio));
  $("#ventasTotales").text(`$${ventasTotales.toFixed(2)}`);
  /*
  Se agrega animación para cambiar el tamaño del texto
  */
  // $("#ventasTotales").animate({ fontSize: "30px" }, "slow", () => {
  //   $("#ventasTotales").delay(2000).animate({ fontSize: "20px" }, "slow");
  // });
};

/*
Muestra el precio de la cotizacion del dolar blue en pantalla (si logra obtenerlo de la API)
*/
const mostrarDolar = () => {
  cotizacionDolar && $("#cotizacionDolar").text(`$${cotizacionDolar}`);
};

/*
Borra todos los pedidos guardados en memoria y en el localStorage
*/
const clearPedidos = () => {
  pedidos = [];
};

/*
Ordena el array de pedidos de mayor a menor (o de menor a mayor) segun su precio
*/
const ordenarPorPrecio = (orden) => {
  pedidos = pedidos.sort((a, b) => {
    if (orden === "mayor") {
      return b.precio - a.precio;
    } else return a.precio - b.precio;
  });
  renderPedidos();
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
  guardarPedidos();
  renderPedidos();
};

/*
Elimina un pedido del array segun su id
*/
const eliminarPedido = (id) => {
  pedidos = pedidos.filter((pedido) => pedido.id !== id);
  guardarPedidos();
  renderPedidos();
};

/*
Muestra o oculta el modal de ingreso de pedidos, y al mostrarlo limpio el contenido
de los inputs. Al cambiar de estado se anima el proceso con efectos de fade y slide.
NOTA: antes de realizar el fadeIn, se aplica la clase "flex" para conservar los estilos
de la pagina.
*/
const changeModalStatus = (status) => {
  if (status) {
    $("#input-precio, #input-nombre, #input-telefono, #input-direccion").val(
      ""
    );

    $("#modal-container")
      .css("display", "flex")
      .hide()
      .fadeIn("fast", () => {
        $("#modal").css("display", "flex").hide().slideDown();
      });
  } else
    $("#modal").slideUp("fast", () => {
      $("#modal-container").fadeOut();
    });
};

/*
Levanta los datos ingresados en el modal de agregar pedido, verifica que esten
completos, y de ser asi crea un nuevo pedido con esos datos y lo guarda en el LocalStorage
*/
const agregarPedido = () => {
  const nombre = $("#input-nombre").val();
  const direccion = $("#input-direccion").val();
  const telefono = $("#input-telefono").val();
  const precio = Number.parseFloat($("#input-precio").val());

  if (nombre && direccion && telefono && precio) {
    const pedidoNew = new Pedido({ nombre, direccion, telefono, precio });
    pedidos.push(pedidoNew);
    guardarPedidos();
    renderPedidos();
    changeModalStatus(false);
  } else {
    alert("Faltan datos!");
  }
};

/*
Renderiza en pantalla la lista de pedidos del array, y actualiza el valor de
ventas totales
*/
const renderPedidos = () => {
  $("#pedidos").empty();
  pedidos.map((pedido) => {
    let pedidoHTML = `
    <li class="pedido__container">
    <p><b>Nombre:</b> ${pedido.nombre}</p>
    <p><b>Direccion:</b> ${pedido.direccion}</p>
    <p><b>Teléfono:</b> ${pedido.telefono}</p>
    <p><b>Precio:</b> $${pedido.precio.toFixed(2)}</p>
    `;
    if (cotizacionDolar) {
      pedidoHTML += `<p><b>Precio (en U$S):</b> $${(
        pedido.precio / parseFloat(cotizacionDolar)
      ).toFixed(2)}</p>`;
    }
    pedidoHTML += pedido.entregado
      ? `<button class="primary-button" onClick=cambiarEstadoPedido(${pedido.id})>Entregado</button>`
      : `<button class="primary-button" onClick=cambiarEstadoPedido(${pedido.id})>No entregado</button>`;
    pedidoHTML += `<button class="primary-button" onClick=eliminarPedido(${pedido.id})>Eliminar</button>`;
    pedidoHTML += "</li>";
    $("#pedidos").append(pedidoHTML);
  });
  calcularVentasTotales();
  mostrarDolar();
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
guardarPedidos();
renderPedidos();

/*
Agrego eventos a los diferentes botones de la pagina, y detecto las teclas
"enter" y "esc" en el dialogo del modal de ingreso de pedidos.
*/
$(() => {
  $.getJSON(
    "https://www.dolarsi.com/api/api.php?type=valoresprincipales",
    (res, status) => {
      if (status === "success") {
        cotizacionDolar =
          res.find((item) => item.casa.nombre === "Dolar Blue").casa.venta ||
          "";
        renderPedidos();
      }
    }
  );
  $("#boton-cancelar").click(() => changeModalStatus(false));
  $("#boton-aceptar").click(() => agregarPedido());
  $("#boton-agregar-pedido").click(() => changeModalStatus(true));
  $("#boton-ordenar-mayor").click(() => ordenarPorPrecio("mayor"));
  $("#boton-ordenar-menor").click(() => ordenarPorPrecio("menor"));
  $("#input-precio, #input-nombre, #input-telefono, #input-direccion").keydown(
    (e) => {
      if (e.keyCode === 13) agregarPedido();
      if (e.which === 27) changeModalStatus(false);
      e.stopPropagation();
    }
  );
  $(document).keydown((e) => {
    if (e.which === 27) changeModalStatus(false);
  });
});
