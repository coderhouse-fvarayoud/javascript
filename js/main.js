// Clase que representa el objeto Pedido
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
Borra todos los pedidos guardados en memoria y en el localStorage
*/
const clearPedidos = () => {
  pedidos = [];
};

/*
Ordena el array de pedidos de mayor a menor (o de menor a mayor) segun su precio
*/
const ordenarPedidos = (valor, orden) => {
  pedidos = pedidos.sort((a, b) => {
    if (valor === "nombre") {
      if (orden === "asc") {
        return a.nombre.localeCompare(b.nombre);
      } else return b.nombre.localeCompare(a.nombre);
    } else {
      if (orden === "desc") {
        return b.precio - a.precio;
      } else return a.precio - b.precio;
    }
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
const setIsModalOpen = (status) => {
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
    setIsModalOpen(false);
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
    <div class="pedido__container__top"><div>
    <p><b>${pedido.nombre}</b></p>
    <p>${pedido.direccion}</p>
    <p>${pedido.telefono}</p>
    </div>
    <div>
    <p class="pedido__container__precio"><b>$${pedido.precio.toFixed(2)}</b></p>
    `;
    if (cotizacionDolar) {
      pedidoHTML += `<p class="pedido__container__precio">$${(
        pedido.precio / parseFloat(cotizacionDolar)
      ).toFixed(2)}</p>`;
    }
    pedidoHTML += `</div></div>`;
    pedidoHTML += `<div class="pedido__container__buttons">`;
    pedidoHTML += pedido.entregado
      ? `<button class="button button--primary" onClick=cambiarEstadoPedido(${pedido.id})>Entregado</button>`
      : `<button class="button" onClick=cambiarEstadoPedido(${pedido.id})>No entregado</button>`;
    pedidoHTML += `<button class="button" onClick=eliminarPedido(${pedido.id})>Eliminar</button>`;
    pedidoHTML += `</div>`;
    pedidoHTML += "</li>";
    $("#pedidos").append(pedidoHTML);
  });
  calcularEstadisticas();
};

/*
Actualiza la sección de Resumen en pantalla
*/
const calcularEstadisticas = () => {
  cotizacionDolar && $("#cotizacionDolar").text(`$${cotizacionDolar}`);
  let ventasTotales = 0;
  pedidos.forEach((pedido) => (ventasTotales += pedido.precio));
  const cantidadPedidos = pedidos.length;
  const cantidadEntregados = pedidos.filter(
    (pedido) => pedido.entregado
  ).length;
  const promedioVentas =
    pedidos.length && (ventasTotales / pedidos.length).toFixed(2);
  const ventasTotalesUSD =
    cotizacionDolar && (ventasTotales / parseFloat(cotizacionDolar)).toFixed(2);

  $("#ventasTotales").text(`$${ventasTotales.toFixed(2)}`);
  cotizacionDolar && $("#ventasTotalesUSD").text(`$${ventasTotalesUSD}`);
  $("#cantidadPedidos").text(`${cantidadPedidos}`);
  $("#cantidadPedidosEntregados").text(`${cantidadEntregados}`);
  $("#promedioVentas").text(`$${promedioVentas}`);
};

/*
Codigo que inicializa el proyecto. Primero busca el array de pedidos en el
localStorage. Si no encuentra nada, levanta los pedidos hardcodeados en la constante
pedidosIniciales. Luego mapea ese JSON creando los objetos de tipo Pedido y los guarda
en el array "pedidos". Finalmente, guarda estos datos en el localStorage, y llama
a la funcion que renderiza la pantalla.
*/

let pedidos = [];
let cotizacionDolar = "";

$(() => {
  // Inicializo el array de pedidos con el localStorage, y si no existe con el archivo pedidosIniciales.json
  $.getJSON("data/pedidosIniciales.json", (json) => {
    const pedidosJSON =
      JSON.parse(localStorage.getItem("pedidos")) || json || [];
    pedidos = pedidosJSON.map((pedido) => new Pedido(pedido));
    ordenarPedidos("nombre", "asc");
    guardarPedidos();
    renderPedidos();
  });
  // Obtengo la cotizacion del dolar
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
  // Agrego eventos a los distintos elementos de la pagina
  $("#boton-aceptar").click(() => agregarPedido());
  $("#boton-cancelar").click(() => setIsModalOpen(false));
  $("#boton-agregar-pedido").click(() => setIsModalOpen(true));
  // Ordeno la lista de pedidos al elegir una opcion en el dropdown de orden
  $("#orden-dropdown").change(() => {
    const opcionElegida = $("#orden-dropdown").val();
    switch (opcionElegida) {
      case "nombre-asc":
        ordenarPedidos("nombre", "asc");
        break;
      case "nombre-desc":
        ordenarPedidos("nombre", "desc");
        break;
      case "precio-asc":
        ordenarPedidos("precio", "asc");
        break;
      case "precio-desc":
        ordenarPedidos("precio", "desc");
        break;
    }
  });
  //Agrego eventos de teclado al modal de ingreso de pedidos para poder aceptar con
  //Enter y salir con ESC
  $("#input-precio, #input-nombre, #input-telefono, #input-direccion").keydown(
    (e) => {
      if (e.keyCode === 13) agregarPedido();
      if (e.which === 27) setIsModalOpen(false);
      e.stopPropagation();
    }
  );
  $(document).keydown((e) => {
    if (e.which === 27) setIsModalOpen(false);
  });
});
